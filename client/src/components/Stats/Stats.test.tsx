import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import vehicleReducer from '@/store/slices/vehicleSlice';
import { Stats } from './Stats';

function renderWithStore(isPopupVisible: boolean) {
  const store = configureStore({ reducer: { vehicle: vehicleReducer } });
  return render(
    <Provider store={store}>
      <Stats isPopupVisible={isPopupVisible} />
    </Provider>
  );
}

describe('Stats', () => {
  it('renders nothing when popup is hidden', () => {
    const { container } = renderWithStore(false);
    expect(container.firstChild).toBeNull();
  });

  it('renders basic layout when visible', () => {
    renderWithStore(true);

    expect(screen.getByText('Last location')).toBeInTheDocument();
  });
});
