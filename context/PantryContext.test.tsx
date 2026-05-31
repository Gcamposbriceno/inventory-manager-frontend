import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PantryProvider, usePantry } from './PantryContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PantryProvider>{children}</PantryProvider>
);

beforeEach(() => {
  AsyncStorage.clear();
});

describe('PantryContext', () => {
  it('starts with null pantryId and hasPantry false', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.pantryId).toBeNull();
    expect(result.current.pantryIdCode).toBeNull();
    expect(result.current.hasPantry).toBe(false);
  });

  it('isHydrated becomes true after storage is read', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
  });

  it('loads a stored pantryId on hydration', async () => {
    await AsyncStorage.setItem('@pantry_membership_id', 'abc123');
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.pantryId).toBe('abc123'));
    expect(result.current.hasPantry).toBe(true);
  });

  it('setActivePantry persists id and id_code', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.setActivePantry('pantry-uuid-123', 'ABC12X');
    await waitFor(() => expect(result.current.pantryId).toBe('pantry-uuid-123'));
    expect(result.current.pantryIdCode).toBe('ABC12X');
    expect(result.current.hasPantry).toBe(true);
    expect(await AsyncStorage.getItem('@pantry_membership_id')).toBe('pantry-uuid-123');
    expect(await AsyncStorage.getItem('@pantry_id_code')).toBe('ABC12X');
  });

  it('clearPantry removes id and id_code from state and storage', async () => {
    await AsyncStorage.setItem('@pantry_membership_id', 'existing');
    await AsyncStorage.setItem('@pantry_id_code', 'XYZ99');
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.pantryId).toBe('existing'));
    await result.current.clearPantry();
    await waitFor(() => expect(result.current.pantryId).toBeNull());
    expect(result.current.pantryIdCode).toBeNull();
    expect(result.current.hasPantry).toBe(false);
    expect(await AsyncStorage.getItem('@pantry_membership_id')).toBeNull();
    expect(await AsyncStorage.getItem('@pantry_id_code')).toBeNull();
  });

  it('usePantry throws when used outside PantryProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => usePantry())).toThrow('usePantry requires PantryProvider');
    consoleError.mockRestore();
  });
});
