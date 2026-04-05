import type { DishCandidate, DishSearchQuery } from "@/types/dish";

export function buildDishQuery(candidate: DishCandidate): DishSearchQuery {
  const parts = [candidate.name, candidate.description, "food dish"].filter(
    Boolean
  );

  return {
    dishName: candidate.name,
    description: candidate.description,
    searchText: parts.join(" "),
  };
}
