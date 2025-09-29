# KineFlow

Base móvil y web construida con Expo Router, TypeScript y NativeWind. Iteración 1 lista para demos: una Home rica en información (selector Coach/Cliente, resumen dinámico y flujo diario) y Settings con guía contextual, checklist QA y troubleshooting actualizado.

## Requisitos previos

- Node.js 18 o superior
- npm 9+ (o Yarn 1.x)
- Expo CLI (incluido al usar `npx expo`)

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

## Prueba visual rápida

1. Ejecuta `npx expo start` (o `npx expo start --web` para Chrome).
2. Abre la app con Expo Go, emulador o navegador.
3. En Home alterna entre **Coach** y **Cliente** y revisa que cambie el gradiente, el copy y los focos principales.
4. Activa/desactiva las acciones rápidas; el bloque “Resumen inmediato” debe enumerar las automaciones encendidas.
5. Desplázate para ver “Flujo diario” y “Módulos clave”; confirma que el contenido corresponde al rol actual.
6. Pulsa “Ver guía de instalación y despliegue” y, en Settings, cambia entre Mobile/Web/Emulador para ver pasos y herramientas dinámicas.

Si ves todos los bloques y no aparece ninguna pantalla roja, la base está lista.

## Estructura actual

```
app/
  _layout.tsx     # Stack principal con rutas Home y Settings
  index.tsx       # Home mejorada: gradiente por rol, flujo diario y acciones interactivas
  settings.tsx    # Guía de despliegue con checklist, tooling y troubleshooting
assets/           # Iconos y splash por defecto de Expo
```

## Errores comunes

| Problema | Solución |
| --- | --- |
| `TransformError: expo-router/babel is deprecated` | Usa solo `babel-preset-expo` en `babel.config.js` (ya aplicado en este repo) y reinstala dependencias con `npm install`. |
| `EADDRINUSE: address already in use 8081` | Cierra sesiones previas de Metro (`Ctrl+C`) o usa `npx expo start --port 8082`. |
| App en Expo Go o web queda en blanco | Ejecuta `expo r -c` para limpiar caché y reinstala dependencias. |
| Clases Tailwind no aplican (web) | Asegúrate de tener `global.css` importado en `app/_layout.tsx` y reinicia el bundler con `npx expo start --web`. |
| `npm ERR! 403 Forbidden` al instalar | Configura el proxy corporativo con `npm config set proxy` / `https-proxy` o usa un mirror corporativo. |

## Próximo paso

En la siguiente iteración integraremos Supabase Auth (magic link) y comenzaremos a modelar los flujos de coach y cliente con almacenamiento offline.
