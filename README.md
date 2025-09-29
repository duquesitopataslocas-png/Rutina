# KineFlow

Base Expo + React Native + TypeScript lista para comenzar el MVP de rutinas inteligentes para kinesiólogos.

## Requisitos previos

- Node.js 18.18 o superior (el instalador detendrá `npm install` si detecta una versión más antigua)
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

# Ejecutar la versión web en Chrome/Edge/Firefox (sirve en http://localhost:19006)
npx expo start --web --port 19006

# Linter opcional una vez instaladas las dependencias
npm run lint
```

## Ejecución desde Visual Studio Code (Run and Debug)

1. Abre la carpeta del proyecto en VS Code.
2. Instala las dependencias (`npm install`).
3. Abre la vista **Run and Debug** (`Ctrl+Shift+D` o `⇧⌘D`).
4. Selecciona la configuración **Expo Web (Chrome)** y pulsa **Run** ▶️.
5. La tarea previa levantará `expo start --web --port 19006` en segundo plano y, cuando esté listo, se abrirá una pestaña de Chrome apuntando a `http://localhost:19006`.
6. Para detener todo, detén la depuración en VS Code; se ejecutará automáticamente la tarea `terminate expo web` para cerrar Metro.

### Si Expo Go muestra pantalla roja por `expo-router/babel`

1. Abre `package.json` y confirma que exista la línea `"main": "expo-router/entry"`.
2. Abre `app.config.ts` y verifica que incluya `entryPoint: './node_modules/expo-router/entry'`.
3. Asegúrate de que `babel.config.js` tenga únicamente:
   ```js
   presets: ['babel-preset-expo']
   ```
4. Limpia la caché de Metro:
   ```bash
   npx expo start --clear
   ```
5. Si el error persiste, elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install` antes de volver a iniciar Expo.

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
scripts/
  check-node.cjs  # Verificación de versión mínima de Node antes de instalar dependencias
```

## Errores comunes

| Problema | Solución |
| --- | --- |
| `BABEL: expo-router/babel is deprecated` | Asegúrate de que `package.json` incluya `"main": "expo-router/entry"`, que `app.config.ts` defina `entryPoint: './node_modules/expo-router/entry'` y que `babel.config.js` solo use `presets: ["babel-preset-expo"]`. Limpia Metro con `npx expo start --clear`; si el mensaje persiste, elimina `node_modules` + `package-lock.json`, ejecuta `npm install` y relanza. |
| `EADDRINUSE: address already in use 8081` | Cierra sesiones previas de Metro (`Ctrl+C`) o ejecuta `npx expo start --port 8082`. |
| `ERR_CONNECTION_REFUSED en localhost` | Asegúrate de que Expo Web esté corriendo (`npx expo start --web --port 19006`). Si VS Code abre otra URL, cambia la configuración a `http://localhost:19006` o recarga manualmente esa dirección. |
| `SyntaxError: Unexpected token '.' en @expo/cli` | Ocurre con versiones antiguas de Node (<18.18) porque no entienden el código compilado de Expo CLI. El script `npm install` ahora falla temprano con un mensaje claro; actualiza a Node 18.18+ (nvm, nvm-windows, Volta o instalador oficial), reinstala dependencias y vuelve a ejecutar `npx expo start`. |
| `npm ERR! 403 Forbidden` | Configura proxy corporativo (`npm config set proxy` / `https-proxy`) o usa un mirror autorizado. |

## Próximo paso

Siguiente iteración: integrar Supabase (Auth + Postgres) para gestionar usuarios, clientes y rutinas, manteniendo cache offline con React Query + AsyncStorage.
