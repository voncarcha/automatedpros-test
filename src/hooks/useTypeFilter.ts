import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook to manage Pokemon type filtering with URL parameter synchronization
 * @param defaultTypes - Default selected types (defaults to empty array)
 * @returns Object containing selected types and functions to update them
 */
export const useTypeFilter = (defaultTypes: string[] = []) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(defaultTypes);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync selectedTypes with URL params on component mount or when searchParams change
  useEffect(() => {
    const urlTypes = searchParams.get("types");
    if (urlTypes) {
      const typesArray = urlTypes.split(",").filter(Boolean);
      setSelectedTypes(typesArray);
    } else {
      setSelectedTypes([]);
    }
  }, [searchParams]);

  // Helper function to update URL with new types
  const updateUrlWithTypes = useCallback(
    (newTypes: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newTypes.length > 0) {
        params.set("types", newTypes.join(","));
      } else {
        params.delete("types");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Function to add a type to selection
  const addType = useCallback(
    (type: string) => {
      if (!selectedTypes.includes(type)) {
        const newTypes = [...selectedTypes, type];
        setSelectedTypes(newTypes);
        updateUrlWithTypes(newTypes);
      }
    },
    [selectedTypes, updateUrlWithTypes]
  );

  // Function to remove a type from selection
  const removeType = useCallback(
    (type: string) => {
      const newTypes = selectedTypes.filter(t => t !== type);
      setSelectedTypes(newTypes);
      updateUrlWithTypes(newTypes);
    },
    [selectedTypes, updateUrlWithTypes]
  );

  // Function to toggle a type in selection
  const toggleType = useCallback(
    (type: string) => {
      if (selectedTypes.includes(type)) {
        removeType(type);
      } else {
        addType(type);
      }
    },
    [selectedTypes, addType, removeType]
  );

  // Function to clear all selected types
  const clearTypes = useCallback(() => {
    setSelectedTypes([]);
    updateUrlWithTypes([]);
  }, [updateUrlWithTypes]);

  // Function to set multiple types at once
  const setTypes = useCallback(
    (types: string[]) => {
      setSelectedTypes(types);
      updateUrlWithTypes(types);
    },
    [updateUrlWithTypes]
  );

  return {
    selectedTypes,
    addType,
    removeType,
    toggleType,
    clearTypes,
    setTypes,
    hasTypesSelected: selectedTypes.length > 0,
  };
};
