import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useUrlSync } from '@/stores/useUrlStore';
import { useDebounce } from './useDebounce';
import { usePokemonListWithDetails } from './usePokemon';
import { searchPokemonByNameTypesAndFavorites } from '@/lib/pokemon-api';

/**
 * Main hook that combines all Pokemon app state management
 * This replaces the individual hooks and context providers
 */
export const usePokemonApp = () => {
  const searchParams = useSearchParams();
  const { syncFromUrl, updateUrl } = useUrlSync();

  // App state
  const {
    searchQuery,
    debouncedSearchQuery,
    isSearching,
    offset,
    currentPage,
    limit,
    selectedTypes,
    showOnlyFavorites,
    isInitialized,
    setSearchQuery,
    setOffset,
    setSelectedTypes,
    setShowOnlyFavorites,
    setIsInitialized,
    resetPagination,
    nextPage,
    previousPage,
    goToPage,
    clearSearch,
    hasActiveFilters,
    hasSearchQuery,
  } = useAppStore();

  // Favorites state
  const {
    favorites,
    isLoading: favoritesLoading,
    isFavorite,
    toggleFavorite,
    getFavoritesArray,
    getFavoritesCount,
    getHasFavorites,
    clearAllFavorites,
  } = useFavoritesStore();

  // Debounce search query
  useDebounce(searchQuery, 500);

  // Sync with URL on mount and when search params change
  useEffect(() => {
    if (!isInitialized) {
      syncFromUrl((params) => {
        if (params.searchQuery !== undefined) setSearchQuery(params.searchQuery);
        if (params.offset !== undefined) setOffset(params.offset);
        if (params.selectedTypes !== undefined) setSelectedTypes(params.selectedTypes);
        if (params.showOnlyFavorites !== undefined) setShowOnlyFavorites(params.showOnlyFavorites);
      });
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized, syncFromUrl, setSearchQuery, setOffset, setSelectedTypes, setShowOnlyFavorites, setIsInitialized]);

  // Update URL when state changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      updateUrl({
        searchQuery: debouncedSearchQuery,
        offset,
        selectedTypes,
        showOnlyFavorites,
      });
    }
  }, [debouncedSearchQuery, offset, selectedTypes, showOnlyFavorites, isInitialized, updateUrl]);

  // Get favorites array for API calls
  const favoritesArray = getFavoritesArray();

  // Determine which query to use
  const shouldUseSearch = hasActiveFilters();
  
  // Don't fetch data until favorites are loaded when showing only favorites
  const canFetchData = !favoritesLoading || !showOnlyFavorites;
  
  // Fetch Pokemon data - only run search when favorites are loaded (if needed)
  const searchEnabled = shouldUseSearch && canFetchData;
  const searchQuery$ = useQuery({
    queryKey: ["pokemon-search-full", debouncedSearchQuery, selectedTypes, favoritesArray, showOnlyFavorites, offset, limit],
    queryFn: () => searchPokemonByNameTypesAndFavorites(debouncedSearchQuery, selectedTypes, favoritesArray, showOnlyFavorites, offset, limit),
    enabled: searchEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const listQuery = usePokemonListWithDetails(offset, limit, {
    enabled: !shouldUseSearch && canFetchData,
  });

  // Use search results if we have active filters, otherwise use list
  const activeQuery = shouldUseSearch ? searchQuery$ : listQuery;

  // Actions that also update URL
  const setSearchQueryWithUrl = (query: string) => {
    setSearchQuery(query);
    resetPagination();
  };

  const setSelectedTypesWithUrl = (types: string[]) => {
    setSelectedTypes(types);
  };

  const setShowOnlyFavoritesWithUrl = (show: boolean) => {
    setShowOnlyFavorites(show);
  };

  const clearSearchWithUrl = () => {
    clearSearch();
  };

  const setOffsetWithUrl = (newOffset: number) => {
    setOffset(newOffset);
  };

  const nextPageWithUrl = () => {
    nextPage();
  };

  const previousPageWithUrl = () => {
    previousPage();
  };

  const goToPageWithUrl = (page: number) => {
    goToPage(page);
  };

  return {
    // Data
    pokemon: activeQuery.data?.results || [],
    totalCount: activeQuery.data?.total || 0,
    isLoading: activeQuery.isLoading || favoritesLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,
    
    // Search state
    searchQuery,
    debouncedSearchQuery,
    isSearching,
    hasSearchQuery: hasSearchQuery(),
    
    // Pagination state
    offset,
    currentPage,
    limit,
    
    // Filter state
    selectedTypes,
    showOnlyFavorites,
    hasActiveFilters: hasActiveFilters(),
    
    // Favorites state
    favorites,
    favoritesCount: getFavoritesCount(),
    hasFavorites: getHasFavorites(),
    isFavorite,
    
    // Actions
    setSearchQuery: setSearchQueryWithUrl,
    clearSearch: clearSearchWithUrl,
    setOffset: setOffsetWithUrl,
    nextPage: nextPageWithUrl,
    previousPage: previousPageWithUrl,
    goToPage: goToPageWithUrl,
    resetPagination,
    setSelectedTypes: setSelectedTypesWithUrl,
    setShowOnlyFavorites: setShowOnlyFavoritesWithUrl,
    toggleFavorite,
    clearAllFavorites,
    
    // Utils
    refetch: activeQuery.refetch,
  };
};
