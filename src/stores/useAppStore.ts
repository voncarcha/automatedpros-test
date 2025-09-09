import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AppState {
  // Search state
  searchQuery: string;
  debouncedSearchQuery: string;
  isSearching: boolean;
  
  // Pagination state
  offset: number;
  currentPage: number;
  limit: number;
  
  // Filter state
  selectedTypes: string[];
  showOnlyFavorites: boolean;
  
  // UI state
  isInitialized: boolean;
}

interface AppActions {
  // Search actions
  setSearchQuery: (query: string) => void;
  setDebouncedSearchQuery: (query: string) => void;
  setIsSearching: (searching: boolean) => void;
  clearSearch: () => void;
  
  // Pagination actions
  setOffset: (offset: number) => void;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  resetPagination: () => void;
  
  // Filter actions
  setSelectedTypes: (types: string[]) => void;
  addSelectedType: (type: string) => void;
  removeSelectedType: (type: string) => void;
  clearSelectedTypes: () => void;
  setShowOnlyFavorites: (show: boolean) => void;
  toggleFavoritesFilter: () => void;
  clearFavoritesFilter: () => void;
  
  // UI actions
  setIsInitialized: (initialized: boolean) => void;
  
  // Computed getters
  hasActiveFilters: () => boolean;
  hasSearchQuery: () => boolean;
  getCurrentPageNumber: () => number;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    searchQuery: '',
    debouncedSearchQuery: '',
    isSearching: false,
    offset: 0,
    currentPage: 0,
    limit: 20,
    selectedTypes: [],
    showOnlyFavorites: false,
    isInitialized: false,

    // Search actions
    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    setDebouncedSearchQuery: (query: string) => {
      set({ debouncedSearchQuery: query });
    },

    setIsSearching: (searching: boolean) => {
      set({ isSearching: searching });
    },

    clearSearch: () => {
      set({ 
        searchQuery: '', 
        debouncedSearchQuery: '',
        isSearching: false 
      });
      get().resetPagination();
    },

    // Pagination actions
    setOffset: (offset: number) => {
      const { limit } = get();
      const currentPage = Math.floor(offset / limit);
      set({ offset, currentPage });
    },

    setCurrentPage: (page: number) => {
      const { limit } = get();
      const offset = page * limit;
      set({ currentPage: page, offset });
    },

    setLimit: (limit: number) => {
      const { offset } = get();
      const currentPage = Math.floor(offset / limit);
      set({ limit, currentPage });
    },

    nextPage: () => {
      const { offset, limit } = get();
      const newOffset = offset + limit;
      const currentPage = Math.floor(newOffset / limit);
      set({ offset: newOffset, currentPage });
    },

    previousPage: () => {
      const { offset, limit } = get();
      const newOffset = Math.max(0, offset - limit);
      const currentPage = Math.floor(newOffset / limit);
      set({ offset: newOffset, currentPage });
    },

    goToPage: (page: number) => {
      const { limit } = get();
      const offset = Math.max(0, page * limit);
      set({ currentPage: page, offset });
    },

    resetPagination: () => {
      set({ offset: 0, currentPage: 0 });
    },

    // Filter actions
    setSelectedTypes: (types: string[]) => {
      set({ selectedTypes: types });
      get().resetPagination();
    },

    addSelectedType: (type: string) => {
      const { selectedTypes } = get();
      if (!selectedTypes.includes(type)) {
        set({ selectedTypes: [...selectedTypes, type] });
        get().resetPagination();
      }
    },

    removeSelectedType: (type: string) => {
      const { selectedTypes } = get();
      set({ selectedTypes: selectedTypes.filter(t => t !== type) });
      get().resetPagination();
    },

    clearSelectedTypes: () => {
      set({ selectedTypes: [] });
      get().resetPagination();
    },

    setShowOnlyFavorites: (show: boolean) => {
      set({ showOnlyFavorites: show });
      get().resetPagination();
    },

    toggleFavoritesFilter: () => {
      const { showOnlyFavorites } = get();
      set({ showOnlyFavorites: !showOnlyFavorites });
      get().resetPagination();
    },

    clearFavoritesFilter: () => {
      set({ showOnlyFavorites: false });
      get().resetPagination();
    },

    // UI actions
    setIsInitialized: (initialized: boolean) => {
      set({ isInitialized: initialized });
    },

    // Computed getters
    hasActiveFilters: () => {
      const { selectedTypes, showOnlyFavorites, debouncedSearchQuery } = get();
      return selectedTypes.length > 0 || showOnlyFavorites || debouncedSearchQuery.trim().length > 0;
    },

    hasSearchQuery: () => {
      return get().searchQuery.trim().length > 0;
    },

    getCurrentPageNumber: () => {
      return get().currentPage;
    },
  }))
);
