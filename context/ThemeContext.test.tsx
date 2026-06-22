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
  it('hydrates stored theme correctly', async () => {
    await AsyncStorage.setItem('@app_theme_mode', 'dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.mode).toBe('dark'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
  });

  it('falls back to system for invalid stored value', async () => {
    await AsyncStorage.setItem('@app_theme_mode', 'sepia');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.mode).toBe('system'));
  });

  it('setMode updates state, nativewind and storage', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.mode).toBe('system'));

    await result.current.setMode('light');

    await waitFor(() => expect(result.current.mode).toBe('light'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });

  it('throws when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme requires ThemeProvider'
    );
    consoleError.mockRestore();
  });
});