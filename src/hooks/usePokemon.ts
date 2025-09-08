import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  fetchPokemonList, 
  fetchPokemonDetail, 
  fetchPokemonListWithDetails,
  Pokemon,
  PokemonDetailResponse 
} from '@/lib/pokemon-api';

// Hook for fetching Pokemon list (simple names and URLs)
export const usePokemonList = (offset: number = 0, limit: number = 20) => {
  return useQuery({
    queryKey: ['pokemon-list', offset, limit],
    queryFn: () => fetchPokemonList(offset, limit),
    staleTime: 5 * 60 * 1000, 
  });
};

// Hook for fetching Pokemon list with details (images, types, etc.)
export const usePokemonListWithDetails = (offset: number = 0, limit: number = 20) => {
  return useQuery({
    queryKey: ['pokemon-list-details', offset, limit],
    queryFn: () => fetchPokemonListWithDetails(offset, limit),
    staleTime: 5 * 60 * 1000, 
  });
};

// Hook for fetching single Pokemon detail
export const usePokemonDetail = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon-detail', nameOrId],
    queryFn: () => fetchPokemonDetail(nameOrId),
    enabled: !!nameOrId,
    staleTime: 10 * 60 * 1000, 
  });
};

// Hook for infinite scrolling Pokemon list
export const useInfinitePokemonList = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite', limit],
    queryFn: ({ pageParam = 0 }) => fetchPokemonListWithDetails(pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      const nextOffset = pages.length * limit;
      return nextOffset < 1000 ? nextOffset : undefined; // Limit to first 1000 Pokemon
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};
