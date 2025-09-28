# Rutina

App móvil (Expo + React Native) para coaches de kinesiología y sus clientes. Incluye estructura inicial con Expo Router, autenticación por Supabase, NativeWind, React Query, caché local y recordatorio de notificaciones diarias.

## Requisitos previos
- Node.js 18+
- npm 9+ o yarn/pnpm (usa npm por defecto)
- Cuenta y proyecto en Supabase con las tablas/policies del archivo [`supabase/schema.sql`](supabase/schema.sql)
- Expo CLI (`npm install -g expo-cli`) opcional para desarrollo local

## Variables de entorno
Crea un archivo `.env` o utiliza los mecanismos de Expo para exponer las variables públicas:

```bash
EXPO_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="tu-clave-anon"
```

## Scripts útiles

```bash
npm install
npm run start      # abre Expo Dev Tools
npm run android    # compila app nativa Android
npm run ios        # compila app nativa iOS (en macOS con Xcode)
npm run web        # modo web
npm run lint       # lint con ESLint
npm run format     # revisa formato con Prettier
npm run format:write
npm run typecheck
npm test
```

## Estructura principal
- `app/` rutas Expo Router (Home, Settings, Login)
- `src/providers/` contextos globales (Supabase, React Query)
- `src/components/` UI reutilizable con NativeWind
- `src/lib/` utilidades (Supabase client, AsyncStorage)
- `src/utils/notifications.ts` recordatorios diarios
- `supabase/schema.sql` definición de tablas y políticas RLS iniciales

## Flujo actual
1. Login por magic link de Supabase.
2. Dashboard básico con bienvenida y acceso a Configuración.
3. Configuración muestra correo e ID del usuario autenticado.
4. Se agenda un recordatorio diario de entrenamiento al iniciar sesión.

## Próximos pasos sugeridos
- Implementar tabs separadas para coach vs cliente según rol.
- CRUD completo para clientes, rutinas y ejercicios.
- Sincronización offline con cola y estrategias de replicación.
- Registro de feedback y exportación CSV.

## Errores comunes
- **Faltan variables de entorno:** revisa `.env` y reinicia Expo.
- **Permisos de notificaciones denegados:** ve a ajustes del dispositivo y habilita notificaciones para la app.
- **Clases Tailwind no aplican:** asegúrate de correr `npm install` y reiniciar Expo (NativeWind requiere reinicio ante cambios en `tailwind.config.js`).
- **No llega el magic link:** en Supabase habilita `Email Confirmations` y revisa la plantilla.

## Tests manuales rápidos
1. Ejecuta `npm run start` y abre en Expo Go.
2. Ingresa un correo válido y recibe el magic link.
3. Tras loguearte, deberías ver el dashboard con botón de configuración.
4. Navega a Configuración y confirma que aparece tu email.

Si ves la vista de inicio y puedes navegar sin errores, la base quedó lista.
