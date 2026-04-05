import type { DishCandidate } from "@/types/dish";
import type { OCRResult } from "@/types/menu";
import { extractDishCandidates } from "@/utils/extractDishCandidates";

export function parseDishCandidates(ocr: OCRResult): DishCandidate[] {
  return extractDishCandidates(ocr);
}
