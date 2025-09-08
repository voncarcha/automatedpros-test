"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClearSearch: () => void;
  hasQuery: boolean;
  totalResults?: number;
  placeholder?: string;
  className?: string;
}

export const Search = ({
  query,
  onQueryChange,
  onClearSearch,
  hasQuery,
  totalResults,
  placeholder = "Search Pokemon...",
  className = "",
}: SearchProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {hasQuery && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {hasQuery && totalResults !== undefined && (
        <p className="text-sm text-gray-600 mt-2">
          {totalResults > 0
            ? `Found ${totalResults} Pokemon matching "${query}"`
            : `No Pokemon found matching "${query}"`}
        </p>
      )}
    </div>
  );
};
