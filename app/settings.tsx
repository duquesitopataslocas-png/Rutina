import { ScrollView, Text, View } from 'react-native';

const installSteps = [
  { title: 'Instalar dependencias', detail: 'Ejecuta `npm install` dentro de la carpeta del proyecto.' },
  { title: 'Iniciar Metro', detail: 'Lanza `npx expo start` y espera a que el bundler quede listo.' },
  {
    title: 'Abrir la app',
    detail: 'Escanea el QR con Expo Go, abre un emulador o usa `npx expo start --web` para Chrome.'
  }
];

const quickChecks = [
  'En Home debe verse el titular “Rutinas inteligentes para kinesiólogos”.',
  'El botón “Abrir guía rápida” navega nuevamente a esta pantalla.',
  'No aparece ninguna pantalla roja al desplazarte por la guía.'
];

const commonErrors = [
  {
    issue: 'BABEL: expo-router/babel is deprecated',
    fix: 'Asegúrate de que `babel.config.js` solo use `presets: ["babel-preset-expo"]` y reinstala dependencias.'
  },
  {
    issue: 'EADDRINUSE 8081',
    fix: 'Cierra otras sesiones de Metro o ejecuta `npx expo start --port 8082`.'
  },
  {
    issue: 'npm ERR! 403 Forbidden',
    fix: 'Configura el proxy corporativo (`npm config set proxy ...`) o usa un mirror autorizado.'
  }
];

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="space-y-6 px-6 pb-24 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
          Guía rápida
        </Text>
        <Text className="mt-3 text-2xl font-semibold text-white">Instalación y ejecución</Text>
        <View className="mt-4 space-y-4">
          {installSteps.map((step) => (
            <View key={step.title}>
              <Text className="text-base font-semibold text-white">{step.title}</Text>
              <Text className="mt-1 text-base leading-6 text-slate-200">{step.detail}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <Text className="text-lg font-semibold text-white">Prueba visual mínima</Text>
        <View className="mt-4 space-y-3">
          {quickChecks.map((item) => (
            <View key={item} className="flex-row items-start">
              <View className="mt-1 mr-3 h-2 w-2 rounded-full bg-emerald-400" />
              <Text className="flex-1 text-base leading-6 text-slate-200">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <Text className="text-lg font-semibold text-white">Errores comunes</Text>
        <View className="mt-4 space-y-4">
          {commonErrors.map((item) => (
            <View key={item.issue}>
              <Text className="text-base font-semibold text-white">{item.issue}</Text>
              <Text className="mt-1 text-base leading-6 text-slate-200">{item.fix}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
