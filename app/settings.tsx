import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

const steps = [
  'Instala dependencias con npm install o yarn install.',
  'Corre npx expo start para levantar el bundler.',
  'Escanea el QR con Expo Go (iOS/Android) o usa emulador.',
  'Verifica que en la Home aparezca el botón “Ir a Ajustes”.'
];

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="space-y-6 px-6 py-10">
        <View className="rounded-3xl bg-slate-900 p-6">
          <Text className="text-2xl font-semibold text-white">Configuración inicial</Text>
          <Text className="mt-2 text-base text-slate-200">
            Este es el punto de partida del proyecto Rutina Coach. Mantén el entorno en Expo + NativeWind.
          </Text>
        </View>

        <View className="rounded-3xl border border-slate-200 p-6">
          <Text className="text-xl font-semibold text-slate-900">Checklist rápido</Text>
          {steps.map((step) => (
            <Text key={step} className="mt-3 text-base text-slate-600">
              • {step}
            </Text>
          ))}
        </View>

        <View className="rounded-3xl border border-slate-200 p-6">
          <Text className="text-xl font-semibold text-slate-900">Siguiente iteración</Text>
          <Text className="mt-2 text-base text-slate-600">
            Implementaremos autenticación con Supabase y prepararemos los flujos de coach/cliente.
          </Text>
          <Link href="/" className="mt-4 text-base font-semibold text-slate-900">
            ← Volver al inicio
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
