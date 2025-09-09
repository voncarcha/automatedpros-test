"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  offset: number;
  itemsPerPage: number;
  currentItemsCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToPage: (page: number, limit: number) => void;
  isLoading?: boolean;
  hasQuery?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalResults,
  offset,
  itemsPerPage,
  currentItemsCount,
  onPrevious,
  onNext,
  onGoToPage,
  isLoading = false,
  hasQuery = false,
  maxVisiblePages = 5,
  className = "",
}: PaginationProps) => {
  // Helper function to calculate visible page numbers
  const getVisiblePages = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
    const halfVisible = Math.floor(maxVisible / 2);
    
    // Calculate start and end page numbers
    let startPage = Math.max(0, currentPage - halfVisible);
    const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Don't render if no data
  if (currentItemsCount === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between mt-6 ${className} md:flex-row flex-col-reverse gap-3`}>
      <div className="text-sm text-gray-600">
        Showing {offset + 1} to {offset + currentItemsCount} of {totalResults.toLocaleString()} Pokemon
        {hasQuery && <span className="ml-2">(filtered)</span>}
        {isLoading && <span className="ml-2">(Loading...)</span>}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onPrevious} 
          disabled={offset === 0 || isLoading}
          variant="outline"
        >
          Previous
        </Button>
        
        {/* Page Number Buttons */}
        <div className="flex gap-1">
          {getVisiblePages(currentPage, totalPages, maxVisiblePages).map((pageIndex) => {
            const pageNumber = pageIndex + 1;
            const isCurrentPage = currentPage === pageIndex;
            
            return (
              <Button
                key={pageNumber}
                onClick={() => onGoToPage(pageIndex, itemsPerPage)}
                disabled={isLoading}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                className={`w-10 h-10 p-0 ${
                  isCurrentPage 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        <Button 
          onClick={onNext} 
          disabled={isLoading}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};