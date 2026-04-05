import type { DishCandidate, DishSearchQuery } from "@/types/dish";
import { buildDishQuery } from "@/utils/buildDishQuery";

export async function enhanceDishQuery(
  candidate: DishCandidate
): Promise<DishSearchQuery> {
  return buildDishQuery(candidate);
}
