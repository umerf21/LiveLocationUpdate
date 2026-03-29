import { useAppSelector } from '@/hooks/useRedux';
import {
  selectVehiclePlate,
  selectVehicleStats,
  selectVehicleTotalDistance,
} from '@/store/slices/vehicleSlice';

import gasStationIcon from '@/assets/gas-station.svg';
import speedIcon from '@/assets/speed-icon.svg';

import styles from './Stats.module.scss';

const FUEL_PCT = 72;

function coordsLine(lat: number, lng: number) {
  return `${lat.toFixed(5)}°, ${lng.toFixed(5)}°`;
}

function fmtKm(n: number) {
  return n >= 100 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);
}

export function Stats({ isPopupVisible }: { isPopupVisible: boolean }) {
  const plate = useAppSelector(selectVehiclePlate);
  const stats = useAppSelector(selectVehicleStats);
  const tripKm = useAppSelector(selectVehicleTotalDistance);

  if (!isPopupVisible) return null;

  const speed = stats ? `${Math.round(stats.speed)} km/h` : '—';
  const fuel = stats ? `${FUEL_PCT}%` : '—';
  const trip = stats ? fmtKm(tripKm) : '—';
  const where = stats ? coordsLine(stats.lat, stats.lng) : 'Waiting…';

  return (
    <div className={styles.card}>
      <section className={styles.locationBlock}>
        <p className={styles.locationLabel}>Last location</p>
        <p className={styles.locationText}>{where}</p>
        {plate ? <p className={styles.plate}>{plate}</p> : null}
      </section>

      <div className={styles.chips}>
        <div className={styles.chip}>
          <img src={speedIcon} alt="" className={styles.chipIcon} width={16} height={16} />
          <span className={styles.chipText}>{speed}</span>
        </div>
        <div className={styles.chip}>
          <img
            src={gasStationIcon}
            alt=""
            className={`${styles.chipIcon} ${styles.chipIconFuel}`}
            width={16}
            height={16}
          />
          <span className={styles.chipText}>{fuel}</span>
        </div>
        <div className={styles.chip}>
          <img src={speedIcon} alt="" className={styles.chipIcon} width={16} height={16} />
          <span className={styles.chipText}>{trip}</span>
        </div>
      </div>
    </div>
  );
}
