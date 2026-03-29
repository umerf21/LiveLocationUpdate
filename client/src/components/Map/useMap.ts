import {useEffect, useRef} from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

import type { VehicleStats } from '@/api';

const DEFAULT_INITIAL = {
  longitude: 55.12843,
  latitude: 25.13932,
  zoom: 14,
  bearing: 0,
  pitch: 0,
} as const;

export function useMap(stats: VehicleStats | null) {
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (!stats || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [stats.lng, stats.lat],
      bearing: stats.angle,
      duration: 750,
      essential: true,
    });
  }, [stats]);

  return {
    mapRef,
    initialViewState: DEFAULT_INITIAL,
  };
}
