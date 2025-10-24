/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UseMapInstanceOptions {
  center: Location;
  zoom?: number;
  mapTypeId?: any;
  mapOptions?: any;
}

/**
 * Hook to create and manage a Google Maps instance
 */
export function useMapInstance(
  isLoaded: boolean,
  options: UseMapInstanceOptions
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);

  const { center, zoom = 13, mapTypeId = "roadmap", mapOptions = {} } = options;

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const defaultOptions: any = {
      center,
      zoom,
      mapTypeId: mapTypeId as any,
      disableDefaultUI: false,
      zoomControl: true,
      zoomControlOptions: {
        position: (window as any).google.maps.ControlPosition.RIGHT_CENTER,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: (window as any).google.maps.ControlPosition.TOP_RIGHT,
      },
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: (window as any).google.maps.ControlPosition.RIGHT_TOP,
      },
      gestureHandling: "greedy", // Allow panning and zooming without Ctrl key
      ...mapOptions,
    };

    const newMap = new (window as any).google.maps.Map(
      mapRef.current,
      defaultOptions
    );
    setMap(newMap);
  }, [isLoaded, center, zoom, mapTypeId, map, mapOptions]);

  // Update center when it changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  return { mapRef, map };
}
