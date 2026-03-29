import type { VehicleStats } from '@/api';

import { calculateDistance } from './distance';

const HOUR_MS = 1000 * 60 * 60;
const MIN_SEGMENT_KM = 0.005;

export interface VehicleSliceMetrics {
  history: VehicleStats[];
  totalDistance: number;
  avgSpeed: number;
  startTime: number | null;
  speedTimeProduct: number;
}

function hoursBetween(a: string, b: string) {
  const t0 = Date.parse(a);
  const t1 = Date.parse(b);
  if (Number.isNaN(t0) || Number.isNaN(t1) || t1 <= t0) return 0;
  return (t1 - t0) / HOUR_MS;
}

export function computeNextVehicleMetrics(
  prev: VehicleSliceMetrics,
  nextPoint: VehicleStats
): VehicleSliceMetrics {
  const last = prev.history[prev.history.length - 1];
  const startTime = prev.startTime ?? new Date(nextPoint.timestamp).getTime();

  let totalDistance = prev.totalDistance;
  let speedTimeProduct = prev.speedTimeProduct;
  const history = [...prev.history, nextPoint];

  if (last) {
    const km = calculateDistance(last, nextPoint);
    if (km > MIN_SEGMENT_KM) totalDistance += km;
    speedTimeProduct += last.speed * hoursBetween(last.timestamp, nextPoint.timestamp);
  }

  const now = new Date(nextPoint.timestamp).getTime();
  const hours = (now - startTime) / HOUR_MS;
  const avgSpeed = hours > 0 ? speedTimeProduct / hours : 0;

  return { history, totalDistance, avgSpeed, startTime, speedTimeProduct };
}
