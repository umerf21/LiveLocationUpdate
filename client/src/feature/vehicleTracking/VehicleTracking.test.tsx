import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import vehicleReducer from '@/store/slices/vehicleSlice';
import { VehicleTracking } from './VehicleTracking';

vi.mock('@/components/Map', () => ({
  Map: ({ onMarkerClick }: { onMarkerClick?: () => void }) => (
    <button type="button" data-testid="map-marker-btn" onClick={() => onMarkerClick?.()}>
      map
    </button>
  ),
}));

vi.mock('@/components/Stats', () => ({
  Stats: ({ isPopupVisible }: { isPopupVisible: boolean }) => (
    <div data-testid="stats" data-popup-visible={String(isPopupVisible)} />
  ),
}));

const mockUseVehicleSocket = jest.fn();

vi.mock('@/hooks/useVehicleSocket', () => ({
  useVehicleSocket: (plate: string | null) => mockUseVehicleSocket(plate),
}));

describe('VehicleTracking', () => {
  beforeEach(() => {
    jest.useRealTimers();
    mockUseVehicleSocket.mockReturnValue({ data: null, connected: false });
  });

  function renderScreen() {
    const store = configureStore({ reducer: { vehicle: vehicleReducer } });
    return render(
      <Provider store={store}>
        <VehicleTracking />
      </Provider>
    );
  }

  it('toggles popup visibility via Stats after marker click', () => {
    jest.useFakeTimers();
    renderScreen();

    const stats = screen.getByTestId('stats');
    expect(stats).toHaveAttribute('data-popup-visible', 'false');

    fireEvent.click(screen.getByTestId('map-marker-btn'));
    expect(stats).toHaveAttribute('data-popup-visible', 'true');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(stats).toHaveAttribute('data-popup-visible', 'false');
  });
});
