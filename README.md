# Rutina Coach

Base móvil construida con Expo Router, TypeScript y NativeWind. Esta es la Iteración 1 del plan: únicamente el esqueleto con dos pantallas (Home y Settings) listas para compilar y extender.

## Requisitos previos

- Node.js 18 o superior
- npm 9+ (o Yarn 1.x) 
- Expo CLI (se instala automáticamente con `npx expo`)

## Instalación

```bash
# macOS / Linux / Windows (PowerShell o WSL)
git clone <repo>
cd Rutina
npm install
```

## Scripts útiles

```bash
# Arrancar el bundler (abre Metro y genera un QR)
npx expo start

# Lint opcional
npm run lint

# Formatear código
npm run format
```

## Prueba rápida

1. Ejecuta `npx expo start`.
2. Abre la app con Expo Go (dispositivo físico) o con un emulador.
3. En la pantalla inicial deberías ver el título **“Rutina Coach”** y un botón **“Ir a Ajustes”**.
4. Presiona el botón para navegar y valida que en Settings aparezca el checklist con los pasos de instalación.

Si todo eso sucede, la base está lista.

## Estructura actual

```
app/
  _layout.tsx     # Stack principal con rutas Home y Settings
  index.tsx       # Pantalla Home (botón hacia Ajustes)
  settings.tsx    # Pantalla Settings con checklist y link de retorno
assets/           # Iconos y splash por defecto de Expo
```

## Errores comunes

| Problema | Solución |
| --- | --- |
| `EADDRINUSE: address already in use 8081` | Cierra sesiones previas de Metro (`Ctrl+C`) o usa `npx expo start --port 8082`. |
| App en Expo Go queda en blanco | Ejecuta `expo r -c` para limpiar cache y reinstala dependencias. |
| Clases Tailwind no aplican | Asegúrate de que `nativewind/babel` esté en `babel.config.js` y reinicia el bundler. |
| `npm ERR! 403 Forbidden` al instalar | Configura el proxy corporativo con `npm config set proxy` / `https-proxy` o revisa la política de artefactos en tu red. |

## Próximo paso

En la siguiente iteración integraremos Supabase Auth (magic link) y comenzaremos a modelar los flujos de coach y cliente.
