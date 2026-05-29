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

  it('joinPantry trims whitespace and persists the id', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.joinPantry('  CODE  ');
    await waitFor(() => expect(result.current.pantryId).toBe('CODE'));
    expect(result.current.hasPantry).toBe(true);
    expect(await AsyncStorage.getItem('@pantry_membership_id')).toBe('CODE');
  });

  it('joinPantry with empty string does nothing', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.joinPantry('');
    expect(result.current.pantryId).toBeNull();
  });

  it('joinPantry with whitespace-only string does nothing', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.joinPantry('   ');
    expect(result.current.pantryId).toBeNull();
  });

  it('createPantry sets a pantry_<timestamp> id and persists it', async () => {
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.createPantry();
    await waitFor(() => expect(result.current.pantryId).toMatch(/^pantry_\d+$/));
    expect(result.current.hasPantry).toBe(true);
    expect(await AsyncStorage.getItem('@pantry_membership_id')).toMatch(/^pantry_\d+$/);
  });

  it('leavePantry clears the id and removes it from storage', async () => {
    await AsyncStorage.setItem('@pantry_membership_id', 'existing');
    const { result } = renderHook(() => usePantry(), { wrapper });
    await waitFor(() => expect(result.current.pantryId).toBe('existing'));
    await result.current.leavePantry();
    await waitFor(() => expect(result.current.pantryId).toBeNull());
    expect(result.current.hasPantry).toBe(false);
    expect(await AsyncStorage.getItem('@pantry_membership_id')).toBeNull();
  });

  it('usePantry throws when used outside PantryProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => usePantry())).toThrow('usePantry requires PantryProvider');
    consoleError.mockRestore();
  });
});
