"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  granted: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null, lng: null, error: null, loading: false, granted: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: "geolocation_not_supported" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          granted: true,
        });
      },
      (err) => {
        let errorKey = "geolocation_unknown_error";
        if (err.code === err.PERMISSION_DENIED) errorKey = "geolocation_denied";
        else if (err.code === err.POSITION_UNAVAILABLE) errorKey = "geolocation_unavailable";
        else if (err.code === err.TIMEOUT) errorKey = "geolocation_timeout";
        setState({ lat: null, lng: null, error: errorKey, loading: false, granted: false });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  return { ...state, requestLocation };
}
