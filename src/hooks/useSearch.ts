import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook to manage search query in URL parameters with debouncing
 * @param defaultQuery - Default search query (defaults to empty string)
 * @param debounceMs - Debounce delay in milliseconds (defaults to 300ms)
 * @returns Object containing search query and functions to update it
 */
export const useSearch = (defaultQuery: string = "", debounceMs: number = 300) => {
  const [query, setQuery] = useState(defaultQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultQuery);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync query with URL params on component mount or when searchParams change
  useEffect(() => {
    const urlQuery = searchParams.get('q') || "";
    setQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [searchParams]);

  // Debounce the query
  useEffect(() => {
    if (query === debouncedQuery) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debouncedQuery, debounceMs]);

  // Helper function to update URL with new query
  const updateUrlWithQuery = useCallback((newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQuery.trim()) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Function to set query and update URL (immediately updates URL, debounces the search)
  const setQueryWithUrl = useCallback((newQuery: string) => {
    setQuery(newQuery);
    updateUrlWithQuery(newQuery);
  }, [updateUrlWithQuery]);

  // Function to clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setIsSearching(false);
    updateUrlWithQuery("");
  }, [updateUrlWithQuery]);

  return {
    query,
    debouncedQuery,
    setQuery: setQueryWithUrl,
    clearSearch,
    hasQuery: query.trim().length > 0,
    isSearching,
  };
};
