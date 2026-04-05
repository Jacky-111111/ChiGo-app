import type { DishCandidate } from "@/types/dish";
import type { OCRResult } from "@/types/menu";
import { normalizeText } from "@/utils/normalizeText";

const LINE_FILTERS = [/^\d+$/, /^\$\d+[.,]?\d*$/, /^[A-Z\s]{1,4}$/];

export function extractDishCandidates(ocr: OCRResult): DishCandidate[] {
  const lines = ocr.lines
    .map((line) => normalizeText(line))
    .filter((line) => line.length >= 3)
    .filter((line) => !LINE_FILTERS.some((regex) => regex.test(line)));

  const candidates = lines.map((line, index) => {
    const [namePart, ...rest] = line.split(/[-:]/);
    const name = normalizeText(namePart);
    const description = normalizeText(rest.join("-"));

    const parseConfidence =
      name.length > 3 ? Math.max(0.35, Math.min(0.95, name.length / 30)) : 0.35;

    return {
      id: `${index}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      description: description || undefined,
      originalText: line,
      parseConfidence,
    } satisfies DishCandidate;
  });

  const deduped = new Map<string, DishCandidate>();
  for (const candidate of candidates) {
    const key = candidate.name.toLowerCase();
    if (!deduped.has(key)) deduped.set(key, candidate);
  }

  return [...deduped.values()];
}
