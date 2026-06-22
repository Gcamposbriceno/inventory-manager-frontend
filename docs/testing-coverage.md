# Cobertura de tests

Referencia rápida de qué función/flujo cubre cada test. Generado a partir del estado actual de la suite (`npx jest`).

## Unitarios — `lib/helpers/`

### `quantity.test.ts` → `parseValidQty()`
- parsea un string numérico válido
- clampa valores por debajo del mínimo
- clampa valores por encima del máximo
- retorna el mínimo ante input inválido
- respeta `min`/`max` personalizados

### `shoppingListItem.test.ts` → `getItemStatus()` y `getNeededQuantity()`
- `null` cuando el stock ya cumple `desired_stock`
- `null` cuando el stock excede `desired_stock`
- `"empty"` cuando no hay stock
- `"low"` cuando el stock está bajo el `rop`
- `"partial"` cuando el stock está entre `rop` y `desired_stock`
- stock exactamente igual al `rop` se trata como `"partial"`, no `"low"`
- `getNeededQuantity` retorna la diferencia entre `desired_stock` y `current_stock`
- redondea a 2 decimales
- retorna negativo si el stock excede lo deseado

### `resolveStockConsumption.test.ts` → `resolveStockConsumption()`
- consume el producto preferido si tiene stock suficiente
- escala la cantidad necesaria por el factor de porciones
- cae a otro producto del mismo tipo si el preferido no alcanza
- ignora productos de un tipo distinto al solicitado
- convierte a unidad base usando `unit_multiplier_un` antes de consumir
- nunca deja el stock por debajo de 0
- acumula consumo entre varios ingredientes que comparten producto
- no genera updates si no hay stock disponible

### `resolveMealIngredients.test.ts` → `resolveMealIngredients()`
- resuelve nombre y unidad desde el tipo de producto
- escala la cantidad por el factor dado
- usa `"Desconocido"` y unidad `null` para un `type_id` desconocido
- retorna lista vacía si no hay ingredientes

## Unitarios — `constants/` y `lib/validation/`

### `quickFillProducts.test.ts` → `QUICK_FILL_PRODUCTS`
- tiene la cantidad esperada de productos
- ids únicos
- todas las entradas son válidas (nombre, emoji, unidad)
- todas las categorías son válidas
- ids secuenciales desde 1

### `pantry.test.ts` → `pantryCreateSchema`, `pantryJoinSchema`, `addPantryTypeSchema`
- reglas de longitud del nombre de despensa
- rechaza nombre inválido
- acepta formatos de código válidos
- rechaza códigos inválidos
- acepta input válido de tipo de despensa
- rechaza `rop` inválido (con mensaje `"Ingresa un valor"`)
- rechaza `rop` cero o negativo (mensaje `"Debe ser mayor a 0"`)
- rechaza `desired_stock` inválido
- restricción cruzada: `desired_stock` debe ser mayor a `rop`, error ubicado en `desired_stock`

## Unitarios — `context/`

### `PantryContext.test.tsx` → `PantryProvider` / `usePantryContext()`
- `activePantryId` inicia en `null`
- `setActivePantryId` actualiza el estado
- lanza error si se usa fuera del provider

### `PlannerContext.test.tsx` → `PlannerProvider` / `usePlanner()`
- plan inicial vacío sin datos en `AsyncStorage`
- hidrata el plan desde `AsyncStorage`
- ignora datos corruptos en `AsyncStorage` durante la hidratación
- `addRecipeToDay` agrega una receta al día
- `updatePorciones` actualiza las porciones de una comida existente
- `updatePorciones` nunca reduce las porciones por debajo de 1
- `removeFromDay` elimina una comida del día
- persiste cambios del plan en `AsyncStorage`
- lanza error si se usa fuera del provider

### `ThemeContext.test.tsx` → `ThemeProvider` / `useTheme()`
- hidrata correctamente el tema guardado
- vuelve a `"system"` ante un valor guardado inválido
- `setMode` actualiza estado, NativeWind y storage
- lanza error si se usa fuera del provider

## Integración — `app/`

### `(onboarding)/pantry-quick-fill.test.tsx` → `PantryQuickFillScreen` (resolución de `pantryId`)
- usa el `pantryId` del route param por sobre el valor del contexto
- cae al `activePantryId` del contexto cuando no hay route param
- no navega si no hay ni route param ni pantry activo

### `(tabs)/lista.test.tsx` → `ListaScreen` (filtrado y estado de la lista de compras)
- agrupa items en secciones "Urgente"/"Sugerido" combinando todas las despensas
- filtra los items al seleccionar una despensa específica
- marcar un item actualiza el contador de pendientes y muestra la acción de limpiar

### `(tabs)/planificador.test.tsx` → `PlanificadorScreen` (flujo de "marcar como cocinada")
- muestra los ingredientes escalados a consumir y deja "Confirmar" sin efecto si no hay despensa seleccionada
- al confirmar con una despensa seleccionada, descuenta el stock del producto correspondiente vía `useUpdatePantryStock`
