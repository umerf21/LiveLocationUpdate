import gasStationIcon from '@/assets/gas-station.svg';
import speedIcon from '@/assets/speed-icon.svg';

import styles from './Stats.module.scss';
import { useStats } from './useStats';

export function Stats({ isPopupVisible }: { isPopupVisible: boolean }) {
  const { plate, speed, fuel, trip, where } = useStats();

  if (!isPopupVisible) return null;

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
