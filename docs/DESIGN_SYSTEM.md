# Pantry Manager — Design System

Organic, warm, honest. Like a well-organized kitchen shelf — nothing clinical, nothing gamified.

---

## Quick Reference

### Colors

| Token | Value | Usage |
|---|---|---|
| `forest` | `#1B4332` | CTAs, active nav, section headings, dark brand |
| `sage` | `#2D6A4F` | Secondary brand, icon tints, links |
| `mint` | `#52B788` | Accents, fresh status, dark-mode active states |
| `frost` | `#B7E4C7` | Subtle highlights |
| `mist` | `#D8F3DC` | Chip backgrounds, icon containers |
| `cream` | `#F8F7F4` | Screen background (light) |
| `stone` | `#E8E6E1` | Dividers, inactive borders, input backgrounds |
| `pebble` | `#9E9B95` | Secondary text, inactive icons |
| `ink` | `#1C1C1A` | Primary text |
| `fresh` | `#52B788` | Good stock |
| `warn` | `#E9C46A` | Low stock |
| `expired` | `#E76F51` | Out of stock, destructive actions |
| `darkbg` | `#264653` | Dark surface variant |

#### Dark mode hardcoded values

Dark mode is implemented with `dark:` variants. These are the raw values used across the codebase:

| Usage | Value |
|---|---|
| Screen background | `dark:bg-[#161614]` |
| Card / surface | `dark:bg-[#1E1E1C]` |
| Border | `dark:border-[#2E2E2C]` |
| Divider | `dark:bg-[#2E2E2C]` |
| Primary text | `dark:text-[#F2F0EB]` |
| Icon container (mist equivalent) | `dark:bg-[#0D2B1A]` |
| Active CTA | `dark:bg-mint` |

### Typography

| Role | Size | Weight | Font | Class |
|---|---|---|---|---|
| Display | 28px | 600 | DM Serif Display | `text-[28px] font-semibold font-display` |
| H1 | 22px | 600 | System | `text-[22px] font-semibold` |
| H2 | 18px | 500 | System | `text-lg font-medium` |
| H3 | 16px | 500 | System | `text-base font-medium` |
| Body | 15px | 400 | System | `text-[15px]` |
| Caption | 12px | 400 | System | `text-xs text-pebble` |
| Label | 11px | 500 | System | `text-[11px] font-medium tracking-wide uppercase` |

> **Max font weight is 600 (semibold). Never use `font-bold` (700) or `font-extrabold` anywhere** — not even for large stat numbers.

### Spacing

| Class | Value | Use case |
|---|---|---|
| `px-5` | 20px | Screen horizontal padding |
| `gap-6` | 24px | Section gap |
| `p-4` | 16px | Card internal padding |
| `gap-3` | 12px | List item gap |
| `gap-2` | 8px | Inline element gap |

### Border Radius

| Class | Value | Use case |
|---|---|---|
| `rounded` | 8px | Small chips |
| `rounded-xl` | 12px | Buttons, inputs |
| `rounded-2xl` | 16px | Cards |
| `rounded-3xl` | 24px | Bottom sheets, modals |
| `rounded-full` | 9999px | Avatars, status badges, pill chips |

---

## Screen Shell

Every screen uses this wrapper:

```jsx
<SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
  <ScrollView
    className="flex-1"
    contentContainerClassName="px-5 pt-2 pb-28"
    showsVerticalScrollIndicator={false}
  >
    {/* content */}
  </ScrollView>
</SafeAreaView>
```

> `pb-28` accounts for the tab bar height. Use `pb-10` on modal/stack screens without a tab bar.

### Section Header

```jsx
<Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-2">
  Sección
</Text>
```

---

## Components

### ProductCard

Used in: H1.2, H2.1, H2.2

```
┌─────────────────────────────────────┐
│  [emoji/icon 40x40]  Product name   │
│                      Qty · Category │
│                      [stock bar 3px]│
└─────────────────────────────────────┘
```

```jsx
<View className="bg-white dark:bg-[#1E1E1C] rounded-2xl p-4 flex-row items-center gap-3">
  {/* Icon */}
  <View className="w-10 h-10 bg-mist dark:bg-[#0D2B1A] rounded-xl items-center justify-center">
    <Text className="text-xl">{emoji}</Text>
  </View>

  {/* Info */}
  <View className="flex-1 gap-1">
    <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">{name}</Text>
    <Text className="text-xs text-pebble">{qty} · {category}</Text>

    {/* Stock bar */}
    <View className="h-[3px] bg-stone rounded-full mt-1">
      <View
        className={`h-full rounded-full ${stockColor}`}
        style={{ width: `${stockPercent}%` }}
      />
    </View>
  </View>
</View>
```

Stock bar color logic:
- `> 50%` → `bg-fresh`
- `20–50%` → `bg-warn`
- `< 20%` → `bg-expired`

---

### StockBadge

```jsx
// In stock
<View className="rounded-full px-2 py-0.5 bg-mist">
  <Text className="text-[11px] font-medium text-forest">En stock</Text>
</View>

// Low stock
<View className="rounded-full px-2 py-0.5 bg-amber-50 dark:bg-amber-950">
  <Text className="text-[11px] font-medium text-amber-700 dark:text-amber-400">Bajo mín.</Text>
</View>

// Out of stock
<View className="rounded-full px-2 py-0.5 bg-red-50 dark:bg-red-950">
  <Text className="text-[11px] font-medium text-red-600 dark:text-red-400">Agotado</Text>
</View>

// Partial / needs restock
<View className="rounded-full px-2 py-0.5 bg-stone dark:bg-[#2E2E2C]">
  <Text className="text-[11px] font-medium text-pebble">Por reponer</Text>
</View>
```

---

### Buttons

```jsx
// Primary
<Pressable className="bg-forest rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-cream text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Secondary
<Pressable className="border border-forest rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-forest text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Ghost
<Pressable className="border border-stone rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-pebble text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Danger
<Pressable className="border border-expired rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-expired text-[15px] font-medium text-center">{label}</Text>
</Pressable>
```

> `active:scale-[0.98]` is required on every Pressable CTA — never omit it.

---

### TextInput

```jsx
<View className="gap-1">
  <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
    {label}
  </Text>
  <TextInput
    className="border border-stone rounded-xl px-4 py-3 text-[15px] text-ink dark:text-[#F2F0EB] bg-white dark:bg-[#1E1E1C] focus:border-sage"
    placeholderTextColor="#9E9B95"
  />
</View>
```

Use the `<TextField />` component with `react-hook-form` `Controller` for all form screens. Schemas live in `lib/validation/schemas/`.

---

### QuantityControl

Used in: H2.1, H2.2

```
[  −  ]  [  3  ]  [  +  ]
```

```jsx
<View className="flex-row items-center gap-4">
  <Pressable className="w-11 h-11 rounded-full border border-stone items-center justify-center active:opacity-80">
    <Icon name="minus" size={20} color="#9E9B95" />
  </Pressable>

  <Text className="text-[22px] font-semibold text-ink min-w-[48px] text-center">
    {value}
  </Text>

  <Pressable className="w-11 h-11 rounded-full border border-stone items-center justify-center active:opacity-80">
    <Icon name="plus" size={20} color="#2D6A4F" />
  </Pressable>
</View>
```

---

### RecipeCard

Used in: H3.1, H3.2

```
┌──────────────────────────────┐
│  Recipe name        [🍽 icon] │
│  ─────────────────────────── │
│  ⏱ 30 min   👥 4 personas   │
└──────────────────────────────┘
```

```jsx
<Pressable
  className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4 active:opacity-80 active:scale-[0.98]"
  onPress={...}
>
  <View className="flex-row items-center justify-between">
    <View className="flex-1 pr-3">
      <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB]" numberOfLines={1}>
        {name}
      </Text>
    </View>
    <View className="w-10 h-10 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center">
      <Ionicons name="restaurant-outline" size={18} color="#2D6A4F" />
    </View>
  </View>

  <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-stone dark:border-[#2E2E2C]">
    <View className="flex-row items-center gap-1.5">
      <Ionicons name="time-outline" size={14} color="#9E9B95" />
      <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">{totalTimeMinutes} min</Text>
    </View>
    <View className="flex-row items-center gap-1.5">
      <Ionicons name="people-outline" size={14} color="#9E9B95" />
      <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">{servings} personas</Text>
    </View>
  </View>
</Pressable>
```

---

### HistoryRow

Used in: H5.1

```
[icon]  Product name          +2 / −1
        Category · Date    [amount tag]
```

```jsx
<View className="flex-row items-center gap-3 py-3">
  {/* Icon */}
  <View className="w-9 h-9 rounded-full bg-mist items-center justify-center">
    <Icon
      name={isPurchase ? 'shopping-cart' : 'minus'}
      size={18}
      color={isPurchase ? '#2D6A4F' : '#9E9B95'}
    />
  </View>

  {/* Info */}
  <View className="flex-1 gap-0.5">
    <Text className="text-[15px] text-ink">{productName}</Text>
    <Text className="text-xs text-pebble">{category} · {date}</Text>
  </View>

  {/* Amount tag */}
  <Text className={`text-xs font-medium ${isPurchase ? 'text-sage' : 'text-pebble'}`}>
    {isPurchase ? '+' : '−'}{amount}
  </Text>
</View>
```

---

### PantryHeader

Shown at top of home screen when user belongs to a shared pantry. Used in: H1.3

```
[avatar stack]  Casa García  · 3 miembros
```

```jsx
<View className="flex-row items-center gap-3">
  {/* Avatar stack */}
  <View className="flex-row">
    {members.slice(0, 3).map((member, i) => (
      <View
        key={member.id}
        className="w-7 h-7 rounded-full border-2 border-white bg-mist items-center justify-center"
        style={{ marginLeft: i > 0 ? -8 : 0 }}
      >
        <Text className="text-xs font-medium text-forest">{member.initials}</Text>
      </View>
    ))}
  </View>

  <View>
    <Text className="text-[15px] font-medium text-ink">{pantryName}</Text>
    <Text className="text-xs text-pebble">{memberCount} miembros</Text>
  </View>
</View>
```

---

### FAB (Floating Action Button)

Used for primary creation actions (e.g., add product type in Despensa).

```jsx
<Pressable
  className="absolute bottom-24 right-5 w-14 h-14 rounded-full bg-forest dark:bg-mint items-center justify-center active:opacity-80"
  style={{
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  }}
  onPress={...}
>
  <Ionicons name="add" size={28} color="#F2F0EB" />
</Pressable>
```

---

### Empty States

Every list that can be empty needs an empty state:

```jsx
<View className="flex-1 items-center justify-center gap-3 py-12">
  <Ionicons name={contextIcon} size={48} color="#9E9B95" />
  <Text className="text-[15px] text-pebble text-center">No hay productos aún</Text>
  {/* Optional CTA */}
  <Pressable className="bg-forest rounded-xl py-3 px-5 mt-2 active:opacity-80 active:scale-[0.98]">
    <Text className="text-cream text-[15px] font-medium">Agregar producto</Text>
  </Pressable>
</View>
```

Context icons (48px, pebble):
- Pantry: `basket-outline`
- Recipes: `restaurant-outline`
- Search no results: `search-outline`
- History: `time-outline`

---

## Navigation

Bottom tab bar with 6 tabs (Ionicons):

| Tab | Icon | Label |
|---|---|---|
| Home | `home` / `home-outline` | Inicio |
| Pantry | `file-tray-full` / `file-tray-full-outline` | Despensa |
| Recipes | `book` / `book-outline` | Recetas |
| Shopping list | `cart` / `cart-outline` | Lista |
| History | `time` / `time-outline` | Historial |
| Settings | `settings` / `settings-outline` | Ajustes |

- Active icon: filled variant, color `forest` (#1B4332) in light mode, `mint` (#52B788) in dark mode
- Inactive icon: outline variant, color `pebble` (#9E9B95)
- Tab bar background: `cream` (#F8F7F4) light / `#161614` dark
- Tab bar border: `stone` (#E8E6E1) light / `#2E2E2C` dark

Icon sizes: 22px in nav, 20px inline, 48px decorative/empty state.

---

## Onboarding (H1.1, H1.2, H1.3)

Full-screen pages, one action per page.

```jsx
<SafeAreaView className="flex-1 bg-cream">
  <View className="flex-1 items-center justify-center px-5 gap-4">
    {/* Illustration — centered at ~40% height */}
    <Text style={{ fontSize: 80 }}>{emoji}</Text>

    <Text className="text-[28px] font-semibold font-display text-ink text-center">
      {headline}
    </Text>
    <Text className="text-[15px] text-pebble text-center max-w-[280px]">
      {subtext}
    </Text>
  </View>

  {/* Progress dots */}
  <View className="flex-row justify-center gap-1.5 pb-6">
    {steps.map((_, i) => (
      <View
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${i === currentStep ? 'bg-forest' : 'bg-stone'}`}
      />
    ))}
  </View>

  {/* CTA */}
  <View className="px-5 pb-safe">
    <Pressable className="bg-forest rounded-xl py-3 active:opacity-80 active:scale-[0.98]">
      <Text className="text-cream text-[15px] font-medium text-center">{ctaLabel}</Text>
    </Pressable>
  </View>
</SafeAreaView>
```

---

## Preferences Screen (H4.1)

```jsx
<View className="flex-row items-center py-3 border-b border-stone">
  <Text className="flex-1 text-[15px] text-ink">{productName}</Text>

  {/* Unit selector — compact Picker or bottom sheet */}
  <Text className="text-[15px] text-pebble mr-3">{defaultUnit}</Text>

  <Switch
    value={enabled}
    onValueChange={setEnabled}
    trackColor={{ false: '#E8E6E1', true: '#1B4332' }}
    thumbColor="#FFFFFF"
  />
</View>
```

---

## Iconography

Library: `@expo/vector-icons` — **Ionicons** (filled for active states, outline for inactive/decorative).

| Size | Use |
|---|---|
| 22px | Navigation tabs |
| 20px | Inline actions |
| 48px | Decorative / empty states |

Colors: `forest` (#1B4332) for primary actions, `sage` (#2D6A4F) for icon tints, `pebble` (#9E9B95) for secondary/inactive, `expired` (#E76F51) for destructive.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `cream` (`#F8F7F4`) as every screen background | Use pure white as the screen background |
| Use `rounded-2xl` for cards, `rounded-xl` for buttons and inputs | Mix radius values arbitrarily |
| Keep font weight at or below 600 (semibold) — even for large stat numbers | Use `font-bold` (700) or `font-extrabold` anywhere |
| Use `forest` (`#1B4332`) for all CTA buttons | Use `sage` for primary buttons |
| Use semantic color tokens (`fresh`, `warn`, `expired`) for stock status | Use arbitrary hex colors for stock state |
| Write section labels as `text-[11px] font-medium uppercase tracking-wide text-pebble` | Use H2/H3 headings or `font-bold` for section labels |
| Show empty states for every list that can be empty (48px icon, `text-[15px] text-pebble`) | Leave an empty list with no feedback, or use icons smaller than 48px |
| Use `active:opacity-80 active:scale-[0.98]` on every CTA `Pressable` | Omit press feedback or scale on interactive elements |
| Keep `px-5` horizontal padding consistent on all screens | Use different horizontal padding per screen |
| Use `gap-*` for spacing between elements inside a flex container | Mix `margin` and `padding` for layout rhythm |
| Use `Pressable` for all tappable elements | Use `TouchableOpacity` (deprecated pattern in new arch) |
| Use `<TextField />` with `Controller` for all form inputs | Build ad-hoc TextInput + label combos |
| Add `dark:` variants alongside every color class | Hardcode light-mode hex values without a dark equivalent |

### Never build
- Expiry date fields, labels, or alerts
- OCR / camera scanning for receipts
- Barcode scanner UI
- Push notification UI
