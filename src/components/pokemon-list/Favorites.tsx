"use client";

import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoritesProps {
  onFiltersChange?: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onFiltersChange }) => {
  const { 
    showOnlyFavorites, 
    toggleFavoritesFilter, 
    favoritesCount, 
    hasFavorites 
  } = useFavorites();

  const handleToggle = () => {
    toggleFavoritesFilter();
    onFiltersChange?.();
  };

  return (
    <Button
      variant={showOnlyFavorites ? "default" : "outline"}
      onClick={handleToggle}
      className="flex items-center gap-2"
      disabled={!hasFavorites}
      title={!hasFavorites ? "No favorites yet" : undefined}
    >
      <Heart 
        className={`h-4 w-4 ${showOnlyFavorites ? "fill-current" : ""}`}
      />
      Favorites
      {favoritesCount > 0 && (
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
