"use client";

import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface EmptyStateProps {
  query?: string;
  onClearSearch?: () => void;
  title?: string;
  description?: string;
  showClearButton?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  query,
  onClearSearch,
  title = "No Pokemon found",
  description,
  showClearButton = true,
  icon,
  className = "",
}: EmptyStateProps) => {
  const defaultDescription = query 
    ? `No Pokemon found matching "${query}". Try a different search term.`
    : "No Pokemon found.";

  return (
    <div className={`text-center py-12 ${className}`}>
      {icon || <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">
        {description || defaultDescription}
      </p>
      {showClearButton && onClearSearch && (
        <Button onClick={onClearSearch} variant="outline">
          Clear search
        </Button>
      )}
    </div>
  );
};
