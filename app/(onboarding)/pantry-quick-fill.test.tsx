import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Animated } from 'react-native';
import PantryQuickFillScreen from './pantry-quick-fill';

const types = [{ id: 'type-1', name: 'Tomate', measurement_unit: 'kg' }];

let mockLocalSearchParams: { pantryId?: string } = {};
let mockActivePantryId: string | null = null;
const mockPush = jest.fn();

jest.mock('@/lib/api/productTypes', () => ({
  useQuickFillProductTypes: () => ({ data: types, isLoading: false }),
}));

jest.mock('@/context/PantryContext', () => ({
  usePantryContext: () => ({ activePantryId: mockActivePantryId }),
}));

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn() },
  useLocalSearchParams: () => mockLocalSearchParams,
  useNavigation: () => ({ addListener: () => () => {} }),
}));

beforeEach(() => {
  mockPush.mockClear();
  mockLocalSearchParams = {};
  mockActivePantryId = null;
  // Animated.timing/spring don't settle on their own with the fake JS driver
  // in this test environment; resolve them synchronously so swipe completion
  // callbacks (and the navigation they trigger) run immediately.
  jest.spyOn(Animated, 'timing').mockReturnValue({ start: (cb?: any) => cb?.({ finished: true }) } as any);
  jest.spyOn(Animated, 'spring').mockReturnValue({ start: (cb?: any) => cb?.({ finished: true }) } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PantryQuickFillScreen pantryId resolution', () => {
  it('uses the pantryId route param when present, over the context value', () => {
    mockLocalSearchParams = { pantryId: 'param-pantry' };
    mockActivePantryId = 'context-pantry';
    render(<PantryQuickFillScreen />);

    fireEvent.press(screen.getByText('✓ Sí tengo'));

    expect(mockPush).toHaveBeenCalledWith('/pantry-add-type?pantryId=param-pantry&typeId=type-1');
  });

  it('falls back to the active pantry from context when there is no route param', () => {
    mockLocalSearchParams = {};
    mockActivePantryId = 'context-pantry';
    render(<PantryQuickFillScreen />);

    fireEvent.press(screen.getByText('✓ Sí tengo'));

    expect(mockPush).toHaveBeenCalledWith('/pantry-add-type?pantryId=context-pantry&typeId=type-1');
  });

  it('does not navigate when neither a route param nor an active pantry is available', () => {
    mockLocalSearchParams = {};
    mockActivePantryId = null;
    render(<PantryQuickFillScreen />);

    fireEvent.press(screen.getByText('✓ Sí tengo'));

    expect(mockPush).not.toHaveBeenCalled();
  });
});
