import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

interface FavoritesState {
  favorites: Set<number>;
  isLoading: boolean;
}

interface FavoritesActions {
  isFavorite: (pokemonId: number) => boolean;
  addToFavorites: (pokemonId: number) => void;
  removeFromFavorites: (pokemonId: number) => void;
  toggleFavorite: (pokemonId: number) => void;
  clearAllFavorites: () => void;
  getFavoritesArray: () => number[];
  getFavoritesCount: () => number;
  getHasFavorites: () => boolean;
  setIsLoading: (loading: boolean) => void;
}

type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // State
      favorites: new Set<number>(),
      isLoading: true,

      // Actions
      isFavorite: (pokemonId: number) => {
        return get().favorites.has(pokemonId);
      },

      addToFavorites: (pokemonId: number) => {
        set((state) => {
          if (state.favorites.has(pokemonId)) return state;
          const newFavorites = new Set(state.favorites);
          newFavorites.add(pokemonId);
          return { favorites: newFavorites };
        });
      },

      removeFromFavorites: (pokemonId: number) => {
        set((state) => {
          if (!state.favorites.has(pokemonId)) return state;
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(pokemonId);
          return { favorites: newFavorites };
        });
      },

      toggleFavorite: (pokemonId: number) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (state.favorites.has(pokemonId)) {
            newFavorites.delete(pokemonId);
          } else {
            newFavorites.add(pokemonId);
          }
          return { favorites: newFavorites };
        });
      },

      clearAllFavorites: () => {
        set({ favorites: new Set() });
      },

      getFavoritesArray: () => {
        return Array.from(get().favorites);
      },

      getFavoritesCount: () => {
        return get().favorites.size;
      },

      getHasFavorites: () => {
        return get().favorites.size > 0;
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            // Convert the favorites array back to a Set
            if (parsed.state && Array.isArray(parsed.state.favorites)) {
              parsed.state.favorites = new Set(parsed.state.favorites);
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // Convert Set to Array for JSON serialization
            const toStore = {
              ...value,
              state: {
                ...value.state,
                favorites: Array.from(value.state.favorites),
              },
            };
            localStorage.setItem(name, JSON.stringify(toStore));
          } catch {
            // Silently fail
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        // Set loading to false after rehydration
        if (state) {
          state.setIsLoading(false);
        }
      },
    }
  )
);
