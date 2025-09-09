"use client";

import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

interface FavoritesProps {
  onFiltersChange?: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onFiltersChange }) => {
  const showOnlyFavorites = useAppStore((state) => state.showOnlyFavorites);
  const toggleFavoritesFilter = useAppStore((state) => state.toggleFavoritesFilter);
  const favoritesCount = useFavoritesStore((state) => state.getFavoritesCount());
  const hasFavorites = useFavoritesStore((state) => state.getHasFavorites());
  const isLoading = useFavoritesStore((state) => state.isLoading);

  const handleToggle = () => {
    toggleFavoritesFilter();
    onFiltersChange?.();
  };

  // Prevent hydration mismatches by not rendering dynamic content until loaded
  const showDynamicContent = !isLoading;
  const shouldDisable = showDynamicContent ? !hasFavorites : false;
  const titleText = showDynamicContent && !hasFavorites ? "No favorites yet" : undefined;

  return (
    <Button
      variant={showOnlyFavorites ? "default" : "outline"}
      onClick={handleToggle}
      className="flex items-center gap-2"
      disabled={shouldDisable}
      title={titleText}
    >
      <Heart 
        className={`h-4 w-4 ${showOnlyFavorites ? "fill-current" : ""}`}
      />
      Favorites
      {showDynamicContent && favoritesCount > 0 && (
        <Badge 
          variant="secondary" 
          className={`ml-1 px-1 py-0 text-xs ${
            showOnlyFavorites ? "bg-white/20 text-white" : ""
          }`}
        >
          {favoritesCount}
        </Badge>
      )}
    </Button>
  );
};

export default Favorites;
