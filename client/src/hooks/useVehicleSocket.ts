import { useEffect, useState } from 'react';

import {
  subscribeToVehicle,
  getVehicleSocket,
  type VehicleStats,
} from '@/api';

export interface UseVehicleSocketResult {
  /** Latest stats for the subscribed plate, or null if none / not subscribed */
  data: VehicleStats | null;
  /** Whether the Socket.IO connection is currently established */
  connected: boolean;
}

/**
 * Subscribes to `vehicleData` for the given plate (when `plate` is non-null).
 * Cleans up listener and emits `unsubscribeFromVehicle` on unmount or when `plate` changes.
 */
export function useVehicleSocket(plate: string | null): UseVehicleSocketResult {
  const [data, setData] = useState<VehicleStats | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getVehicleSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setConnected(socket.connected);

    if (!plate) {
      setData(null);
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      };
    }

    setData(null);
    const unsubscribe = subscribeToVehicle(plate, (payload) => {
      setData(payload.data);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      unsubscribe();
    };
  }, [plate]);

  return { data, connected };
}
