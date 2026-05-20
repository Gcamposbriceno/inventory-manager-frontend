# Pantry Manager — Design System

Organic, warm, honest. Like a well-organized kitchen shelf — nothing clinical, nothing gamified.

---

## Quick Reference

### Colors

| Token | Value | Usage |
|---|---|---|
| `forest` | `#1B4332` | Dark brand, section headings |
| `sage` | `#2D6A4F` | Primary brand, active states, CTAs |
| `mint` | `#52B788` | Accents, fresh status |
| `frost` | `#B7E4C7` | Subtle highlights |
| `mist` | `#D8F3DC` | Chip backgrounds, icon containers |
| `cream` | `#F8F7F4` | Screen background |
| `stone` | `#E8E6E1` | Dividers, inactive borders |
| `pebble` | `#9E9B95` | Secondary text, inactive icons |
| `ink` | `#1C1C1A` | Primary text |
| `fresh` | `#52B788` | Good stock |
| `warn` | `#E9C46A` | Low stock |
| `expired` | `#E76F51` | Out of stock, destructive actions |
| `darkbg` | `#264653` | Dark surface variant |

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
| `rounded` | 8px | Inputs, small chips |
| `rounded-xl` | 12px | Buttons |
| `rounded-2xl` | 16px | Cards |
| `rounded-3xl` | 24px | Bottom sheets, modals |
| `rounded-full` | 9999px | Avatars, status badges |

---

## Screen Shell

Every screen uses this wrapper:

```jsx
<SafeAreaView className="flex-1 bg-cream">
  <ScrollView
    className="flex-1"
    contentContainerClassName="px-5 pt-4 pb-10 gap-6"
  >
    {/* content */}
  </ScrollView>
</SafeAreaView>
```

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
<View className="bg-white rounded-2xl p-4 flex-row items-center gap-3">
  {/* Icon */}
  <View className="w-10 h-10 bg-mist rounded-xl items-center justify-center">
    <Text className="text-xl">{emoji}</Text>
  </View>

  {/* Info */}
  <View className="flex-1 gap-1">
    <Text className="text-[15px] font-medium text-ink">{name}</Text>
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
<View className="rounded-full px-2 py-0.5 bg-amber-100">
  <Text className="text-[11px] font-medium text-amber-800">Poco stock</Text>
</View>

// Out of stock
<View className="rounded-full px-2 py-0.5 bg-red-100">
  <Text className="text-[11px] font-medium text-red-800">Sin stock</Text>
</View>
```

---

### Buttons

```jsx
// Primary
<Pressable className="bg-sage rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-white text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Secondary
<Pressable className="border border-sage rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-sage text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Ghost
<Pressable className="border border-stone rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-pebble text-[15px] font-medium text-center">{label}</Text>
</Pressable>

// Danger
<Pressable className="bg-expired rounded-xl py-3 px-5 active:opacity-80 active:scale-[0.98]">
  <Text className="text-white text-[15px] font-medium text-center">{label}</Text>
</Pressable>
```

---

### TextInput

```jsx
<View className="gap-1">
  <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble">
    {label}
  </Text>
  <TextInput
    className="border border-stone rounded-xl px-4 py-3 text-[15px] text-ink bg-white focus:border-sage"
    placeholderTextColor="#9E9B95"
  />
</View>
```

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
│  Recipe name           [tag] │
│  N ingredientes · ~X min     │
│  [Ingredient chips…]         │
└──────────────────────────────┘
```

```jsx
<View className="bg-white rounded-2xl p-4 gap-2">
  <View className="flex-row items-center justify-between">
    <Text className="text-base font-medium text-ink flex-1">{name}</Text>
    <View className="rounded-full px-2 py-0.5 bg-mist">
      <Text className="text-[11px] font-medium text-forest">{tag}</Text>
    </View>
  </View>

  <Text className="text-xs text-pebble">{count} ingredientes · ~{time} min</Text>

  {/* Ingredient chips */}
  <View className="flex-row flex-wrap gap-1">
    {ingredients.map((ing) => (
      <View
        key={ing.id}
        className={`rounded-full px-2 py-0.5 ${ing.outOfStock ? 'bg-red-100' : 'bg-mist'}`}
      >
        <Text className={`text-xs ${ing.outOfStock ? 'text-red-800' : 'text-forest'}`}>
          {ing.name}
        </Text>
      </View>
    ))}
  </View>
</View>
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

### Empty States

Every list that can be empty needs an empty state:

```jsx
<View className="flex-1 items-center justify-center gap-3 py-12">
  <Icon name={contextIcon} size={48} color="#9E9B95" />
  <Text className="text-[15px] text-pebble text-center">No hay productos aún</Text>
  {/* Optional CTA */}
  <Pressable className="bg-sage rounded-xl py-3 px-5 mt-2 active:opacity-80">
    <Text className="text-white text-[15px] font-medium">Agregar producto</Text>
  </Pressable>
</View>
```

Context icons:
- Pantry: `basket` (48px, pebble)
- Recipes: `tools-kitchen-2` (48px, pebble)
- History: `chart-bar` (48px, pebble)

---

## Navigation

Bottom tab bar with 4 tabs:

| Tab | Icon (Tabler) | Label |
|---|---|---|
| Home / Pantry | `basket` | Despensa |
| Recipes | `tools-kitchen-2` | Recetas |
| History | `chart-bar` | Historial |
| Profile | `user-circle` | Perfil |

- Active tab: `text-sage` icon + label
- Inactive tab: `text-pebble`
- Tab bar: `bg-white border-t border-stone`

Icon sizes: 24px in nav, 20px inline, 48px decorative/empty state.

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
        className={`w-1.5 h-1.5 rounded-full ${i === currentStep ? 'bg-sage' : 'bg-stone'}`}
      />
    ))}
  </View>

  {/* CTA */}
  <View className="px-5 pb-safe">
    <Pressable className="bg-sage rounded-xl py-3 active:opacity-80">
      <Text className="text-white text-[15px] font-medium text-center">{ctaLabel}</Text>
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
    trackColor={{ false: '#E8E6E1', true: '#2D6A4F' }}
    thumbColor="#FFFFFF"
  />
</View>
```

---

## Iconography

Library: `@expo/vector-icons` (MaterialCommunityIcons) or Tabler Icons React Native.

| Size | Use |
|---|---|
| 24px | Navigation tabs |
| 20px | Inline actions |
| 48px | Decorative / empty states |

Colors: `sage` (#2D6A4F) for primary actions, `pebble` (#9E9B95) for secondary/inactive, `expired` (#E76F51) for destructive.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `cream` (`#F8F7F4`) as every screen background | Use pure white as the screen background |
| Use `rounded-2xl` for cards, `rounded-xl` for buttons | Mix radius values arbitrarily |
| Keep font weight at or below 600 (semibold) | Use `font-bold` (700) or `font-extrabold` anywhere |
| Use semantic color tokens (`fresh`, `warn`, `expired`) for stock status | Use arbitrary hex colors for stock state |
| Write section labels as 11px uppercase medium (`text-pebble`) | Use H2/H3 headings for section labels inside screens |
| Show empty states for every list that can be empty | Leave an empty list with no feedback to the user |
| Use `active:opacity-80 active:scale-[0.98]` on every `Pressable` | Omit press feedback on interactive elements |
| Keep `px-5` horizontal padding consistent on all screens | Use different horizontal padding per screen |
| Use `gap-*` for spacing between elements inside a flex container | Mix `margin` and `padding` for layout rhythm |
| Use `Pressable` for all tappable elements | Use `TouchableOpacity` (deprecated pattern in new arch) |

### Never build
- Expiry date fields, labels, or alerts
- OCR / camera scanning for receipts
- Barcode scanner UI
- Push notification UI
