import * as React from 'react';
import MapComponent, { Layer, Marker, Source } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';

import markerNav from '@/assets/navigation-final.svg';
import { useAnimatedLatLng } from '@/hooks/useAnimatedLatLng';
import { useAppSelector } from '@/hooks/useRedux';
import { selectVehicleStats } from '@/store/slices/vehicleSlice';

import { useMap } from './useMap';
import styles from './Map.module.scss';

import 'mapbox-gl/dist/mapbox-gl.css';

type MapProps = { onMarkerClick?: () => void };

export const Map = ({ onMarkerClick }: MapProps) => {
  const stats = useAppSelector(selectVehicleStats);
  const markerPosition = useAnimatedLatLng(
    stats ? { lng: stats.lng, lat: stats.lat } : null
  );
  const markerLngLat = React.useMemo(
    () =>
      markerPosition ??
      (stats ? { lng: stats.lng, lat: stats.lat } : null),
    [markerPosition, stats]
  );
  const { mapRef, initialViewState } = useMap(stats);
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? null;
  const history = useAppSelector(state => state.vehicle.history);


  const pathGeoJSON = React.useMemo(
    () => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: history.map(p => [p.lng, p.lat]),
      },
    }),
    [history]
  );


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
        {history.length > 1 && (
          <Source id="route" type="geojson" data={pathGeoJSON}>
            <Layer
              id="route-glow"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#00FFAA',
                'line-width': 14,
                'line-opacity': 0.22,
                'line-blur': 6,
              }}
            />
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#00FFAA',
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}
        {stats && markerLngLat ? (
          <Marker
            longitude={markerLngLat.lng}
            latitude={markerLngLat.lat}
            anchor="center"
          >
            
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
                style={{ cursor: 'pointer' }}
              />
          </Marker>
        ) : null}
      </MapComponent>
    </div>
  );
};
