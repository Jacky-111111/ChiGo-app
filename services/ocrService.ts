import type { OCRResult } from "@/types/menu";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function extractMenuText(_imageUri: string): Promise<OCRResult> {
  await delay(900);

  const mockLines = [
    "Spicy Beef Noodles - hand-pulled noodle soup",
    "Mapo Tofu - soft tofu, chili oil, minced pork",
    "Scallion Pancake",
    "Kung Pao Chicken - peanuts and dried chili",
    "Cucumber Salad",
    "Steamed Dumplings",
  ];

  return {
    rawText: mockLines.join("\n"),
    lines: mockLines,
    languageHint: "en",
    confidence: 0.86,
  };
}
