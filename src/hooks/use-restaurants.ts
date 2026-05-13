"use client";

import { useState, useCallback, useMemo } from "react";
import type { Restaurant, SearchParams, FilterState, SortOption } from "@/lib/types";
import { DEMO_RESTAURANTS } from "@/lib/demo-data";
import { getGoogleMapsLoader, hasApiKey } from "@/lib/google-maps";

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function searchRealApi(params: SearchParams): Promise<Restaurant[]> {
  const loader = getGoogleMapsLoader();
  await loader.load();
  const { google } = window as any;
  const service = new google.maps.places.PlacesService(
    document.createElement("div"),
  );

  const keyword = params.foodTypes.join(" ");
  const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
    service.nearbySearch(
      {
        location: { lat: params.lat, lng: params.lng },
        radius: params.radius,
        keyword: keyword || undefined,
        type: "restaurant",
      },
      (res: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && res) {
          resolve(res);
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      },
    );
  });

  const restaurants: Restaurant[] = results.slice(0, params.targetCount).map((place) => ({
    id: place.place_id || "",
    name: place.name || "",
    address: place.vicinity || "",
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
    rating: place.rating || 0,
    priceLevel: (place.price_level as 0 | 1 | 2 | 3 | 4) ?? 1,
    types: place.types?.filter((t: string) => !t.includes("_")).slice(0, 3) as string[] || [],
    website: place.website,
    phone: place.formatted_phone_number,
    photoUrl: place.photos?.[0]?.getUrl?.({ maxWidth: 400, maxHeight: 300 }) || "",
    distance: getDistance(params.lat, params.lng, place.geometry?.location?.lat() || 0, place.geometry?.location?.lng() || 0),
    openingHours: place.opening_hours?.weekday_text,
  }));

  return restaurants;
}

function searchDemo(params: SearchParams): Restaurant[] {
  let results = DEMO_RESTAURANTS.map((r) => ({
    ...r,
    distance: getDistance(params.lat, params.lng, r.lat, r.lng),
  }));

  if (params.foodTypes.length > 0) {
    results = results.filter((r) =>
      r.types.some((t) => params.foodTypes.includes(t)),
    );
  }

  results = results.filter((r) => r.distance <= params.radius / 1000);

  if (params.budgetMode === "per_person" && params.budgetPerPerson) {
    const priceToCost = [0, 150, 350, 700, 1500];
    results = results.filter((r) => priceToCost[r.priceLevel] <= params.budgetPerPerson!);
  } else if (params.budgetMode === "total" && params.totalBudget && params.participants > 0) {
    const perPerson = params.totalBudget / params.participants;
    const priceToCost = [0, 150, 350, 700, 1500];
    results = results.filter((r) => priceToCost[r.priceLevel] <= perPerson);
  }

  results.sort((a, b) => b.rating - a.rating);
  results = results.slice(0, params.targetCount);

  return results;
}

export function useRestaurants() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    maxPriceLevel: 4,
    minRating: 0,
    selectedFoodTypes: [],
  });
  const [sort, setSort] = useState<SortOption>("rating_desc");

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    try {
      if (hasApiKey()) {
        const data = await searchRealApi(params);
        setResults(data);
      } else {
        const data = searchDemo(params);
        setResults(data);
      }
    } catch (e: any) {
      setError(e.message || "search_failed");
      const data = searchDemo(params);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = [...results];

    list = list.filter((r) => r.priceLevel <= filter.maxPriceLevel);
    list = list.filter((r) => r.rating >= filter.minRating);
    if (filter.maxDistance !== undefined) {
      list = list.filter((r) => (r.distance || 0) <= filter.maxDistance!);
    }
    if (filter.selectedFoodTypes.length > 0) {
      list = list.filter((r) =>
        r.types.some((t) => filter.selectedFoodTypes.includes(t)),
      );
    }

    switch (sort) {
      case "rating_desc": list.sort((a, b) => b.rating - a.rating); break;
      case "rating_asc": list.sort((a, b) => a.rating - b.rating); break;
      case "distance": list.sort((a, b) => (a.distance || 0) - (b.distance || 0)); break;
      case "price_asc": list.sort((a, b) => a.priceLevel - b.priceLevel); break;
      case "price_desc": list.sort((a, b) => b.priceLevel - a.priceLevel); break;
    }

    return list;
  }, [results, filter, sort]);

  return {
    results: filteredAndSorted,
    allResults: results,
    loading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    search,
  };
}
