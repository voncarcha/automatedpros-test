"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

interface FavoritesContextType {
  favorites: number[];
  favoritesCount: number;
  isLoading: boolean;
  isFavorite: (pokemonId: number) => boolean;
  addToFavorites: (pokemonId: number) => void;
  removeFromFavorites: (pokemonId: number) => void;
  toggleFavorite: (pokemonId: number) => void;
  clearAllFavorites: () => void;
  showOnlyFavorites: boolean;
  toggleFavoritesFilter: () => void;
  clearFavoritesFilter: () => void;
  hasFavorites: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load favorites from localStorage on mount
  useEffect(() => {
    console.log(`🚀 CONTEXT: FavoritesProvider initializing...`);
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      console.log(`📖 CONTEXT: Loading from localStorage:`, stored);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        console.log(`📋 CONTEXT: Parsed favorite IDs:`, favoriteIds);
        setFavorites(new Set(favoriteIds));
      } else {
        console.log(`📋 CONTEXT: No existing favorites found, starting fresh`);
      }
    } catch (error) {
      console.warn("Failed to load favorites from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: Set<number>) => {
    try {
      const favoriteArray = Array.from(newFavorites);
      console.log(`💾 CONTEXT: Saving to localStorage:`, favoriteArray);
      
      // Read current localStorage value before saving
      const currentStored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      console.log(`📖 CONTEXT: Current localStorage value:`, currentStored);
      
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteArray));
      
      // Verify what was actually saved
      const savedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);
      console.log(`✅ CONTEXT: Verified saved value:`, savedValue);
    } catch (error) {
      console.warn("Failed to save favorites to localStorage:", error);
    }
  }, []);

  // Check if favorites filter is active from URL
  const showOnlyFavorites = searchParams.get("favorites") === "true";

  // Add a Pokemon to favorites
  const addToFavorites = useCallback(
    (pokemonId: number) => {
      setFavorites((prev) => {
        if (prev.has(pokemonId)) return prev; // Already a favorite
        const newFavorites = new Set(prev);
        newFavorites.add(pokemonId);
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  // Remove a Pokemon from favorites
  const removeFromFavorites = useCallback(
    (pokemonId: number) => {
      setFavorites((prev) => {
        if (!prev.has(pokemonId)) return prev; // Not a favorite
        const newFavorites = new Set(prev);
        newFavorites.delete(pokemonId);
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (pokemonId: number) => {
      console.log(`🔄 CONTEXT: Toggle favorite called for Pokemon ${pokemonId}`);
      setFavorites((prev) => {
        console.log(`📋 CONTEXT: Current favorites before toggle:`, Array.from(prev));
        const newFavorites = new Set(prev);
        
        if (prev.has(pokemonId)) {
          // Remove from favorites
          console.log(`➖ CONTEXT: Removing Pokemon ${pokemonId} from favorites`);
          newFavorites.delete(pokemonId);
        } else {
          // Add to favorites
          console.log(`➕ CONTEXT: Adding Pokemon ${pokemonId} to favorites`);
          newFavorites.add(pokemonId);
        }
        
        const newArray = Array.from(newFavorites);
        console.log(`📋 CONTEXT: New favorites after toggle:`, newArray);
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  // Check if a Pokemon is favorited
  const isFavorite = useCallback(
    (pokemonId: number) => favorites.has(pokemonId),
    [favorites]
  );

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    setFavorites(new Set());
    saveFavorites(new Set());
  }, [saveFavorites]);

  // Get favorites count
  const favoritesCount = favorites.size;

  // Get array of favorite IDs
  const favoriteIds = Array.from(favorites);

  // Toggle favorites filter in URL
  const toggleFavoritesFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (showOnlyFavorites) {
      params.delete("favorites");
    } else {
      params.set("favorites", "true");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [showOnlyFavorites, searchParams, router]);

  // Clear favorites filter
  const clearFavoritesFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("favorites");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const value = {
    favorites: favoriteIds,
    favoritesCount,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    showOnlyFavorites,
    toggleFavoritesFilter,
    clearFavoritesFilter,
    hasFavorites: favoritesCount > 0,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
