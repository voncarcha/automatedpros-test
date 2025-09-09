"use client";

import React from "react";
import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  pokemonId: number;
  isFavorite: boolean;
  onToggle: (pokemonId: number) => void;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "text";
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  pokemonId,
  isFavorite,
  onToggle,
  size = "md",
  variant = "icon",
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(pokemonId);
  };

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full hover:bg-red-50 transition-colors",
          sizeClasses[size],
          className
        )}
        onClick={handleClick}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors",
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="sm"
      className={cn(
        "flex items-center gap-2 transition-colors",
        isFavorite
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "hover:bg-red-50 hover:text-red-600 hover:border-red-300",
        className
      )}
      onClick={handleClick}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-colors",
          isFavorite ? "fill-current" : ""
        )}
      />
      {isFavorite ? "Favorited" : "Add to Favorites"}
    </Button>
  );
};
