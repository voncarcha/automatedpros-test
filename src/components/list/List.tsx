"use client";

import { DataTable } from "./DataTable";
import { pokemonColumns } from "./columns";
import { usePokemonListWithDetails } from "@/hooks/usePokemon";
import { useOffsetParam } from "@/hooks/useOffsetParam";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/lib/pokemon-api";

const List = () => {
  const limit = 20;
  const router = useRouter();
  const { offset, nextPage, previousPage, goToPage, currentPage } = useOffsetParam(0, limit);
  
  const { data: pokemonData, isLoading, error, isFetching } = usePokemonListWithDetails(offset, limit);

  const handlePrevious = () => {
    previousPage(limit);
  };

  const handleNext = () => {
    nextPage(limit);
  };

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/items/${pokemon.id}`);
  };

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

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Pokemon</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <section className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading Pokemon...</span>
        </div>
      ) : (
        <>
          <DataTable columns={pokemonColumns} data={pokemonData || []} onRowClick={handleRowClick} />
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {offset + 1} to {offset + (pokemonData?.length || 0)} of Pokemon
              {isFetching && <span className="ml-2">(Loading...)</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handlePrevious} 
                disabled={offset === 0 || isFetching}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              {/* Page Number Buttons */}
              <div className="flex gap-1">
                {getVisiblePages(currentPage, 50).map((pageIndex) => {
                  const pageNumber = pageIndex + 1;
                  const isCurrentPage = currentPage === pageIndex;
                  
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => goToPage(pageIndex, limit)}
                      disabled={isFetching}
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
                onClick={handleNext} 
                disabled={isFetching}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default List;
