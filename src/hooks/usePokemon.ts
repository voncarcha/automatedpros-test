import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchPokemonList,
  fetchPokemonDetail,
  fetchPokemonListWithDetails,
  searchPokemonByName,
  searchPokemonByNameAndTypes,
  fetchPokemonTypes,
} from "@/lib/pokemon-api";

const STALE_TIME = 5 * 60 * 1000;

// Hook for fetching Pokemon list (simple names and URLs)
export const usePokemonList = (offset: number = 0, limit: number = 20) => {
  return useQuery({
    queryKey: ["pokemon-list", offset, limit],
    queryFn: () => fetchPokemonList(offset, limit),
    staleTime: STALE_TIME,
  });
};

// Hook for fetching Pokemon list with details (images, types, etc.)
export const usePokemonListWithDetails = (
  offset: number = 0,
  limit: number = 20,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["pokemon-list-details", offset, limit],
    queryFn: () => fetchPokemonListWithDetails(offset, limit),
    staleTime: STALE_TIME,
    enabled: options?.enabled ?? true,
  });
};

// Hook for fetching single Pokemon detail
export const usePokemonDetail = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ["pokemon-detail", nameOrId],
    queryFn: () => fetchPokemonDetail(nameOrId),
    enabled: !!nameOrId,
    staleTime: STALE_TIME,
  });
};

// Hook for infinite scrolling Pokemon list
export const useInfinitePokemonList = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["pokemon-infinite", limit],
    queryFn: ({ pageParam = 0 }) =>
      fetchPokemonListWithDetails(pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      const nextOffset = pages.length * limit;
      return nextOffset < 1000 ? nextOffset : undefined; // Limit to first 1000 Pokemon
    },
    initialPageParam: 0,
    staleTime: STALE_TIME,
  });
};

// Hook for searching Pokemon with pagination
export const usePokemonSearch = (
  query: string,
  offset: number = 0,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["pokemon-search", query, offset, limit],
    queryFn: () => searchPokemonByName(query, offset, limit),
    enabled: !!query.trim(), // Only enabled when there's an actual search query
    staleTime: STALE_TIME,
  });
};

// Hook for searching Pokemon with name and type filtering
export const usePokemonSearchWithTypes = (
  query: string = "",
  selectedTypes: string[] = [],
  offset: number = 0,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["pokemon-search-types", query, selectedTypes, offset, limit],
    queryFn: () => searchPokemonByNameAndTypes(query, selectedTypes, offset, limit),
    enabled: !!query.trim() || selectedTypes.length > 0, // Enabled when there's a query or types selected
    staleTime: STALE_TIME,
  });
};

// Hook for fetching all Pokemon types
export const usePokemonTypes = () => {
  return useQuery({
    queryKey: ["pokemon-types"],
    queryFn: fetchPokemonTypes,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes since types rarely change
  });
};
