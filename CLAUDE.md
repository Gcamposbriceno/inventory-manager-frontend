# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npm start

# Platform-specific
npm run android
npm run ios
npm run web

# Lint
npm run lint

# Type check (used in CI)
npx tsc --noEmit
```

Tests run via `npm test` (watch mode: `npm run test:watch`). Unit tests are co-located next to the files they test with a `.test.ts(x)` suffix. Folders `tests/integration/` and `tests/e2e/` are reserved in `jest.config.js` for future test types.

## Architecture

**Stack**: React Native 0.81.5 (new architecture enabled) + Expo ~54 + Expo Router ~6 + TypeScript 5.x

### Routing
Expo Router with file-based routing. The entry point is `expo-router/entry`. All screens live in `app/`:

- `app/_layout.tsx` — root layout, configures `Stack` and wraps the entire app in `QueryClientProvider`
- `app/index.tsx` — home screen (`/` route)

Typed routes are enabled (`experiments.typedRoutes = true` in `app.json`). Use `router.push('/path')` and typed route strings throughout.

### Styling — NativeWind v4
All styling uses **NativeWind v4** (Tailwind CSS for React Native). Never use `StyleSheet.create` for new code.

- Use `className` props on RN core components (`View`, `Text`, `Pressable`, etc.)
- `global.css` contains the Tailwind directives and is imported once in `app/_layout.tsx`
- `tailwind.config.js` — content paths cover `./app/**` and `./components/**`; `nativewind/preset` is required as a preset
- `nativewind-env.d.ts` provides the TypeScript types (`/// <reference types="nativewind/types" />`)
- `babel.config.js` sets `jsxImportSource: "nativewind"` and includes `"nativewind/babel"` preset
- `metro.config.js` wraps the default Expo config with `withNativeWind({ input: "./global.css" })`

When adding new `content` paths in `tailwind.config.js` (e.g., a new top-level directory), update that file so Tailwind scans the new files.

### Server State — TanStack Query
All server data fetching uses **TanStack Query** (`@tanstack/react-query`). The `QueryClient` is instantiated once in `app/_layout.tsx` and exposed via `QueryClientProvider`.

- Use `useQuery` for reads, `useMutation` for writes
- Fetch functions should be plain `async` functions (not hooks), placed near the feature they belong to or in a dedicated `lib/api/` module as the codebase grows
- Keep `queryKey` arrays descriptive and stable — they are the cache identity

### State Management
No global client-state library — plain React `useState` / `useEffect` for local UI state. Server state is handled entirely by TanStack Query. The backend base URL is `https://inventory-manager-backend-zd9h.onrender.com/`.

### Directory Structure

```
app/           ← screens and layouts only (Expo Router)
components/    ← reusable UI components
  Screen.tsx, ScreenHeader.tsx, ComingSoon.tsx, Card.tsx
  BackButton.tsx, TextField.tsx, IconChip.tsx
  recipes/     ← RecipeCard, RecipeList, RecipeDetail
context/       ← PantryContext, ThemeContext
hooks/
  useThemeColors.ts   ← resolved hex palette for JS (Ionicons, etc.)
  usePersistedState.ts ← AsyncStorage hydration pattern
lib/
  api/         ← apiFetch client + TanStack Query key factories
  helpers/     ← pure functions (discountPct, greeting, quantity)
  validation/  ← Zod schemas; types derived from schemas
    schemas/auth.ts, schemas/pantry.ts
constants/     ← static data arrays (quickFillProducts, mockRecipes)
types/         ← shared TS interfaces (pantry.ts, recipe.ts)
```

**Colors**: `useThemeColors()` centralises hex values for Ionicons (which cannot use className). Always use `useThemeColors()` instead of hardcoding icon hex values — avoids the 6-file duplication pattern.

**Forms**: use `react-hook-form` + `zod` for all form screens. Schemas live in `lib/validation/schemas/`. Use `<TextField />` with `Controller` — it accepts `value`, `onChangeText`, `onBlur`, and `error` props.

**API layer**: `lib/api/client.ts` exports `apiFetch<T>`. `lib/api/queryKeys.ts` has key factories (`pantryKeys`, `recipeKeys`). Add endpoint files (`lib/api/pantries.ts`, etc.) when the first real fetch is needed.

### Path Aliases
`@/*` maps to the repo root (configured in `tsconfig.json`). Use `@/app/...`, `@/components/...`, `@/lib/...`, etc.

### Navigation Libraries
`@react-navigation/bottom-tabs` and related packages are installed but not yet wired up — they're available when tab navigation is needed.

## CI/CD

GitHub Actions pipelines in `.github/workflows/`:
- **CI**: runs typecheck, lint, and jest on every push/PR
- **CD**: triggers EAS OTA updates (`expo-updates`) to the `main` channel on pushes to `main`

EAS build profiles are in `eas.json`: `development` (dev client), `preview`, and `production` (auto-increment versioning).
