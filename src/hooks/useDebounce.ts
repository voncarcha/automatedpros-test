import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

/**
 * Custom hook for debouncing values
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Object containing debounced value and searching state
 */
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const setIsSearching = useAppStore((state) => state.setIsSearching);
  const setDebouncedSearchQuery = useAppStore((state) => state.setDebouncedSearchQuery);

  useEffect(() => {
    // Set searching to true when value changes
    if (typeof value === 'string' && value !== debouncedValue) {
      setIsSearching(true);
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      
      // Update the store's debounced search query if this is a string
      if (typeof value === 'string') {
        setDebouncedSearchQuery(value);
        setIsSearching(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue, setIsSearching, setDebouncedSearchQuery]);

  const isSearching = useAppStore((state) => state.isSearching);

  return {
    debouncedValue,
    isSearching,
  };
};