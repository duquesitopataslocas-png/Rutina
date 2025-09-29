# KineFlow

Base Expo + React Native + TypeScript lista para comenzar el MVP de rutinas inteligentes para kinesiólogos.

## Requisitos previos

- Node.js 18 o superior
- npm 9+ (o Yarn 1.x)
- Expo CLI (se instala automáticamente al usar `npx expo`)

## Instalación

```bash
# macOS / Linux / Windows (PowerShell o WSL)
git clone <repo>
cd Rutina
npm install
```

## Scripts útiles

```bash
# Arrancar el bundler (Metro) con menú interactivo
npx expo start

# Ejecutar la versión web en Chrome/Edge/Firefox
npx expo start --web

# Linter opcional una vez instaladas las dependencias
npm run lint
```

### Si Expo Go muestra pantalla roja por `expo-router/babel`

1. Abre `package.json` y confirma que exista la línea:
   ```json
   "main": "expo-router/entry"
   ```
2. Abre `babel.config.js` y verifica que solo tenga:
   ```js
   presets: ['babel-preset-expo']
   ```
3. Limpia la caché de Metro:
   ```bash
   npx expo start --clear
   ```
4. Si el error persiste, elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install` antes de volver a iniciar Expo.

## Prueba visual rápida

1. Inicia `npx expo start` (o `npx expo start --web` para el navegador).
2. Abre la app en Expo Go, un emulador o el navegador.
3. Verifica que en Home aparezca el titular **“Rutinas inteligentes para kinesiólogos”** y el botón **“Ir a Ajustes”**.
4. Pulsa el botón y confirma que navega a **Settings**, donde se muestran los pasos de instalación, la prueba mínima y la tabla de errores.
5. Si no aparece ninguna pantalla roja y puedes volver con el gesto de navegación, la base quedó lista para continuar con Supabase.

## Estructura actual

```
app/
  _layout.tsx     # Stack principal con rutas Home y Settings
  index.tsx       # Presentación inicial con checklist para coach y cliente
  settings.tsx    # Guía de instalación, prueba rápida y errores comunes
assets/           # Iconos y splash por defecto de Expo
```

## Errores comunes

| Problema | Solución |
| --- | --- |
| `BABEL: expo-router/babel is deprecated` | Asegúrate de que `package.json` incluya `"main": "expo-router/entry"` y que `babel.config.js` solo tenga `presets: ["babel-preset-expo"]`. Luego limpia Metro con `npx expo start --clear`; si el mensaje persiste, elimina `node_modules` + `package-lock.json`, ejecuta `npm install` y relanza. |
| `EADDRINUSE: address already in use 8081` | Cierra sesiones previas de Metro (`Ctrl+C`) o ejecuta `npx expo start --port 8082`. |
| `npm ERR! 403 Forbidden` | Configura proxy corporativo (`npm config set proxy` / `https-proxy`) o usa un mirror autorizado. |

## Próximo paso

Siguiente iteración: integrar Supabase (Auth + Postgres) para gestionar usuarios, clientes y rutinas, manteniendo cache offline con React Query + AsyncStorage.
