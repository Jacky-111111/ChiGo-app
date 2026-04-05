export function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/[|]/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}
