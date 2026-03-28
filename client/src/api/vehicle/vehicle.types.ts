export interface VehicleTelemetry {
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: string;
  timestamp: string;
}

export interface VehicleDataPayload {
  plate: string;
  data: VehicleTelemetry;
}
