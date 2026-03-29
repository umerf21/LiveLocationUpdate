export interface VehicleStats {
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: string;
  timestamp: string;
}

export interface VehicleDataPayload {
  plate: string;
  data: VehicleStats;
}
