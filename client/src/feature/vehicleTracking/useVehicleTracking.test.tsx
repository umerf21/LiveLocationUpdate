import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import vehicleReducer from '@/store/slices/vehicleSlice';
import { useVehicleTracking } from './useVehicleTracking';

const mockUseVehicleSocket = jest.fn();

vi.mock('@/hooks/useVehicleSocket', () => ({
  useVehicleSocket: (plate: string | null) => mockUseVehicleSocket(plate),
}));

function createWrapper() {
  const store = configureStore({
    reducer: { vehicle: vehicleReducer },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { Wrapper, store };
}

describe('useVehicleTracking', () => {
  beforeEach(() => {
    jest.useRealTimers();
    mockUseVehicleSocket.mockReset();
  });

  it('stores socket connected flag', () => {
    mockUseVehicleSocket.mockReturnValue({ data: null, connected: true });
    const { Wrapper, store } = createWrapper();

    renderHook(() => useVehicleTracking('PLATE'), { wrapper: Wrapper });

    expect(store.getState().vehicle.connected).toBe(true);
  });

  it('toggles popup on marker click and hides after timeout', () => {
    jest.useFakeTimers();
    mockUseVehicleSocket.mockReturnValue({ data: null, connected: false });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useVehicleTracking('PLATE'), {
      wrapper: Wrapper,
    });

    expect(result.current.showPopup).toBe(false);

    act(() => {
      result.current.onMarkerClick();
    });
    expect(result.current.showPopup).toBe(true);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.showPopup).toBe(false);
  });
}
);
