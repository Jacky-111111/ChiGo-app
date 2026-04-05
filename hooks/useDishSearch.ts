import { useCallback, useState } from "react";
import { searchDishImages } from "@/services/dishSearchService";
import type { DishSearchResponse } from "@/types/api";
import type { DishCandidate } from "@/types/dish";

export function useDishSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DishSearchResponse | undefined>();

  const runSearch = useCallback(
    async (dish: DishCandidate): Promise<DishSearchResponse> => {
      setLoading(true);
      setError(null);

      try {
        const searchResult = await searchDishImages(dish);
        setResponse(searchResult);
        return searchResult;
      } catch {
        const message = "Network connection required for dish image search.";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    response,
    runSearch,
  };
}
