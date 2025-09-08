"use client";

import { useEffect, useRef } from "react";
import { DataTable } from "./DataTable";
import { pokemonColumns } from "./columns";
import {
  usePokemonListWithDetails,
  usePokemonSearch,
} from "@/hooks/usePokemon";
import { usePaginate } from "@/hooks/usePaginate";
import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/lib/pokemon-api";
import { Search } from "./Search";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import Filter from "./Filter";

const PokemonList = () => {
  const limit = 20;
  const router = useRouter();
  const { offset, nextPage, previousPage, goToPage, currentPage, resetPagination } = usePaginate(
    0,
    limit
  );
  const { query, debouncedQuery, setQuery, clearSearch, hasQuery } = useSearch();

  // Reset pagination when search query changes (but not when just toggling search state)
  const prevDebouncedQuery = useRef(debouncedQuery);
  useEffect(() => {
    // Only reset if the actual search query changed, not just the hasQuery state
    if (debouncedQuery !== prevDebouncedQuery.current) {
      resetPagination();
      prevDebouncedQuery.current = debouncedQuery;
    }
  }, [debouncedQuery, resetPagination]);

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = usePokemonSearch(debouncedQuery, offset, limit);

  const {
    data: regularData,
    isLoading: regularLoading,
    error: regularError,
  } = usePokemonListWithDetails(offset, limit, { enabled: !hasQuery });

  // Use search data when there's a query, otherwise use regular data
  const pokemonData = hasQuery ? searchData?.results : regularData?.results;
  const totalResults = hasQuery ? searchData?.total || 0 : regularData?.total || 0;
  const isLoading = hasQuery ? searchLoading : regularLoading;
  const error = hasQuery ? searchError : regularError;

  const handlePrevious = () => {
    previousPage(limit);
  };

  const handleNext = () => {
    nextPage(limit);
  };

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/items/${pokemon.id}`);
  };

  // Calculate total pages based on current results
  const totalPages = Math.ceil(totalResults / limit);

  if (error) {
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
      {/* <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pokemon Directory</h1>
        {totalResults > 0 && (
          <p className="text-lg text-gray-600">
            Discover all {totalResults.toLocaleString()} Pokemon from the official Pokedex
          </p>
        )}
      </div> */}
      
      <div className="flex gap-2">
        <Search
          query={query}
          onQueryChange={setQuery}
          onClearSearch={clearSearch}
          hasQuery={hasQuery}
          totalResults={totalResults}
        />
        <Filter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            {hasQuery ? "Searching Pokemon..." : "Loading Pokemon..."}
          </span>
        </div>
      ) : (
        <>
          {/* Show empty state for search with no results */}
          {hasQuery && (!pokemonData || pokemonData.length === 0) ? (
            <EmptyState query={query} onClearSearch={clearSearch} />
          ) : (
            <DataTable
              columns={pokemonColumns}
              data={pokemonData || []}
              onRowClick={handleRowClick}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            offset={offset}
            itemsPerPage={limit}
            currentItemsCount={pokemonData?.length || 0}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onGoToPage={goToPage}
            isLoading={isLoading}
            hasQuery={hasQuery}
          />
        </>
      )}
    </section>
  );
};

export default PokemonList;
