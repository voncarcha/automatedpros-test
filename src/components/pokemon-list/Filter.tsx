"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { usePokemonTypes } from "@/hooks/usePokemon";
import { useTypeFilter } from "@/hooks/useTypeFilter";
import { ChevronDown, X, Filter as FilterIcon } from "lucide-react";

interface FilterProps {
  onFiltersChange?: () => void;
}

const TypeFilter: React.FC<FilterProps> = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: pokemonTypes, isLoading: typesLoading } = usePokemonTypes();
  const {
    selectedTypes,
    toggleType,
    clearTypes,
    hasTypesSelected,
  } = useTypeFilter();

  const handleTypeToggle = (typeName: string) => {
    toggleType(typeName);
    onFiltersChange?.();
  };

  const handleClearAll = () => {
    clearTypes();
    onFiltersChange?.();
    setIsOpen(false);
  };

  // Get the color for each Pokemon type
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-200",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return typeColors[type] || "bg-gray-400";
  };

  return (
    <div className="relative">
      <Button
        variant={hasTypesSelected ? "default" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <FilterIcon className="h-4 w-4" />
        Types
        {hasTypesSelected && (
          <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
            {selectedTypes.length}
          </Badge>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Filter by Types</h3>
              {hasTypesSelected && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Selected Types */}
            {hasTypesSelected && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      className={`${getTypeColor(type)} text-white cursor-pointer hover:opacity-80 flex items-center gap-1`}
                      onClick={() => handleTypeToggle(type)}
                    >
                      {type}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Types */}
            {typesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading types...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {pokemonTypes
                  ?.filter((type) => !["unknown", "shadow"].includes(type.name)) // Filter out special types
                  .map((type) => (
                    <button
                      key={type.name}
                      onClick={() => handleTypeToggle(type.name)}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium transition-all capitalize
                        ${
                          selectedTypes.includes(type.name)
                            ? `${getTypeColor(type.name)} text-white`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      {type.name}
                    </button>
                  ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TypeFilter;