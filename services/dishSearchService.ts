import { enhanceDishQuery } from "@/services/aiQueryService";
import type { DishSearchResponse } from "@/types/api";
import type { DishCandidate } from "@/types/dish";
import { dedupeImages } from "@/utils/dedupeImages";

const MOCK_DISH_IMAGES: Record<string, string[]> = {
  "mapo tofu": [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
  ],
  "kung pao chicken": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1604908177225-4a8f2f6d8322?auto=format&fit=crop&w=1200&q=80",
  ],
  "spicy beef noodles": [
    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80",
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function fallbackImages(): string[] {
  return [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
  ];
}

type WikimediaQuery = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        imageinfo?: Array<{
          thumburl?: string;
          url?: string;
          descriptionurl?: string;
        }>;
      }
    >;
  };
};

async function fetchWikimediaDishImages(
  searchText: string
): Promise<
  Array<{
    imageUrl: string;
    title?: string;
    sourceUrl?: string;
  }>
> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "8",
    gsrsearch: `${searchText} food dish`,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "900",
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Wikimedia request failed");
  }

  const payload = (await response.json()) as WikimediaQuery;
  const pages = payload.query?.pages ? Object.values(payload.query.pages) : [];

  return pages
    .map((page) => {
      const imageInfo = page.imageinfo?.[0];
      return {
        imageUrl: imageInfo?.thumburl ?? imageInfo?.url ?? "",
        title: page.title?.replace(/^File:/, ""),
        sourceUrl: imageInfo?.descriptionurl,
      };
    })
    .filter((item) => item.imageUrl.length > 0);
}

export async function searchDishImages(
  candidate: DishCandidate
): Promise<DishSearchResponse> {
  await delay(600);

  const query = await enhanceDishQuery(candidate);
  const key = candidate.name.toLowerCase();
  let rawResults =
    MOCK_DISH_IMAGES[key]?.map((imageUrl, index) => ({
      id: `${candidate.id}-mock-${index}`,
      imageUrl,
      sourceName: "Mock image source",
      title: candidate.name,
      relevanceScore: Number((0.92 - index * 0.08).toFixed(2)),
    })) ?? [];

  if (rawResults.length === 0) {
    try {
      const wikiResults = await fetchWikimediaDishImages(query.searchText);
      rawResults = wikiResults.map((item, index) => ({
        id: `${candidate.id}-wiki-${index}`,
        imageUrl: item.imageUrl,
        sourceName: "Wikimedia Commons",
        sourceUrl: item.sourceUrl,
        title: item.title ?? candidate.name,
        relevanceScore: Number((0.88 - index * 0.06).toFixed(2)),
      }));
    } catch {
      rawResults = [];
    }
  }

  if (rawResults.length === 0) {
    rawResults = fallbackImages().map((imageUrl, index) => ({
      id: `${candidate.id}-fallback-${index}`,
      imageUrl,
      sourceName: "Fallback image source",
      title: candidate.name,
      relevanceScore: Number((0.78 - index * 0.08).toFixed(2)),
    }));
  }

  return {
    query,
    results: dedupeImages(rawResults),
    explanation:
      "Online image search based on dish name and optional restaurant context.",
  };
}
