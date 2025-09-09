"use client";

import { useEffect, useRef } from "react";
import {
  usePokemonListWithDetails,
  usePokemonSearchWithTypesAndFavorites,
} from "@/hooks/usePokemon";
import { usePaginate } from "@/hooks/usePaginate";
import { useSearch } from "@/hooks/useSearch";
import { useTypeFilter } from "@/hooks/useTypeFilter";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/lib/pokemon-api";

import { Search } from "./Search";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { DataTable } from "./DataTable";
import { pokemonColumns } from "./columns";
import Filter from "./Filter";
import Favorites from "./Favorites";
import { useFavorites } from "@/contexts/FavoritesContext";

const PokemonList = () => {
  const limit = 20;
  const router = useRouter();
  const {
    offset,
    nextPage,
    previousPage,
    goToPage,
    currentPage,
    resetPagination,
  } = usePaginate(0, limit);
  const { query, debouncedQuery, setQuery, clearSearch, hasQuery } = useSearch(
    "",
    500
  );
  const { selectedTypes, hasTypesSelected } = useTypeFilter();
  const { favorites, showOnlyFavorites } = useFavorites();

  // Reset pagination when search query, types, or favorites filter change
  const prevDebouncedQuery = useRef(debouncedQuery);
  const prevSelectedTypes = useRef(selectedTypes);
  const prevShowOnlyFavorites = useRef(showOnlyFavorites);

  useEffect(() => {
    // Reset if search query, types, or favorites filter changed
    if (
      debouncedQuery !== prevDebouncedQuery.current ||
      JSON.stringify(selectedTypes) !==
        JSON.stringify(prevSelectedTypes.current) ||
      showOnlyFavorites !== prevShowOnlyFavorites.current
    ) {
      resetPagination();
      prevDebouncedQuery.current = debouncedQuery;
      prevSelectedTypes.current = selectedTypes;
      prevShowOnlyFavorites.current = showOnlyFavorites;
    }
  }, [debouncedQuery, selectedTypes, showOnlyFavorites, resetPagination]);

  // Determine if we should use filtering (query, types, or favorites)
  const hasFilters = hasQuery || hasTypesSelected || showOnlyFavorites;

  const {
    data: filteredData,
    isLoading: filteredLoading,
    error: filteredError,
  } = usePokemonSearchWithTypesAndFavorites(
    debouncedQuery,
    selectedTypes,
    favorites,
    showOnlyFavorites,
    offset,
    limit
  );

  const {
    data: regularData,
    isLoading: regularLoading,
    error: regularError,
  } = usePokemonListWithDetails(offset, limit, { enabled: !hasFilters });

  // Use filtered data when there are filters, otherwise use regular data
  const pokemonData = hasFilters ? filteredData?.results : regularData?.results;
  const totalResults = hasFilters
    ? filteredData?.total || 0
    : regularData?.total || 0;
  const isLoading = hasFilters ? filteredLoading : regularLoading;
  const error = hasFilters ? filteredError : regularError;

  const handlePrevious = () => {
    previousPage(limit);
  };

  const handleNext = () => {
    nextPage(limit);
  };

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/items/${pokemon.id}`);
  };

  const handleClearAllFilters = () => {
    clearSearch();
  };

  // Calculate total pages based on current results
  const totalPages = Math.ceil(totalResults / limit);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error Loading Pokemon
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex gap-2 flex-col-reverse md:flex-row">
        <Search
          query={query}
          onQueryChange={setQuery}
          onClearSearch={clearSearch}
          hasQuery={hasQuery}
          totalResults={totalResults}
        />
        <div className="flex gap-2">
          <Filter />
          <Favorites />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            {hasFilters ? "Filtering Pokemon..." : "Loading Pokemon..."}
          </span>
        </div>
      ) : (
        <>
          {/* Show empty state for filters with no results */}
          {hasFilters && (!pokemonData || pokemonData.length === 0) ? (
            <EmptyState
              query={
                hasQuery
                  ? query
                  : showOnlyFavorites
                  ? "favorites"
                  : `${selectedTypes.join(", ")} type${
                      selectedTypes.length > 1 ? "s" : ""
                    }`
              }
              onClearSearch={handleClearAllFilters}
            />
          ) : (
            <DataTable
              columns={pokemonColumns}
              data={pokemonData || []}
              onRowClick={handleRowClick}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            offset={offset}
            itemsPerPage={limit}
            currentItemsCount={pokemonData?.length || 0}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onGoToPage={goToPage}
            isLoading={isLoading}
            hasQuery={hasFilters}
          />
        </>
      )}
    </section>
  );
};

export default PokemonList;
