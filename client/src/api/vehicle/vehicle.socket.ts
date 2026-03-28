import { io, type Socket } from 'socket.io-client';

import { VEHICLE_EVENTS } from './vehicle.constant';
import type { VehicleDataPayload } from './vehicle.types';

function getServerUrl(): string {
  return import.meta.env.VITE_SOCKET_SERVER_URL ?? 'http://localhost:3000';
}

let socket: Socket | null = null;

export function getVehicleSocket(): Socket {
  if (!socket) {
    socket = io(getServerUrl(), {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectVehicleSocket(): void {
  socket?.disconnect();
  socket = null;
}

type VehicleDataHandler = (payload: VehicleDataPayload) => void;


export function subscribeToVehicle(
  plate: string,
  onData: VehicleDataHandler
): () => void {
  const s = getVehicleSocket();

  const handler: VehicleDataHandler = (payload) => {
    if (payload.plate === plate) {
      onData(payload);
    }
  };

  s.on(VEHICLE_EVENTS.data, handler);
  s.emit(VEHICLE_EVENTS.subscribe, { plate });

  return () => {
    s.off(VEHICLE_EVENTS.data, handler);
    s.emit(VEHICLE_EVENTS.unsubscribe, { plate });
  };
}
