"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { RADIUS_OPTIONS, FOOD_TAGS } from "@/lib/constants";
import type { SearchParams } from "@/lib/types";

type Props = {
  lat: number;
  lng: number;
  onSearch: (params: SearchParams) => void;
  setShowResults: (v: boolean) => void;
};

export default function SearchForm({ lat, lng, onSearch, setShowResults }: Props) {
  const t = useTranslations("search");
  const router = useRouter();
  const pathname = usePathname();

  const [radius, setRadius] = useState(1000);
  const [budgetMode, setBudgetMode] = useState<"total" | "per_person">("per_person");
  const [budgetPerPerson, setBudgetPerPerson] = useState(500);
  const [totalBudget, setTotalBudget] = useState(5000);
  const [participants, setParticipants] = useState(2);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [customFood, setCustomFood] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [targetCount, setTargetCount] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const toggleFoodType = (tag: string) => {
    setFoodTypes((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addCustomFood = () => {
    const val = customFood.trim();
    if (val && !foodTypes.includes(val)) {
      setFoodTypes((prev) => [...prev, val]);
      setCustomFood("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const params: SearchParams = {
      lat,
      lng,
      radius,
      budgetPerPerson: budgetMode === "per_person" ? budgetPerPerson : undefined,
      totalBudget: budgetMode === "total" ? totalBudget : undefined,
      participants,
      budgetMode,
      foodTypes,
      dateTime: dateTime || undefined,
      targetCount,
    };

    onSearch(params);
    setShowResults(true);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-800">{t("title")}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("radius")}</label>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRadius(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                radius === opt.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("budget")}</label>
          <div className="flex gap-1 mb-2">
            <button
              type="button"
              onClick={() => setBudgetMode("per_person")}
              className={`flex-1 px-2 py-1 text-xs rounded font-medium ${
                budgetMode === "per_person"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("per_person")}
            </button>
            <button
              type="button"
              onClick={() => setBudgetMode("total")}
              className={`flex-1 px-2 py-1 text-xs rounded font-medium ${
                budgetMode === "total"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("total")}
            </button>
          </div>
          {budgetMode === "per_person" ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={budgetPerPerson}
                onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("participants")}</label>
          <input
            type="number"
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            min={1}
            max={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("target_count")}</label>
          <input
            type="number"
            value={targetCount}
            onChange={(e) => setTargetCount(Number(e.target.value))}
            min={3}
            max={30}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("food_type")}</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {FOOD_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleFoodType(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                foodTypes.includes(tag)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFood())}
            placeholder={t("custom_food_placeholder")}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomFood}
            disabled={!customFood.trim()}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
          >
            {t("add")}
          </button>
        </div>
        {foodTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {foodTypes.map((ft) => (
              <span key={ft} className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                {ft}
                <button type="button" onClick={() => toggleFoodType(ft)} className="hover:text-orange-900">&times;</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("date_time")}</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">{t("date_time_hint")}</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-semibold text-base transition-colors"
      >
        {submitting ? t("searching") : t("submit")}
      </button>
    </form>
  );
}
