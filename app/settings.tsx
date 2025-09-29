import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

type SetupChannel = 'mobile' | 'web' | 'emulator';

const GradientPanel = styled(LinearGradient);

const setupGuides: Record<SetupChannel, { title: string; steps: string[]; tooling: string[]; tip: string }> = {
  mobile: {
    title: 'Expo Go (iOS / Android)',
    steps: [
      'Instala dependencias con npm install (o yarn) y ejecuta npx expo start.',
      'Pulsa «s» para mostrar el código QR y escanéalo con Expo Go.',
      'Habilita el modo desarrollador y prueba el flujo Coach → Acciones rápidas → Feedback.'
    ],
    tooling: ['Expo Go actualizado', 'Dispositivo y computadora en la misma red Wi-Fi', 'Credenciales de Supabase listas'],
    tip: 'Si Expo Go queda en pantalla roja, ejecuta expo r -c y fuerza cierre de la app antes de reintentar.'
  },
  web: {
    title: 'Navegador (Chrome / Edge)',
    steps: [
      'Instala dependencias y levanta npx expo start --web.',
      'Visita la URL indicada (usualmente http://localhost:8081) en Chrome/Edge.',
      'Valida NativeWind inspeccionando que los toggles cambian los textos en “Resumen inmediato”.'
    ],
    tooling: ['Chrome 113+ o Edge 113+', 'Extensión React Developer Tools opcional', 'Tailwind devtools para inspección rápida'],
    tip: 'Si se ve sin estilos, borra .expo/web/cache y recarga con shift + reload.'
  },
  emulator: {
    title: 'Simulador / Emulador',
    steps: [
      'Prepara Android Studio (API 34) o Xcode 15 con Command Line Tools.',
      'Ejecuta npm run android o npm run ios para compilar nativo.',
      'Observa Metro para logs; usa r para recargar y m para abrir dev menu.'
    ],
    tooling: ['JDK 17 configurado', 'CocoaPods 1.14+ (macOS)', 'Android SDK Platform 34'],
    tip: 'Si fallan builds nativas, corre expo prebuild --clean y reinstala pods / gradle wrappers.'
  }
};

const troubleshooting = [
  {
    title: 'TransformError expo-router/babel',
    fix: 'Desde SDK 51 usa solo babel-preset-expo. Ejecuta npm install y verifica que babel.config.js no incluya expo-router/babel.'
  },
  {
    title: 'Error 403 al instalar dependencias',
    fix: 'Configura npm config set proxy/https-proxy o usa un mirror corporativo. pnpm i --registry=<url> también funciona.'
  },
  {
    title: 'Metro bundler no abre en navegador',
    fix: 'Libera el puerto 8081 o usa npx expo start --port 8082. Limpia caché con expo r -c.'
  },
  {
    title: 'Estilos Tailwind sin aplicar',
    fix: 'Confirma la importación de global.css en app/_layout.tsx y reinicia el bundler.'
  }
];

const qaChecklist = [
  'La pantalla Home alterna correctamente entre Coach y Cliente.',
  'Los switches actualizan el texto “Activas X automaciones…”.',
  'La navegación hacia Ajustes funciona y muestra el checklist según canal.',
  'No aparecen errores rojos al recargar (TransformError resuelto).'
];

export default function SettingsScreen() {
  const [channel, setChannel] = useState<SetupChannel>('mobile');
  const activeGuide = useMemo(() => setupGuides[channel], [channel]);

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="px-6 py-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="space-y-10">
        <GradientPanel
          colors={['#0ea5e9', '#6366f1']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="rounded-4xl p-6"
        >
          <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Configuración
          </Text>
          <Text className="mt-3 text-3xl font-black text-white">Despliegue listo para KineFlow</Text>
          <Text className="mt-4 text-base leading-6 text-white/90">
            Elige un canal para ver pasos concretos, herramientas necesarias y tips de resolución de problemas.
            Esta guía asegura que la demo funcione en Expo Go, web o emuladores sin pantallas rojas.
          </Text>
        </GradientPanel>

        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Canal de despliegue
          </Text>
          <View className="mt-4 flex-row rounded-full bg-white/5 p-1">
            {(Object.keys(setupGuides) as SetupChannel[]).map((key) => {
              const isActive = channel === key;
              return (
                <Pressable
                  key={key}
                  className={`flex-1 rounded-full px-4 py-3 ${isActive ? 'bg-white' : 'bg-transparent'}`}
                  onPress={() => setChannel(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      isActive ? 'text-slate-900' : 'text-slate-100'
                    }`}
                  >
                    {setupGuides[key].title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text className="mt-4 text-center text-xs uppercase tracking-widest text-slate-500">
            Plataforma actual: {activeGuide.title}
            {Platform.OS === 'web' ? ' (detectado web)' : ''}
          </Text>
        </View>

        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Pasos esenciales
          </Text>
          <View className="mt-4 space-y-4">
            {activeGuide.steps.map((step) => (
              <View key={step} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <Text className="text-sm text-slate-100">{step}</Text>
              </View>
            ))}
          </View>
          <View className="mt-6 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-4">
            <Text className="text-sm font-semibold text-emerald-200">Tip rápido</Text>
            <Text className="mt-2 text-sm text-emerald-100">{activeGuide.tip}</Text>
          </View>
        </View>

        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Herramientas necesarias
          </Text>
          <View className="mt-4 space-y-3">
            {activeGuide.tooling.map((item) => (
              <View key={item} className="flex-row items-center space-x-3 rounded-3xl border border-white/10 bg-white/5 p-3">
                <View className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                <Text className="flex-1 text-sm text-slate-100">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Checklist QA rápido
          </Text>
          <View className="mt-4 space-y-3">
            {qaChecklist.map((item) => (
              <View key={item} className="flex-row items-start space-x-3">
                <Text className="mt-1 text-base text-emerald-300">•</Text>
                <Text className="flex-1 text-sm text-slate-100">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Errores comunes
          </Text>
          <View className="mt-4 space-y-4">
            {troubleshooting.map((item) => (
              <View key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <Text className="text-base font-semibold text-white">{item.title}</Text>
                <Text className="mt-2 text-sm text-slate-200">{item.fix}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="items-center justify-center rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-base text-slate-200">
            ¿Listo para continuar? Implementaremos Supabase Auth y sincronización offline en la siguiente iteración.
          </Text>
          <Link href="/" className="mt-4 text-base font-semibold text-emerald-300">
            ← Volver a Home
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
