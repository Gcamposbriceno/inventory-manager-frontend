import { renderHook } from '@testing-library/react-native';
import React, { act } from 'react';
import { PantryProvider, usePantryContext } from './PantryContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PantryProvider>{children}</PantryProvider>
);

describe('PantryContext', () => {
  it('starts with activePantryId as null', () => {
    const { result } = renderHook(() => usePantryContext(), {
      wrapper,
    });

    expect(result.current.activePantryId).toBeNull();
  });

  it('updates activePantryId', () => {
    const { result } = renderHook(() => usePantryContext(), {
      wrapper,
    });

    act(() => {
      result.current.setActivePantryId('123');
    });

    expect(result.current.activePantryId).toBe('123');
  });

  it('throws when used outside PantryProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => usePantryContext())).toThrow(
      'usePantryContext must be used inside PantryProvider'
    );

    consoleError.mockRestore();
  });
});