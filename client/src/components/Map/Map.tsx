import * as React from 'react';
import MapComponent, { Marker } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';

import markerNav from '@/assets/navigation-final.svg';
import { useAppSelector } from '@/hooks/useRedux';
import { selectVehicleStats } from '@/store/slices/vehicleSlice';

import { useMap } from './useMap';
import styles from './Map.module.scss';

import 'mapbox-gl/dist/mapbox-gl.css';

type MapProps = { onMarkerClick?: () => void };

export const Map = ({ onMarkerClick }: MapProps) => {
  const stats = useAppSelector(selectVehicleStats);
  const { mapRef, initialViewState } = useMap(stats);
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? null;

  if (!token) {
    return (
      <div className={styles.envHint}>
        Add <code>VITE_MAPBOX_ACCESS_TOKEN</code> to <code>client/.env</code>.
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <MapComponent
        ref={mapRef as React.RefObject<MapRef>}
        mapboxAccessToken={token}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      >
        {stats ? (
          <Marker longitude={stats.lng} latitude={stats.lat} anchor="center">
           <img
            src={markerNav}
              alt=""
              role="button"
              tabIndex={0}
              className={styles.markerImg}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick?.();
              }}
            style={{ cursor: "pointer" }}
          />
          </Marker>
        ) : null}
      </MapComponent>
    </div>
  );
};
