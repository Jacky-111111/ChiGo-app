import type { DishCandidate, DishSearchQuery } from "@/types/dish";

export function buildDishQuery(candidate: DishCandidate): DishSearchQuery {
  const parts = [
    candidate.name,
    candidate.description,
    candidate.restaurantName && candidate.restaurantConfirmed
      ? `restaurant ${candidate.restaurantName}`
      : undefined,
    candidate.locationHint ? `near ${candidate.locationHint}` : undefined,
    "food dish",
  ].filter(Boolean);

  return {
    dishName: candidate.name,
    description: candidate.description,
    restaurantName: candidate.restaurantName,
    restaurantConfirmed: candidate.restaurantConfirmed,
    locationHint: candidate.locationHint,
    searchText: parts.join(" "),
  };
}
