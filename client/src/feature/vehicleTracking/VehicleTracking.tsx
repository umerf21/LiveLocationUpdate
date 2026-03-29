import { Map } from '@/components/Map';
import { Stats } from '@/components/Stats';
import { useVehicleTracking } from './useVehicleTracking';

import styles from './VehicleTracking.module.scss';

const DEMO_PLATE = 'DXB-CX-36357';

export const VehicleTracking = () => {
  const { showPopup, onMarkerClick } = useVehicleTracking(DEMO_PLATE);

  return (
    <div className={styles.root}>
      <Map onMarkerClick={onMarkerClick} />
      <Stats isPopupVisible={showPopup} />
    </div>
  );
};
