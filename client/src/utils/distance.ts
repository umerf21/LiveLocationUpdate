import { VehicleStats } from "@/api";

const toRad = (v: number) => (v * Math.PI) / 180;

export const calculateDistance = (p1: VehicleStats, p2: VehicleStats) => {
  const R = 6371;

  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
