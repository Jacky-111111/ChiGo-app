export type DishCandidate = {
  id: string;
  name: string;
  description?: string;
  originalText: string;
  parseConfidence?: number;
  restaurantName?: string;
  restaurantConfirmed?: boolean;
  locationHint?: string;
};

export type DishSearchQuery = {
  dishName: string;
  description?: string;
  cuisineHint?: string;
  restaurantName?: string;
  restaurantConfirmed?: boolean;
  locationHint?: string;
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
