import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const usePaginate = (defaultOffset: number = 0, limit: number = 20) => {
  const [offset, setOffset] = useState(defaultOffset);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync offset with URL params on component mount or when searchParams change
  useEffect(() => {
    const urlOffset = searchParams.get("offset");
    if (urlOffset !== null) {
      const parsedOffset = parseInt(urlOffset, 10);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        setOffset(parsedOffset);
      }
    }
  }, [searchParams]);

  // Helper function to update URL with new offset
  const updateUrlWithOffset = useCallback(
    (newOffset: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", newOffset.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Function to set offset and update URL
  const setOffsetWithUrl = useCallback(
    (newOffset: number) => {
      setOffset(newOffset);
      updateUrlWithOffset(newOffset);
    },
    [updateUrlWithOffset]
  );

  // Function to go to next page
  const nextPage = useCallback(
    (limit: number) => {
      const newOffset = offset + limit;
      setOffsetWithUrl(newOffset);
    },
    [offset, setOffsetWithUrl]
  );

  // Function to go to previous page
  const previousPage = useCallback(
    (limit: number) => {
      const newOffset = Math.max(0, offset - limit);
      setOffsetWithUrl(newOffset);
    },
    [offset, setOffsetWithUrl]
  );

  // Function to go to a specific page (0-indexed)
  const goToPage = useCallback(
    (page: number, limit: number) => {
      const newOffset = Math.max(0, page * limit);
      setOffsetWithUrl(newOffset);
    },
    [setOffsetWithUrl]
  );

  // Function to reset pagination (useful when search changes)
  const resetPagination = useCallback(() => {
    setOffsetWithUrl(0);
  }, [setOffsetWithUrl]);

  return {
    offset,
    setOffset: setOffsetWithUrl,
    nextPage,
    previousPage,
    goToPage,
    resetPagination,
    currentPage: Math.floor(offset / limit),
  };
};
