import { useCallback, useState } from "react";
import { extractMenuText } from "@/services/ocrService";
import type { OCRResult } from "@/types/menu";

export function useOcr() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | undefined>();

  const runOcr = useCallback(async (imageUri: string): Promise<OCRResult> => {
    setLoading(true);
    setError(null);

    try {
      const ocr = await extractMenuText(imageUri);
      setResult(ocr);
      return ocr;
    } catch {
      const message = "We couldn't read the menu clearly. Try another photo.";
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
