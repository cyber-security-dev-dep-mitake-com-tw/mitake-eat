"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/types";

type Props = {
  restaurants: Restaurant[];
  center: { lat: number; lng: number };
};

function markerHtml(i: number) {
  return `<div class="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">${i + 1}</div>`;
}

export default function MapView({ restaurants, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let destroyed = false;

    import("leaflet").then((L) => {
      if (destroyed || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      destroyed = true;
      markers.current.forEach((m: any) => m.remove());
      markers.current = [];
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markers.current.forEach((m: any) => m.remove());
    markers.current = [];

    if (restaurants.length === 0) return;

    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(
        restaurants.map((r) => [r.lat, r.lng] as [number, number]),
      );

      restaurants.forEach((r, i) => {
        const icon = L.divIcon({
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: markerHtml(i),
        });

        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div class="text-sm">
            <strong>${r.name}</strong><br/>
            ${r.rating > 0 ? `★ ${r.rating} · ` : ""}
            ${r.address ? `${r.address}<br/>` : ""}
            ${r.phone ? `${r.phone}<br/>` : ""}
            ${r.website ? `<a href="${r.website}" target="_blank" class="text-blue-600">官網</a>` : ""}
          </div>
        `);
        markers.current.push(marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    });
  }, [restaurants]);

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200" />
  );
}
