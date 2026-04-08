import type { OCRResult } from "@/types/menu";
import { NativeModules, Platform } from "react-native";

type NativeOcrPayload = {
  rawText?: string;
  lines?: string[];
  confidence?: number;
};

type OcrModuleType = {
  recognizeText(imageUri: string): Promise<NativeOcrPayload>;
};

function normalizeLines(rawLines: unknown): string[] {
  if (!Array.isArray(rawLines)) {
    return [];
  }

  return rawLines
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function toResult(payload: NativeOcrPayload): OCRResult {
  const lines = normalizeLines(payload.lines);
  const rawText =
    typeof payload.rawText === "string" && payload.rawText.trim().length > 0
      ? payload.rawText.trim()
      : lines.join("\n");
  const confidence =
    typeof payload.confidence === "number" ? payload.confidence : undefined;

  return {
    rawText,
    lines,
    languageHint: "und",
    confidence,
  };
}

export async function extractMenuText(imageUri: string): Promise<OCRResult> {
  if (!imageUri || imageUri.trim().length === 0) {
    throw new Error("No image URI was provided for OCR.");
  }

  if (Platform.OS !== "ios") {
    return {
      rawText: "",
      lines: [],
      languageHint: "und",
      confidence: 0,
    };
  }

  const ocrModule = NativeModules.OcrModule as OcrModuleType | undefined;
  if (!ocrModule?.recognizeText) {
    throw new Error("Native iOS OCR module is unavailable.");
  }

  const payload = await ocrModule.recognizeText(imageUri);
  return toResult(payload);
}
