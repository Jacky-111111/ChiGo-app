import { useCallback, useState } from "react";
import { extractMenuText } from "@/services/ocrService";
import type { OCRResult } from "@/types/menu";

type OcrFailure = {
  code?: string;
  message?: string;
};

function toUserFacingError(error: unknown): string {
  const maybeError = error as OcrFailure | undefined;
  const code = maybeError?.code?.toLowerCase();
  const message = maybeError?.message?.toLowerCase() ?? "";

  if (code === "asset_not_found" || message.includes("photo asset")) {
    return "The selected photo couldn't be loaded from your library. Please re-select it.";
  }

  if (
    code === "unreadable_image" ||
    code === "invalid_uri" ||
    message.includes("could not read the selected image")
  ) {
    return "This image file isn't readable for OCR. Try taking a new photo or choose a different one.";
  }

  if (message.includes("native ios ocr module is unavailable")) {
    return "OCR is not ready in this build. Please restart the iOS development build and try again.";
  }

  if (code === "ocr_failed" || message.includes("vision ocr failed")) {
    return "Text recognition failed for this image. Try a clearer menu photo with better lighting.";
  }

  return "We couldn't read the menu clearly. Try another photo.";
}

export function useOcr() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | undefined>();

  const runOcr = useCallback(async (imageUri: string): Promise<OCRResult> => {
    setLoading(true);
    setError(null);

    try {
      const ocr = await extractMenuText(imageUri);
      if (ocr.lines.length === 0) {
        const message =
          "No readable text was found in this photo. Please retake the photo or pick a clearer image.";
        setError(message);
        throw new Error(message);
      }
      setResult(ocr);
      return ocr;
    } catch (caughtError) {
      const message = toUserFacingError(caughtError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    result,
    runOcr,
  };
}
