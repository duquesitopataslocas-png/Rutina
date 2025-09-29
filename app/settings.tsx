import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

type SetupChannel = 'mobile' | 'web' | 'emulator';

const setupGuides: Record<SetupChannel, { title: string; steps: string[]; tip: string }> = {
  mobile: {
    title: 'Expo Go (iOS / Android)',
    steps: [
      'Instala dependencias con npm install o yarn install.',
      'Ejecuta npx expo start y elige la opción “s” para escanear desde Expo Go.',
      'Enciende el modo desarrollador en Expo Go y prueba el flujo Coach → Ajustes.'
    ],
    tip: 'Usa la misma red Wi-Fi para que Expo Go detecte el bundler. Reinicia Metro con r si ves la app congelada.'
  },
  web: {
    title: 'Navegador (Chrome / Edge)',
    steps: [
      'Instala dependencias con npm install o yarn install.',
      'Arranca npx expo start --web para servir la versión web.',
      'Abre http://localhost:8081 o la URL que Expo indique y prueba los switches de acciones rápidas.'
    ],
    tip: 'Chrome y Edge soportan NativeWind sin configuración extra. Si ves estilos sin aplicar, limpia caché con shift + reload.'
  },
  emulator: {
    title: 'Simulador / Emulador',
    steps: [
      'Configura Android Studio o Xcode previamente.',
      'Ejecuta npm run android o npm run ios para compilar nativo.',
      'Revisa la consola Metro para errores de compilación y usa r para recargar.'
    ],
    tip: 'Si fallan las builds nativas, ejecuta expo prebuild --clean y vuelve a intentar. Asegura tener JDK 17 y CocoaPods al día.'
  }
};

const troubleshooting = [
  {
    title: 'Error 403 al instalar dependencias',
    fix: 'Configura npm config set proxy/https-proxy o usa una VPN corporativa. Alternativamente instala con pnpm + registries privados.'
  },
  {
    title: 'Metro bundler no abre en el navegador',
    fix: 'Ejecuta expo r -c para limpiar caché y verifica que ningún firewall bloquee el puerto 8081.'
  },
  {
    title: 'Estilos Tailwind no se aplican en web',
    fix: 'Reinicia expo start --web y asegúrate de tener global.css importado en app/_layout.tsx.'
  }
];

export default function SettingsScreen() {
  const [channel, setChannel] = useState<SetupChannel>('web');
  const activeGuide = useMemo(() => setupGuides[channel], [channel]);

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="px-6 py-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="space-y-8">
        <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <Text className="text-2xl font-semibold text-white">Configuración inicial</Text>
          <Text className="mt-2 text-base text-slate-200">
            Rutina Coach usa Expo Router, NativeWind y TypeScript. Ajusta el canal de despliegue para ver
            los pasos específicos.
          </Text>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Canal de despliegue
          </Text>
          <View className="mt-4 flex-row justify-center space-x-3">
            {(Object.keys(setupGuides) as SetupChannel[]).map((key) => (
              <Pressable
                key={key}
                className={`flex-1 rounded-full border px-4 py-3 ${
                  channel === key ? 'border-white bg-white/10' : 'border-white/10 bg-white/5'
                }`}
                onPress={() => setChannel(key)}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    channel === key ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {setupGuides[key].title}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mt-4 text-center text-xs uppercase tracking-wider text-slate-500">
            Plataforma actual: {activeGuide.title}
            {Platform.OS === 'web' ? ' (detectado web)' : ''}
          </Text>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <Text className="text-xl font-semibold text-white">Checklist paso a paso</Text>
          {activeGuide.steps.map((step) => (
            <View key={step} className="mt-3 flex-row items-start space-x-3">
              <View className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <Text className="flex-1 text-base text-slate-100">{step}</Text>
            </View>
          ))}
          <Text className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {activeGuide.tip}
          </Text>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <Text className="text-xl font-semibold text-white">Errores comunes y solución</Text>
          {troubleshooting.map((item) => (
            <View key={item.title} className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Text className="text-base font-semibold text-white">{item.title}</Text>
              <Text className="text-sm text-slate-200">{item.fix}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <Text className="text-xl font-semibold text-white">Siguiente iteración</Text>
          <Text className="mt-2 text-base text-slate-200">
            Implementaremos autenticación con Supabase, sesiones y almacenamiento offline sincronizado.
          </Text>
          <Link href="/" className="mt-4 text-base font-semibold text-emerald-300">
            ← Volver al inicio
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
