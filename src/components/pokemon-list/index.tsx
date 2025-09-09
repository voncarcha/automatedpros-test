"use client";

import { usePokemonApp } from "@/hooks/usePokemonApp";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/lib/pokemon-api";

import { Search } from "./Search";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { DataTable } from "./DataTable";
import { pokemonColumns } from "./columns";
import Filter from "./Filter";
import Favorites from "./Favorites";

const PokemonList = () => {
  const router = useRouter();
  const {
    // Data
    pokemon,
    totalCount,
    isLoading,
    isError,
    error,
    
    // Search state
    searchQuery,
    hasSearchQuery,
    
    // Pagination state
    offset,
    currentPage,
    limit,
    
    // Filter state
    selectedTypes,
    showOnlyFavorites,
    hasActiveFilters,
    
    // Actions
    setSearchQuery,
    clearSearch,
    nextPage,
    previousPage,
    goToPage,
  } = usePokemonApp();

  const handlePrevious = () => {
    previousPage();
  };

  const handleNext = () => {
    nextPage();
  };

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/items/${pokemon.id}`);
  };

  const handleClearAllFilters = () => {
    clearSearch();
  };

  // Calculate total pages based on current results
  const totalPages = Math.ceil(totalCount / limit);

  if (isError && error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error Loading Pokemon
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex gap-2 flex-col-reverse md:flex-row">
        <Search
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onClearSearch={clearSearch}
          hasQuery={hasSearchQuery}
          totalResults={totalCount}
        />
        <div className="flex gap-2">
          <Filter />
          <Favorites />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            {hasActiveFilters ? "Filtering Pokemon..." : "Loading Pokemon..."}
          </span>
        </div>
      ) : (
        <>
          {/* Show empty state for filters with no results */}
          {hasActiveFilters && (!pokemon || pokemon.length === 0) ? (
            <EmptyState
              query={
                hasSearchQuery
                  ? searchQuery
                  : showOnlyFavorites
                  ? "favorites"
                  : `${selectedTypes.join(", ")} type${
                      selectedTypes.length > 1 ? "s" : ""
                    }`
              }
              onClearSearch={handleClearAllFilters}
            />
          ) : (
            <DataTable
              columns={pokemonColumns}
              data={pokemon || []}
              onRowClick={handleRowClick}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalCount}
            offset={offset}
            itemsPerPage={limit}
            currentItemsCount={pokemon?.length || 0}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onGoToPage={goToPage}
            isLoading={isLoading}
            hasQuery={hasActiveFilters}
          />
        </>
      )}
    </section>
  );
};

export default PokemonList;
