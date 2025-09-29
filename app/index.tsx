import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BulletSectionProps = {
  readonly title: string;
  readonly accentColor: string;
  readonly bullets: readonly string[];
};

const BulletSection = memo(({ title, accentColor, bullets }: BulletSectionProps) => (
  <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <Text className="text-lg font-semibold text-white">{title}</Text>
    <View className="mt-4 space-y-3">
      {bullets.map((item) => (
        <View key={item} className="flex-row items-start">
          <View className="mt-1 mr-3 h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <Text className="flex-1 text-base leading-6 text-slate-200">{item}</Text>
        </View>
      ))}
    </View>
  </View>
));
BulletSection.displayName = 'BulletSection';

const coachChecklist = [
  'Crea un cliente y asigna su primera rutina.',
  'Define ejercicios con series, repeticiones y carga.',
  'Revisa el feedback diario para ajustar progresiones.'
] as const;

const clientPreview = [
  'Consulta la sesión del día incluso sin conexión.',
  'Marca cada ejercicio como hecho y registra tu esfuerzo.',
  'Envía feedback con dolor, comentarios y adjuntos.'
] as const;

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-24 pt-12">
          <View className="space-y-6">
            <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">KineFlow · MVP</Text>
              <Text className="mt-4 text-3xl font-bold text-white">Rutinas inteligentes para kinesiólogos</Text>
              <Text className="mt-3 text-base leading-6 text-slate-200">
                Administra clientes, diseña programas completos y recibe el feedback de cada sesión desde un mismo lugar.
              </Text>
              <Link href="/settings" asChild>
                <Pressable className="mt-6 items-center rounded-full bg-emerald-400 px-6 py-3">
                  <Text className="text-base font-semibold text-slate-950">Abrir guía rápida</Text>
                </Pressable>
              </Link>
            </View>

            <BulletSection title="Lo que tendrás como coach" accentColor="#34d399" bullets={coachChecklist} />

            <BulletSection title="Vista previa para tus clientes" accentColor="#38bdf8" bullets={clientPreview} />

            <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Siguiente iteración</Text>
              <Text className="mt-3 text-base leading-6 text-slate-200">
                Integraremos Supabase con login por magic link, almacenaremos rutinas y feedback, y añadiremos modo offline con AsyncStorage.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
