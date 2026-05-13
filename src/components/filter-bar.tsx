"use client";

import { useTranslations } from "next-intl";
import type { FilterState, SortOption } from "@/lib/types";
import { FOOD_TAGS } from "@/lib/constants";
import { SORT_OPTIONS } from "@/lib/constants";

type Props = {
  filter: FilterState;
  onChangeFilter: (f: FilterState) => void;
  sort: SortOption;
  onChangeSort: (s: SortOption) => void;
  totalCount: number;
};

export default function FilterBar({ filter, onChangeFilter, sort, onChangeSort, totalCount }: Props) {
  const t = useTranslations("filter");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {t("count", { count: totalCount })}
        </span>
        <select
          value={sort}
          onChange={(e) => onChangeSort(e.target.value as SortOption)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey.replace("sort.", ""))}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t("max_price")}</label>
          <select
            value={filter.maxPriceLevel}
            onChange={(e) => onChangeFilter({ ...filter, maxPriceLevel: Number(e.target.value) })}
            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {[0, 1, 2, 3, 4].map((l) => (
              <option key={l} value={l}>{t(`price_${l}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t("min_rating")}</label>
          <select
            value={filter.minRating}
            onChange={(e) => onChangeFilter({ ...filter, minRating: Number(e.target.value) })}
            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <option key={r} value={r}>{r === 0 ? t("any") : `★ ${r}+`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t("max_distance")}</label>
          <select
            value={filter.maxDistance || ""}
            onChange={(e) => onChangeFilter({ ...filter, maxDistance: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{t("any")}</option>
            <option value="0.5">500m</option>
            <option value="1">1km</option>
            <option value="3">3km</option>
            <option value="5">5km</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">{t("food_types")}</label>
        <div className="flex flex-wrap gap-1">
          {FOOD_TAGS.slice(0, 12).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                onChangeFilter({
                  ...filter,
                  selectedFoodTypes: filter.selectedFoodTypes.includes(tag)
                    ? filter.selectedFoodTypes.filter((t) => t !== tag)
                    : [...filter.selectedFoodTypes, tag],
                })
              }
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                filter.selectedFoodTypes.includes(tag)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
