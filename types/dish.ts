export type DishCandidate = {
  id: string;
  name: string;
  description?: string;
  originalText: string;
  parseConfidence?: number;
};

export type DishSearchQuery = {
  dishName: string;
  description?: string;
  cuisineHint?: string;
  searchText: string;
};

export type DishImageResult = {
  id: string;
  imageUrl: string;
  sourceName?: string;
  sourceUrl?: string;
  title?: string;
  relevanceScore?: number;
};
