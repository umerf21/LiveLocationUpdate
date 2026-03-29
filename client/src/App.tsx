import { VehicleTracking } from '@/feature/vehicleTracking';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.shell}>
      <VehicleTracking />
    </div>
  );
}

export default App;
