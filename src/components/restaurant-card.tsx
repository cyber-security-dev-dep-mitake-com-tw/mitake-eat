"use client";

import { useTranslations } from "next-intl";
import type { Restaurant } from "@/lib/types";
import { PRICE_LEVEL_LABELS } from "@/lib/constants";

type Props = {
  restaurant: Restaurant;
  rank: number;
};

export default function RestaurantCard({ restaurant, rank }: Props) {
  const t = useTranslations("restaurant");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
              {rank}
            </span>
            <h3 className="font-semibold text-gray-900 truncate">{restaurant.name}</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{restaurant.address}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {restaurant.rating.toFixed(1)}
            </span>
            <span>{PRICE_LEVEL_LABELS[restaurant.priceLevel]}</span>
            {restaurant.distance && (
              <span>{restaurant.distance < 1 ? `${(restaurant.distance * 1000).toFixed(0)}m` : `${restaurant.distance.toFixed(1)}km`}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.types.map((type) => (
              <span key={type} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                {type}
              </span>
            ))}
          </div>
          {restaurant.phone && (
            <p className="text-xs text-gray-400 mt-1">{restaurant.phone}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {restaurant.website && (
          <a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg font-medium transition-colors"
          >
            {t("website")}
          </a>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}&query_place_id=${restaurant.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg font-medium transition-colors"
        >
          {t("map")}
        </a>
      </div>
      {restaurant.openingHours && restaurant.openingHours.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">{t("hours")}: {restaurant.openingHours.slice(0, 2).join(", ")}</p>
      )}
    </div>
  );
}
