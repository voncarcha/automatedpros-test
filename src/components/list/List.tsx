"use client";

import { DataTable } from "./DataTable";
import { pokemonColumns } from "./columns";
import { usePokemonListWithDetails } from "@/hooks/usePokemon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/lib/pokemon-api";

const List = () => {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const router = useRouter();
  
  const { data: pokemonData, isLoading, error, isFetching } = usePokemonListWithDetails(offset, limit);

  const handlePrevious = () => {
    setOffset(Math.max(0, offset - limit));
  };

  const handleNext = () => {
    setOffset(offset + limit);
  };

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/items/${pokemon.id}`);
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
            
            <div className="flex gap-2">
              <Button 
                onClick={handlePrevious} 
                disabled={offset === 0 || isFetching}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={isFetching}
                variant="outline"
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
