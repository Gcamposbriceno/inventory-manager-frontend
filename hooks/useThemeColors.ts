import { useColorScheme } from 'nativewind';

// Palette mirrors tailwind.config.js — single source for JS-only color needs (e.g. Ionicons)
const P = {
  forest:  '#1B4332',
  sage:    '#2D6A4F',
  mint:    '#52B788',
  cream:   '#F8F7F4',
  mist:    '#D8F3DC',
  stone:   '#E8E6E1',
  ink:     '#1C1C1A',
  pebble:  '#9E9B95',
  warn:    '#E9C46A',
  warnDim: '#92400E',
  expired: '#E76F51',
} as const;

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return {
    primary: isDark ? P.mint    : P.forest,
    sage:    P.sage,
    mint:    P.mint,
    cream:   P.cream,
    mist:    P.mist,
    stone:   P.stone,
    ink:     P.ink,
    muted:   P.pebble,
    warn:    isDark ? P.warn    : P.warnDim,
    expired: P.expired,
    isDark,
  } as const;
}
