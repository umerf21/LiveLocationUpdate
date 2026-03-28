import * as React from 'react';
import MapComponent from 'react-map-gl/mapbox';

import { useVehicleSocket } from '@/hooks/useVehicleSocket';

import 'mapbox-gl/dist/mapbox-gl.css';

const DEMO_PLATE = 'DXB-CX-36357';

export const Map = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const { data, connected } = useVehicleSocket(DEMO_PLATE);

  React.useEffect(() => {
    console.log('[Map] vehicle socket connected:', connected);
  }, [connected]);

  React.useEffect(() => {
    if (data) {
      console.log('[Map] vehicle data:', data);
    }
  }, [data]);

  if (!mapboxToken) {
    return (
      <div
        style={{
          padding: '1rem',
          width: '100%',
          height: '100%',
          minHeight: '100dvh',
          boxSizing: 'border-box',
        }}
      >
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        position: 'relative',
      }}
    >
      <MapComponent
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}