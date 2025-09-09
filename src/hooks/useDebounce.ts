import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @param isSearching - Optional callback to track searching state
 * @returns Object containing the debounced value and searching state
 */
export const useDebounce = <T>(
  value: T,
  delay: number = 500,
  onSearchingChange?: (isSearching: boolean) => void
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // If the value hasn't changed, we're not searching
    if (value === debouncedValue) {
      const newIsSearching = false;
      setIsSearching(newIsSearching);
      onSearchingChange?.(newIsSearching);
      return;
    }

    // Mark as searching
    const newIsSearching = true;
    setIsSearching(newIsSearching);
    onSearchingChange?.(newIsSearching);

    // Set up the debounce timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      const finalIsSearching = false;
      setIsSearching(finalIsSearching);
      onSearchingChange?.(finalIsSearching);
    }, delay);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, debouncedValue, delay, onSearchingChange]);

  return {
    debouncedValue,
    isSearching,
  };
};
