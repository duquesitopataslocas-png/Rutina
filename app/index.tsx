import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const coachHighlights = [
  'Gestiona clientes y rutinas desde un mismo lugar.',
  'Configura ejercicios con series, repeticiones y carga.',
  'Visualiza feedback diario para ajustar progresiones.'
] as const;

const clientHighlights = [
  'Consulta la rutina del día incluso sin conexión.',
  'Marca la sesión como hecha y registra tu esfuerzo.',
  'Envía comentarios rápidos al finalizar cada entreno.'
] as const;

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between px-6 pb-16 pt-12">
          <View className="space-y-6">
            <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                KineFlow · MVP
              </Text>
              <Text className="mt-4 text-3xl font-bold text-white">
                Rutinas inteligentes para kinesiólogos
              </Text>
              <Text className="mt-3 text-base leading-6 text-slate-200">
                Base Expo Router + NativeWind lista para conectar Supabase y comenzar el flujo Coach/Cliente.
              </Text>
              <Link href="/settings" asChild>
                <Pressable className="mt-6 items-center rounded-full bg-emerald-400 px-6 py-3">
                  <Text className="text-base font-semibold text-slate-950">Ir a Ajustes</Text>
                </Pressable>
              </Link>
            </View>

            <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Qué tendrá el coach</Text>
              <View className="mt-4 space-y-3">
                {coachHighlights.map((item) => (
                  <Text key={item} className="text-base leading-6 text-slate-200">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>

            <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Qué verá el cliente</Text>
              <View className="mt-4 space-y-3">
                {clientHighlights.map((item) => (
                  <Text key={item} className="text-base leading-6 text-slate-200">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-lg font-semibold text-white">Siguiente iteración</Text>
            <Text className="mt-3 text-base leading-6 text-slate-200">
              Integraremos Supabase con autenticación por magic link, CRUD de clientes, rutinas y feedback con modo offline.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
