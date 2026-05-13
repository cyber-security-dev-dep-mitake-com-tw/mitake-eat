"use client";

import { useTranslations } from "next-intl";
import type { Restaurant } from "@/lib/types";
import RestaurantCard from "./restaurant-card";

type Props = {
  restaurants: Restaurant[];
  loading: boolean;
};

export default function RestaurantList({ restaurants, loading }: Props) {
  const t = useTranslations("restaurant");

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{t("loading")}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">🍽️</p>
        <p className="text-gray-500 mt-2">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {restaurants.map((r, i) => (
        <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
      ))}
    </div>
  );
}
