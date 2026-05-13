"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/types";
import { getGoogleMapsLoader, hasApiKey } from "@/lib/google-maps";

type Props = {
  restaurants: Restaurant[];
  center: { lat: number; lng: number };
};

export default function MapView({ restaurants, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasApiKey()) {
      mapRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div class="text-center p-6">
            <p class="text-3xl mb-2">🗺️</p>
            <p class="text-gray-500 text-sm">Demo mode — map requires Google Maps API key</p>
          </div>
        </div>
      `;
      return;
    }

    const initMap = async () => {
      const loader = getGoogleMapsLoader();
      await loader.load();
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { Marker } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current!, {
        center,
        zoom: 14,
        mapId: "mitake_eat_map",
      });
      mapInstanceRef.current = map;

      restaurants.forEach((r) => {
        const marker = new Marker({
          position: { lat: r.lat, lng: r.lng },
          map,
          title: r.name,
        });
        markersRef.current.push(marker);
      });
    };

    initMap().catch(console.error);

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !hasApiKey()) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const initMarkers = async () => {
      const { Marker } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      restaurants.forEach((r) => {
        const marker = new Marker({
          position: { lat: r.lat, lng: r.lng },
          map: mapInstanceRef.current!,
          title: r.name,
        });
        markersRef.current.push(marker);
      });
    };
    initMarkers();
  }, [restaurants]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200"
    />
  );
}
