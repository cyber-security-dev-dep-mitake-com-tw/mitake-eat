import type { Restaurant } from "./types";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OverpassNode {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassNode[];
}

function extractCuisine(tags: Record<string, string>): string[] {
  const cuisine = tags.cuisine;
  if (!cuisine) return ["餐廳"];

  const map: Record<string, string[]> = {
    "taiwanese": ["台式"],
    "chinese": ["中式"],
    "japanese": ["日式"],
    "korean": ["韓式"],
    "italian": ["義式"],
    "american": ["美式"],
    "thai": ["泰式"],
    "vietnamese": ["越式"],
    "french": ["法式"],
    "indian": ["印度"],
    "mexican": ["墨西哥"],
    "mediterranean": ["地中海"],
    "seafood": ["海鮮"],
    "sushi": ["日式", "壽司"],
    "ramen": ["日式", "拉麵"],
    "noodle": ["中式", "麵食"],
    "pizza": ["義式"],
    "burger": ["美式"],
    "steak_house": ["牛排"],
    "bbq": ["燒肉"],
    "hotpot": ["火鍋"],
    "coffee_shop": ["咖啡"],
    "bakery": ["甜點"],
    "ice_cream": ["甜點"],
    "vegetarian": ["素食"],
    "vegan": ["素食"],
    "regional": ["台式"],
    "asian": ["亞洲"],
  };

  const cuisines = cuisine.split(";").map((c) => c.trim().toLowerCase());
  const result: string[] = [];

  for (const c of cuisines) {
    if (map[c]) {
      result.push(...map[c]);
    } else {
      result.push(c);
    }
  }

  return Array.from(new Set(result));
}

async function fetchOverpass(query: string, timeout = 30000): Promise<OverpassResponse> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass API returned ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(id);
  }
}

export async function searchRestaurants(
  lat: number,
  lng: number,
  radiusMeters: number,
  foodTypes: string[],
  targetCount: number,
): Promise<Restaurant[]> {
  const radius = Math.min(radiusMeters, 5000);

  let cuisineFilter = "";
  if (foodTypes.length > 0) {
    const cuisineValues = foodTypes
      .map((ft) => `["cuisine"~"${ft}",i]`)
      .join("");
    cuisineFilter = `(node${cuisineValues}(around:${radius},${lat},${lng});way${cuisineValues}(around:${radius},${lat},${lng}););`;
  } else {
    cuisineFilter = `(node["amenity"="restaurant"](around:${radius},${lat},${lng});way["amenity"="restaurant"](around:${radius},${lat},${lng}););`;
  }

  const query = `
    [out:json][timeout:25];
    (
      ${cuisineFilter}
    );
    out center ${targetCount * 2};
  `.trim();

  const data = await fetchOverpass(query);

  if (!data.elements || data.elements.length === 0) {
    return [];
  }

  const results: Restaurant[] = [];

  for (const el of data.elements) {
    const tags = el.tags || {};
    const nodeLat = el.lat ?? el.center?.lat;
    const nodeLon = el.lon ?? el.center?.lon;

    if (!nodeLat || !nodeLon) continue;

    const types = extractCuisine(tags);

    if (foodTypes.length > 0) {
      const matches = foodTypes.some((ft) =>
        types.some((t) => t.includes(ft) || ft.includes(t)),
      );
      if (!matches) continue;
    }

    results.push({
      id: `osm-${el.id}`,
      name: tags.name || tags["name:zh"] || tags["name:en"] || `餐廳 ${el.id}`,
      address: tags["addr:full"] || tags["addr:street"] || "",
      lat: nodeLat,
      lng: nodeLon,
      rating: 0,
      priceLevel: 1 as const,
      types: types.slice(0, 3),
      website: tags.website || tags.contact_website,
      phone: tags.phone || tags["contact:phone"],
      openingHours: tags.opening_hours ? [tags.opening_hours] : undefined,
      distance: 0,
    });

    if (results.length >= targetCount) break;
  }

  return results;
}
