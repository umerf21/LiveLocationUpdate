import { useEffect, useState } from 'react';

import {
  resetVehicle,
  setSocketConnected,
  setVehicleStats,
} from '@/store/slices/vehicleSlice';
import { useAppDispatch } from '@/hooks/useRedux';
import { useVehicleSocket } from '@/hooks/useVehicleSocket';

const TIMER = 5000
export function useVehicleTracking(plate: string | null) {
  const dispatch = useAppDispatch();
  const { data, connected } = useVehicleSocket(plate);
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    dispatch(setSocketConnected(connected));
  }, [connected, dispatch]);

  useEffect(() => {
    if (!plate) {
      dispatch(resetVehicle());
    }
  }, [plate, dispatch]);

  useEffect(() => {
    if (plate && data) {
      dispatch(setVehicleStats({ plate, data }));
    }
  }, [plate, data, dispatch]);

  const onMarkerClick = () => {
    setShowPopup(true)
    return setTimeout(() => {
      setShowPopup(false)
    }, TIMER);
    
  }

  return { connected, showPopup,onMarkerClick };
}
