"use client";

import { useTranslations } from "next-intl";

type Props = {
  onRequest: () => void;
  loading: boolean;
  granted: boolean;
  error: string | null;
  lat: number | null;
  lng: number | null;
};

export default function LocationPrompt({ onRequest, loading, granted, error, lat, lng }: Props) {
  const t = useTranslations("location");

  if (granted && lat && lng) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-medium">
          {t("acquired")}
        </p>
        <p className="text-green-600 text-sm mt-1">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
      <div className="text-4xl mb-3">📍</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("title")}</h2>
      <p className="text-gray-500 text-sm mb-4">{t("description")}</p>
      {error && (
        <p className="text-red-500 text-sm mb-3">
          {t(error)}
        </p>
      )}
      <button
        onClick={onRequest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {loading ? t("requesting") : t("button")}
      </button>
    </div>
  );
}
