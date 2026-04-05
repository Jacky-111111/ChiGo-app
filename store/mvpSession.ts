import type { DishSearchResponse } from "@/types/api";
import type { DishCandidate } from "@/types/dish";
import type { DeviceLocation, MenuImage, OCRResult } from "@/types/menu";

export type ManualSearchInput = {
  restaurantName: string;
  dishName: string;
};

type SessionState = {
  selectedImage?: MenuImage;
  ocrResult?: OCRResult;
  dishes: DishCandidate[];
  selectedDish?: DishCandidate;
  searchResponseByDishId: Record<string, DishSearchResponse>;
  manualSearchInput?: ManualSearchInput;
  currentLocation?: DeviceLocation;
};

const sessionState: SessionState = {
  dishes: [],
  searchResponseByDishId: {},
};

export function getSessionState(): SessionState {
  return sessionState;
}

export function resetSessionState(): void {
  sessionState.selectedImage = undefined;
  sessionState.ocrResult = undefined;
  sessionState.dishes = [];
  sessionState.selectedDish = undefined;
  sessionState.searchResponseByDishId = {};
  sessionState.manualSearchInput = undefined;
  sessionState.currentLocation = undefined;
}

export function setSelectedImage(image: MenuImage): void {
  sessionState.selectedImage = image;
}

export function setOcrResult(ocrResult: OCRResult): void {
  sessionState.ocrResult = ocrResult;
}

export function setDishes(dishes: DishCandidate[]): void {
  sessionState.dishes = dishes;
}

export function setSelectedDish(dish: DishCandidate): void {
  sessionState.selectedDish = dish;
}

export function setDishSearchResponse(
  dishId: string,
  response: DishSearchResponse
): void {
  sessionState.searchResponseByDishId[dishId] = response;
}

export function setManualSearchInput(input: ManualSearchInput): void {
  sessionState.manualSearchInput = input;
}

export function setCurrentLocation(location: DeviceLocation): void {
  sessionState.currentLocation = location;
}
