import type { DishImageResult } from "@/types/dish";

export function dedupeImages(results: DishImageResult[]): DishImageResult[] {
  const seen = new Set<string>();
  const output: DishImageResult[] = [];

  for (const item of results) {
    if (!item.imageUrl || seen.has(item.imageUrl)) continue;
    seen.add(item.imageUrl);
    output.push(item);
  }

  return output.slice(0, 5);
}
