# CI/CD — Pantry Manager

## Visión general

```
 commit local
     │
     ▼
┌─────────────────────┐
│  Pre-commit (Husky) │  ESLint --fix sobre archivos staged
└─────────────────────┘
     │ pasa
     ▼
  git push → PR a main
     │
     ▼
┌─────────────────────┐
│   CI (ci.yml)       │  typecheck · lint · jest
└─────────────────────┘
     │ aprobado
     ▼
  merge a main
     │
     ▼
┌─────────────────────┐
│   CD (cd.yml)       │  eas update --channel preview
└─────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Dispositivos con APK instalado     │  detectan update al abrirse → aplican
└─────────────────────────────────────┘
```

---

## 1. Pre-commit — local

**Herramientas:** Husky v9 + lint-staged  
**Disparo:** automático antes de cada `git commit`

### Qué hace

lint-staged toma únicamente los archivos `*.{ts,tsx}` que están en staging (git add) y les corre:

```
eslint --fix
```

Si ESLint puede arreglar el problema automáticamente (ej. orden de imports, comillas), lo hace y el commit continúa. Si hay un error que requiere intervención manual, el proceso termina con código de salida distinto de cero y **el commit se bloquea** hasta que el desarrollador lo corrija.

### Archivos relevantes

| Archivo | Rol |
|---|---|
| `.husky/pre-commit` | Ejecuta `npx lint-staged` |
| `package.json` → `lint-staged` | Define qué correr sobre qué archivos |

### Configuración en `package.json`

```json
"lint-staged": {
  "*.{ts,tsx}": "eslint --fix"
}
```

### Por qué solo `--fix` y no typecheck

El typecheck completo (`tsc --noEmit`) tarda varios segundos porque necesita el grafo completo de tipos del proyecto. Correrlo en pre-commit lo haría lento. ESLint con `--fix` es rápido y cubre la mayoría de los errores de estilo y calidad. El typecheck completo es responsabilidad del CI.

---

## 2. CI — GitHub Actions (`ci.yml`)

**Disparo:** en cada PR abierto o actualizado con destino a `main`  
**Runner:** `ubuntu-latest`, Node 20

### Pasos

| Paso | Comando | Falla si… |
|---|---|---|
| Checkout | `actions/checkout@v4` | — |
| Setup Node | `actions/setup-node@v4` (cache npm) | — |
| Instalar deps | `npm ci` | lockfile inválido |
| **Typecheck** | `npx tsc --noEmit` | hay errores de tipos en cualquier archivo |
| **Lint** | `npx eslint .` | hay errores de lint no autoarreglables |
| **Tests** | `npx jest --passWithNoTests` | algún test falla (hoy pasa siempre por `--passWithNoTests`) |

### Rol en el flujo

El CI es el **gate de calidad antes del merge**. Un PR no puede mergearse a `main` si alguno de estos tres pasos falla. Protege la rama principal de código con errores de tipos o reglas de lint incumplidas.

---

## 3. CD — GitHub Actions (`cd.yml`)

**Disparo:** en cada `push` a `main` (incluyendo merges de PR)  
**Runner:** `ubuntu-latest`, Node 20

### Pasos

| Paso | Detalle |
|---|---|
| Checkout | `actions/checkout@v4` |
| Setup Node | `actions/setup-node@v4` (cache npm) |
| Instalar deps | `npm ci` |
| Setup EAS | `expo/expo-github-action@v8`, requiere secreto `EXPO_TOKEN` |
| **Publicar update** | `eas update --channel preview --message "<mensaje del commit>" --non-interactive` |

### Qué publica

`eas update` empaqueta el bundle JS + assets actualizados y los sube al canal `preview` en EAS Update. No genera un nuevo APK.

---

## 4. EAS Update — OTA (Over-the-Air)

Cada APK instalado en un dispositivo tiene grabada la URL del proyecto en EAS y el canal al que pertenece (`preview`). Al abrirse la app:

1. El cliente de `expo-updates` consulta EAS si hay un bundle nuevo en el canal `preview`.
2. Si existe uno más reciente que el instalado, lo descarga en segundo plano.
3. En el **siguiente arranque** de la app, el nuevo bundle se ejecuta.

### Limitación importante

OTA solo actualiza código JavaScript y assets (imágenes, fuentes, etc.). **No puede actualizar código nativo.** Si un cambio requiere código nativo, se necesita un nuevo EAS Build.

---

## 5. EAS Build — Manual (solo cuando hay cambios nativos)

**Cuándo correrlo:** solo cuando el cambio involucra código nativo:
- Nueva librería con módulo nativo (ej. `react-native-camera`)
- Cambio de permisos en `app.json` / `AndroidManifest`
- Nuevo plugin de Expo que modifica el proyecto nativo
- Cambio de versión SDK de Expo

**Comando:**

```bash
eas build --platform android --profile preview --non-interactive --no-wait
```

### Flags

| Flag | Por qué |
|---|---|
| `--platform android` | Solo Android por ahora |
| `--profile preview` | Perfil definido en `eas.json`, genera APK instalable directamente |
| `--non-interactive` | Necesario para correrlo en CI o en terminales sin interacción |
| `--no-wait` | No bloquea la terminal; el build corre en la nube de EAS |

### Perfiles en `eas.json`

| Perfil | Uso |
|---|---|
| `development` | Dev client para correr con `expo start --dev-client` |
| `preview` | APK interno, sin store, para distribución manual |
| `production` | Build para subir al Play Store, con auto-increment de versión |

### Post-build

Una vez que EAS termina el build, hay que redistribuir el APK a los dispositivos. Los nuevos APKs ya traen el canal correcto grabado, así que los OTA updates siguientes se aplican automáticamente.

---

## Resumen de responsabilidades

| Capa | Quién lo corre | Qué garantiza |
|---|---|---|
| Pre-commit | Git hook local | El código que sale del equipo pasa ESLint |
| CI | GitHub Actions (en PR) | Tipos correctos + lint + tests antes del merge |
| CD | GitHub Actions (en push a main) | Cada merge genera un OTA update automático |
| EAS Build | Manual, a demanda | Nuevo APK solo cuando cambia código nativo |
