import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import vehicleReducer from '@/store/slices/vehicleSlice';
import { Map } from './Map';

vi.mock('react-map-gl/mapbox', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mapbox-map">{children}</div>
  ),
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-marker">{children}</div>
  ),
  Source: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-source">{children}</div>
  ),
  Layer: () => null,
}));

describe('Map', () => {
  it('renders env hint when token is missing', () => {
    const original = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN = '';

    const store = configureStore({ reducer: { vehicle: vehicleReducer } });

    render(
      <Provider store={store}>
        <Map />
      </Provider>
    );

    expect(screen.getByText(/VITE_MAPBOX_ACCESS_TOKEN/i)).toBeInTheDocument();

    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN = original;
  });

  it('renders map container when token is present', () => {
    const original = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN = 'pk.test';

    const store = configureStore({ reducer: { vehicle: vehicleReducer } });

    render(
      <Provider store={store}>
        <Map />
      </Provider>
    );

    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();

    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN = original;
  });
});
