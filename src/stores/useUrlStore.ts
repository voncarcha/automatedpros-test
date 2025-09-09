import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface UrlSyncActions {
  syncFromUrl: (searchParams: URLSearchParams) => void;
  updateUrl: (params: Partial<{
    q: string;
    offset: string;
    types: string[];
    favorites: boolean;
  }>, router: ReturnType<typeof useRouter>) => void;
}

type UrlStore = UrlSyncActions;

export const useUrlStore = create<UrlStore>()(() => ({
  syncFromUrl: () => {
    // This will be handled by the hook that uses both stores
  },

  updateUrl: (params, router) => {
    const urlParams = new URLSearchParams();
    
    if (params.q && params.q.trim()) {
      urlParams.set('q', params.q);
    }
    
    if (params.offset && params.offset !== '0') {
      urlParams.set('offset', params.offset);
    }
    
    if (params.types && params.types.length > 0) {
      urlParams.set('types', params.types.join(','));
    }
    
    if (params.favorites) {
      urlParams.set('favorites', 'true');
    }

    const url = urlParams.toString() ? `?${urlParams.toString()}` : '';
    router.push(url, { scroll: false });
  },
}));

// Custom hook to sync URL with app state
export const useUrlSync = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  return {
    syncFromUrl: useCallback((updateAppState: (params: {
      searchQuery?: string;
      offset?: number;
      selectedTypes?: string[];
      showOnlyFavorites?: boolean;
    }) => void) => {
      const query = searchParams.get('q') || '';
      const offset = parseInt(searchParams.get('offset') || '0', 10);
      const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
      const favorites = searchParams.get('favorites') === 'true';

      updateAppState({
        searchQuery: query,
        offset: Math.max(0, offset),
        selectedTypes: types,
        showOnlyFavorites: favorites,
      });
    }, [searchParams]),

    updateUrl: useCallback((params: {
      searchQuery?: string;
      offset?: number;
      selectedTypes?: string[];
      showOnlyFavorites?: boolean;
    }) => {
      const urlParams = new URLSearchParams();
      
      if (params.searchQuery && params.searchQuery.trim()) {
        urlParams.set('q', params.searchQuery);
      }
      
      if (params.offset && params.offset > 0) {
        urlParams.set('offset', params.offset.toString());
      }
      
      if (params.selectedTypes && params.selectedTypes.length > 0) {
        urlParams.set('types', params.selectedTypes.join(','));
      }
      
      if (params.showOnlyFavorites) {
        urlParams.set('favorites', 'true');
      }

      const url = urlParams.toString() ? `?${urlParams.toString()}` : '';
      router.push(url, { scroll: false });
    }, [router]),
  };
};
