import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

const mockSetColorScheme = jest.fn();

jest.mock('nativewind', () => ({
  useColorScheme: () => ({
    colorScheme: 'light',
    setColorScheme: mockSetColorScheme,
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(() => {
  AsyncStorage.clear();
  mockSetColorScheme.mockClear();
});

describe('ThemeContext', () => {
  it('starts with mode "system"', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('system'));
  });

  it('loads stored theme "dark" on hydration and calls setColorScheme', async () => {
    await AsyncStorage.setItem('@app_theme_mode', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('dark'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
  });

  it('loads stored theme "light" on hydration', async () => {
    await AsyncStorage.setItem('@app_theme_mode', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('light'));
  });

  it('ignores invalid stored values and keeps mode "system"', async () => {
    await AsyncStorage.setItem('@app_theme_mode', 'sepia');
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('system'));
    expect(mockSetColorScheme).not.toHaveBeenCalledWith('sepia');
  });

  it('setMode updates state, calls setColorScheme, and persists to storage', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('system'));
    await result.current.setMode('light');
    await waitFor(() => expect(result.current.mode).toBe('light'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
    expect(await AsyncStorage.getItem('@app_theme_mode')).toBe('light');
  });

  it('useTheme throws when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow('useTheme requires ThemeProvider');
    consoleError.mockRestore();
  });
});
