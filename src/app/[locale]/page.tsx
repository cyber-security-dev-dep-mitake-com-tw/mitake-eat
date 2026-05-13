"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import LocationPrompt from "@/components/location-prompt";
import SearchForm from "@/components/search-form";
import FilterBar from "@/components/filter-bar";
import RestaurantList from "@/components/restaurant-list";
import MapView from "@/components/map-view";
import LanguageSwitcher from "@/components/language-switcher";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useRestaurants } from "@/hooks/use-restaurants";
import { TAIPEI_COORDS } from "@/lib/constants";

export default function HomePage() {
  const t = useTranslations("home");
  const geo = useGeolocation();
  const rest = useRestaurants();
  const [showResults, setShowResults] = useState(false);

  const centerLat = geo.lat ?? TAIPEI_COORDS.lat;
  const centerLng = geo.lng ?? TAIPEI_COORDS.lng;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Mitake Eat</h1>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!showResults ? (
          <div className="max-w-lg mx-auto space-y-6">
            <LocationPrompt
              onRequest={geo.requestLocation}
              loading={geo.loading}
              granted={geo.granted}
              error={geo.error}
              lat={geo.lat}
              lng={geo.lng}
            />
            {geo.granted && geo.lat && geo.lng && (
              <SearchForm
                lat={geo.lat}
                lng={geo.lng}
                onSearch={rest.search}
                setShowResults={setShowResults}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <button
                onClick={() => setShowResults(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t("back")}
              </button>
              <FilterBar
                filter={rest.filter}
                onChangeFilter={rest.setFilter}
                sort={rest.sort}
                onChangeSort={rest.setSort}
                totalCount={rest.results.length}
              />
              <RestaurantList restaurants={rest.results} loading={rest.loading} />
            </div>
            <div className="lg:w-[500px] xl:w-[600px] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
              <MapView
                restaurants={rest.results}
                center={{ lat: centerLat, lng: centerLng }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
