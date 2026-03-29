import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { VehicleStats } from '@/api';
import { computeNextVehicleMetrics } from '@/utils/vehicleMetrics';

export interface VehicleState {
  plate: string | null;
  stats: VehicleStats | null;
  connected: boolean;
  history: VehicleStats[];
  totalDistance: number;
  avgSpeed: number;
  startTime: number | null;
  speedTimeProduct: number;
}

const initialState: VehicleState = {
  plate: null,
  stats: null,
  connected: false,
  history: [],
  totalDistance: 0,
  avgSpeed: 0,
  startTime: null,
  speedTimeProduct: 0,
};

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setVehicleStats: (
      state,
      action: PayloadAction<{ plate: string; data: VehicleStats }>
    ) => {
      const { plate, data } = action.payload;
      const next = computeNextVehicleMetrics(
        {
          history: state.history,
          totalDistance: state.totalDistance,
          avgSpeed: state.avgSpeed,
          startTime: state.startTime,
          speedTimeProduct: state.speedTimeProduct,
        },
        data
      );

      state.plate = plate;
      state.stats = data;
      state.history = next.history;
      state.totalDistance = next.totalDistance;
      state.avgSpeed = next.avgSpeed;
      state.startTime = next.startTime;
      state.speedTimeProduct = next.speedTimeProduct;
    },
    resetVehicle: () => initialState,
  },
});

export const { setSocketConnected, setVehicleStats, resetVehicle } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;

type VehicleRootState = { vehicle: VehicleState };

export const selectVehiclePlate = (state: VehicleRootState) => state.vehicle.plate;
export const selectVehicleStats = (state: VehicleRootState) => state.vehicle.stats;
export const selectVehicleConnected = (state: VehicleRootState) =>
  state.vehicle.connected;
export const selectVehicleTotalDistance = (state: VehicleRootState) =>
  state.vehicle.totalDistance;
export const selectVehicleAvgSpeed = (state: VehicleRootState) =>
  state.vehicle.avgSpeed;
export const selectVehicleHistory = (state: VehicleRootState) => state.vehicle.history;
