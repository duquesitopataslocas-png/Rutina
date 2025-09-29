# Rutina Coach

Base móvil y web construida con Expo Router, TypeScript y NativeWind. Esta es la Iteración 1 del plan: un esqueleto interactivo con Home (selector de rol + switches de acciones rápidas) y Settings (guía dinámica de instalación) listo para compilar y extender.

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

# Ejecutar la versión web (Chrome/Edge/Firefox)
npx expo start --web

# Lint opcional
npm run lint

# Formatear código
npm run format
```

## Prueba rápida

1. Ejecuta `npx expo start` (o `npx expo start --web` si solo quieres probar en Chrome).
2. Abre la app con Expo Go, emulador o navegador.
3. En la pantalla Home alterna entre los roles **Coach** y **Cliente**; valida que la sección de “Acciones rápidas” muestre switches interactivos.
4. Activa o desactiva las acciones y revisa que el resumen se actualice al instante.
5. Toca “Ir a ajustes e instalación” para entrar en Settings y cambia el canal de despliegue (Mobile / Web / Emulador) para ver pasos específicos.

Si todo eso sucede, la base está lista.

## Estructura actual

```
app/
  _layout.tsx     # Stack principal con rutas Home y Settings
  index.tsx       # Pantalla Home con selector de rol, switches y resumen
  settings.tsx    # Pantalla Settings con guía por canal, troubleshooting y retorno
assets/           # Iconos y splash por defecto de Expo
```

## Errores comunes

| Problema | Solución |
| --- | --- |
| `EADDRINUSE: address already in use 8081` | Cierra sesiones previas de Metro (`Ctrl+C`) o usa `npx expo start --port 8082`. |
| App en Expo Go o web queda en blanco | Ejecuta `expo r -c` para limpiar caché y reinstala dependencias. |
| Clases Tailwind no aplican (web) | Asegúrate de tener `global.css` importado en `app/_layout.tsx` y reinicia el bundler con `npx expo start --web`. |
| `npm ERR! 403 Forbidden` al instalar | Configura el proxy corporativo con `npm config set proxy` / `https-proxy` o revisa la política de artefactos en tu red. |

## Próximo paso

En la siguiente iteración integraremos Supabase Auth (magic link) y comenzaremos a modelar los flujos de coach y cliente.
