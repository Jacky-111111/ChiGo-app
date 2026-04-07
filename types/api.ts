import type { DishImageResult, DishSearchQuery } from "@/types/dish";

export type DishSearchResponse = {
  query: DishSearchQuery;
  results: DishImageResult[];
  explanation?: string;
  searchStrategy?: "restaurant_first" | "generic_only";
};
