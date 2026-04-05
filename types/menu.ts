export type ImageSourceType = "camera" | "library";

export type MenuImage = {
  id: string;
  uri: string;
  width?: number;
  height?: number;
  source: ImageSourceType;
  createdAt: string;
};

export type OCRResult = {
  rawText: string;
  lines: string[];
  languageHint?: string;
  confidence?: number;
};
