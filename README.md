# Rutina

Aplicación móvil (Expo + React Native) para gestionar rutinas de kinesiología entre coach y clientes con Supabase como backend.

## Estructura principal

```
app/
  _layout.tsx
  (auth)/...
  (authenticated)/...
assets/
src/
  components/
  features/
  hooks/
  lib/
  providers/
  store/
  utils/
supabase/
```

## Requisitos

- Node.js 18+
- npm 9+ o pnpm/yarn equivalentes
- Cuenta de Supabase con proyecto configurado
- Expo CLI (`npm install -g expo-cli`) opcional para comandos globales

## Instalación

```bash
npm install
```

Configura las variables en `.env` usando `.env.example` como base:

```
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=clave_service_role (para seed SQL)
SUPABASE_DB_PASSWORD=contraseña_postgres
```

## Ejecución (desarrollo)

```bash
npm run start
```

- Presiona `i` (iOS) o `a` (Android) en la CLI de Expo para lanzar el simulador.
- También puedes escanear el QR con Expo Go en un dispositivo físico.

## Scripts útiles

- `npm run lint` → corre ESLint.
- `npm run format` → aplica Prettier.

## Funcionalidades clave

- Autenticación por magic link (Supabase Auth).
- Panel coach: CRUD de clientes, rutinas y ejercicios.
- Panel cliente: rutina diaria, marcar sesión realizada, enviar feedback.
- Historial de feedback por cliente con exportación CSV.
- Cache offline con React Query + AsyncStorage y cola de sincronización.
- Notificaciones locales/push diarias mediante Expo Notifications.

## Supabase

Ejecuta los scripts para crear tablas y políticas:

```bash
supabase db push --file supabase/schema.sql
supabase db push --file supabase/policies.sql
```

Asegúrate de correr estos comandos con el CLI autenticado en tu proyecto. Si prefieres usar SQL manualmente, copia el contenido de ambos archivos en el editor SQL de Supabase.

### Triggers opcionales

Para marcar clientes nuevos, crea una función para poblar la tabla `users` tras sign up o usa Edge Functions según tus necesidades.

## Modo offline

- React Query persiste el cache en AsyncStorage.
- Acciones críticas (marcar sesión, enviar feedback) se encolan en `AsyncStorage` y se sincronizan al recuperar conexión.
- Desde Ajustes puedes forzar sincronización o limpiar la cola.

## Notificaciones

- En el primer login se solicita permiso y se registra el `expo_push_token` en `push_tokens`.
- Se programa un recordatorio diario a las 09:00. Ajusta la hora llamando a `scheduleDailyReminder` si necesitas otro horario.

## Testing manual rápido

1. Inicia la app con `npm run start` y abre Expo Go.
2. Solicita un magic link y completa el login.
3. Como coach, crea un cliente y una rutina con ejercicios.
4. Cierra sesión y entra como cliente asociado → verás la rutina y podrás marcarla como hecha + enviar feedback.
5. Regresa a coach → revisa feedback y exporta CSV (debe compartir el archivo).
6. Activa modo avión, marca sesión y envía feedback → al volver a conectar, usa “Sincronizar offline”.

Si ves la pantalla de inicio con tus listas actualizadas, la prueba pasó.

## Errores comunes

| Problema | Solución |
| --- | --- |
| Magic link no llega | Verifica que el dominio de redirección en Supabase incluya `rutina://auth` o usa un esquema válido. |
| Error de RLS al consultar | Confirma que la tabla `clients` tiene `id` igual al `user.id` del cliente y que corriste `policies.sql`. |
| Expo Notifications sin token | En dispositivos físicos asegúrate de usar una app Expo con cuentas registradas; en simuladores iOS no funcionan push tokens. |
| Exportar CSV falla | Instala la app en dispositivo con soporte `expo-sharing` (iOS/Android) y concede permisos de almacenamiento. |
| Cola offline no se procesa | Revisa conexión y toca “Sincronizar offline” en Ajustes para forzarla. |

## Supuestos

- Cada cliente autenticado tiene un registro en `users` y comparte `id` con la tabla `clients`.
- El coach crea los ejercicios previamente; las rutinas referencian ejercicios existentes.
- Los videos se guardan en Supabase Storage y `video_url` almacena la URL pública.
- El recordatorio diario usa horario local del dispositivo (09:00); ajusta según tus necesidades.

## Roadmap sugerido

- Subir fotos/videos en feedback usando Supabase Storage.
- Sincronización en segundo plano para la cola offline.
- Dashboard web para coaches con analíticas.
