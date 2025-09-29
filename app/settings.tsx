import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const installSteps = [
  {
    title: 'Instalar dependencias',
    detail: 'Ejecuta `npm install` (o `yarn`) dentro de la carpeta del proyecto.'
  },
  {
    title: 'Arrancar Metro',
    detail: 'Usa `npx expo start` y espera a que aparezca el menú interactivo.'
  },
  {
    title: 'Ver la app',
    detail: 'Escanea el QR con Expo Go, abre un emulador o ejecuta `npx expo start --web` para Chrome.'
  }
] as const;

const quickChecks = [
  'En Home se lee “Rutinas inteligentes para kinesiólogos”.',
  'El botón “Ir a Ajustes” navega a esta pantalla.',
  'No aparecen pantallas rojas al desplazarte por la guía.'
] as const;

const commonErrors = [
  {
    issue: 'BABEL: expo-router/babel is deprecated',
    fix: 'Confirma que `package.json` defina `"main": "expo-router/entry"` y que `babel.config.js` solo tenga `presets: ["babel-preset-expo"]`. Luego corre `npx expo start --clear`; si sigue, elimina `node_modules`, reinstala y reinicia Metro.'
  },
  {
    issue: 'EADDRINUSE 8081',
    fix: 'Cierra sesiones previas de Metro o usa `npx expo start --port 8082`.'
  },
  {
    issue: "SyntaxError: Unexpected token '.' en @expo/cli",
    fix: 'Actualiza Node a la versión 18.18 o superior (usa nvm/Volta en caso necesario), reinstala dependencias y relanza `npx expo start`.'
  },
  {
    issue: 'npm ERR! 403 Forbidden',
    fix: 'Configura el proxy corporativo con `npm config set proxy` / `https-proxy` o utiliza un registry autorizado.'
  }
] as const;

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6">
          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Guía rápida</Text>
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
                <Text key={item} className="text-base leading-6 text-slate-200">
                  • {item}
                </Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
