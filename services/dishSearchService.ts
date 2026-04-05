import { enhanceDishQuery } from "@/services/aiQueryService";
import type { DishSearchResponse } from "@/types/api";
import type { DishCandidate } from "@/types/dish";
import { dedupeImages } from "@/utils/dedupeImages";

const MOCK_DISH_IMAGES: Record<string, string[]> = {
  "mapo tofu": [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
  ],
  "kung pao chicken": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1604908177225-4a8f2f6d8322?auto=format&fit=crop&w=1200&q=80",
  ],
  "spicy beef noodles": [
    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80",
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function fallbackImages(dishName: string): string[] {
  const query = encodeURIComponent(`${dishName} dish`);
  return [
    `https://source.unsplash.com/featured/?${query},food`,
    `https://source.unsplash.com/featured/?${query},meal`,
  ];
}

export async function searchDishImages(
  candidate: DishCandidate
): Promise<DishSearchResponse> {
  await delay(1100);

  const query = await enhanceDishQuery(candidate);
  const key = candidate.name.toLowerCase();
  const images = MOCK_DISH_IMAGES[key] ?? fallbackImages(candidate.name);

  const rawResults = images.map((imageUrl, index) => ({
    id: `${candidate.id}-${index}`,
    imageUrl,
    sourceName: "Mock image source",
    title: candidate.name,
    relevanceScore: Number((0.92 - index * 0.08).toFixed(2)),
  }));

  return {
    query,
    results: dedupeImages(rawResults),
    explanation: "Search based on dish name and optional menu description.",
  };
}
