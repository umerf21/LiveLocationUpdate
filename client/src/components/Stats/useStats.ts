import { useEffect, useState } from 'react';

import { getLocationName } from '@/api';
import { useAppSelector } from '@/hooks/useRedux';
import {
  selectVehiclePlate,
  selectVehicleStats,
  selectVehicleTotalDistance,
} from '@/store/slices/vehicleSlice';

const FUEL_PCT = 72;

function coordsLine(lat: number, lng: number) {
  return `${lat.toFixed(5)}°, ${lng.toFixed(5)}°`;
}

function fmtKm(n: number) {
  return n >= 100 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);
}

export function useStats() {
  const plate = useAppSelector(selectVehiclePlate);
  const stats = useAppSelector(selectVehicleStats);
  const tripKm = useAppSelector(selectVehicleTotalDistance);

  const [placeName, setPlaceName] = useState<string | null>(null);

  useEffect(() => {
    if (!stats) {
      setPlaceName(null);
      return;
    }
    let cancelled = false;
    getLocationName(stats.lat, stats.lng).then((name) => {
      if (!cancelled) setPlaceName(name);
    });
    return () => {
      cancelled = true;
    };
  }, [stats?.lat, stats?.lng]);

  const speed = stats ? `${Math.round(stats.speed)} km/h` : '—';
  const fuel = stats ? `${FUEL_PCT}%` : '—';
  const trip = stats ? fmtKm(tripKm) : '—';
  const where = stats
    ? placeName && placeName !== 'Unknown location'
      ? placeName
      : coordsLine(stats.lat, stats.lng)
    : 'Waiting…';

  return { plate, speed, fuel, trip, where };
}
