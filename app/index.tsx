import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

const coachChecklist = [
  'Crea un cliente y asigna su primera rutina.',
  'Define ejercicios con series, repeticiones y carga.',
  'Revisa el feedback diario para ajustar progresiones.'
];

const clientPreview = [
  'Consulta la sesión del día incluso sin conexión.',
  'Marca cada ejercicio como hecho y registra tu esfuerzo.',
  'Envía feedback con dolor, comentarios y adjuntos.'
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-24 pt-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6">
          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              KineFlow · MVP
            </Text>
            <Text className="mt-4 text-3xl font-bold text-white">Rutinas inteligentes para kinesiólogos</Text>
            <Text className="mt-3 text-base leading-6 text-slate-200">
              Administra clientes, diseña programas completos y recibe el feedback de cada sesión desde un mismo lugar.
            </Text>
            <Link href="/settings" asChild>
              <Pressable className="mt-6 rounded-full bg-emerald-400 px-6 py-3">
                <Text className="text-center text-base font-semibold text-slate-950">Abrir guía rápida</Text>
              </Pressable>
            </Link>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-lg font-semibold text-white">Lo que tendrás como coach</Text>
            <View className="mt-4 space-y-3">
              {coachChecklist.map((item) => (
                <View key={item} className="flex-row items-start">
                  <View className="mt-1 mr-3 h-2 w-2 rounded-full bg-emerald-400" />
                  <Text className="flex-1 text-base leading-6 text-slate-200">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-lg font-semibold text-white">Vista previa para tus clientes</Text>
            <View className="mt-4 space-y-3">
              {clientPreview.map((item) => (
                <View key={item} className="flex-row items-start">
                  <View className="mt-1 mr-3 h-2 w-2 rounded-full bg-sky-400" />
                  <Text className="flex-1 text-base leading-6 text-slate-200">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Text className="text-lg font-semibold text-white">Siguiente iteración</Text>
            <Text className="mt-3 text-base leading-6 text-slate-200">
              Integraremos Supabase con login por magic link, almacenaremos rutinas y feedback, y añadiremos modo offline con AsyncStorage.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
