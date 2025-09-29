import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

const personas = {
  coach: {
    title: 'Coach',
    subtitle: 'Administra clientes, rutinas y feedback sin perder contexto.',
    pitch:
      'Diseña planes completos, ajusta cargas en segundos y recibe métricas de adherencia y dolor de inmediato.',
    focus: ['Editor de rutinas con plantillas', 'Historial de feedback exportable', 'Alertas por adherencia baja']
  },
  client: {
    title: 'Cliente',
    subtitle: 'Consulta tu sesión del día incluso sin conexión.',
    pitch:
      'Sigue el paso a paso, registra tu esfuerzo percibido, adjunta fotos/vídeos y mantén informado a tu kinesiólogo.',
    focus: ['Modo offline con sincronización', 'Recordatorios diarios automáticos', 'Feedback guiado (RPE, dolor, comentarios)']
  }
} as const;

type PersonaKey = keyof typeof personas;

const quickActions = [
  {
    id: 'offline',
    title: 'Modo offline inteligente',
    description: 'Sincroniza feedback cuando vuelva el internet y prioriza lo más reciente.',
    defaultEnabled: true
  },
  {
    id: 'alerts',
    title: 'Alertas tempranas',
    description: 'Notifica a los coaches si un cliente reporta dolor elevado o baja adherencia.',
    defaultEnabled: true
  },
  {
    id: 'media',
    title: 'Biblioteca multimedia',
    description: 'Sube videos de ejecución y plantillas visuales para cada ejercicio.',
    defaultEnabled: false
  },
  {
    id: 'automation',
    title: 'Automatiza recordatorios',
    description: 'Programa push diarios por zona horaria y hábitos del cliente.',
    defaultEnabled: false
  }
] as const;

const dailyFlow = [
  {
    label: '1. Planifica',
    coach: 'Duplica una rutina base, personaliza series/reps y guarda.',
    client: 'Recibes la rutina actualizada con indicaciones claras.'
  },
  {
    label: '2. Ejecuta',
    coach: 'Monitorea qué clientes abrieron su sesión y envía mensajes.',
    client: 'Marca cada ejercicio y registra cargas sin salir de la vista.'
  },
  {
    label: '3. Analiza',
    coach: 'Revisa métricas RPE/dolor y exporta CSV para seguimiento médico.',
    client: 'Envía feedback guiado, fotos o videos para validar la técnica.'
  }
] as const;

const highlights = [
  {
    title: 'Cartera de clientes',
    description: 'Visualiza progreso, adherencia y últimas notas en una sola tarjeta.'
  },
  {
    title: 'Constructor de rutinas',
    description: 'Arrastra ejercicios, define series/tempo y reutiliza plantillas aprobadas.'
  },
  {
    title: 'Feedback accionable',
    description: 'Alertas automáticas ante RPE>8 o dolor>6 con acciones sugeridas.'
  }
] as const;

const personaAccent: Record<PersonaKey, string[]> = {
  coach: ['#34d399', '#14b8a6'],
  client: ['#38bdf8', '#a855f7']
};

const GradientCard = styled(LinearGradient);

export default function HomeScreen() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('coach');
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(quickActions.map((item) => [item.id, item.defaultEnabled])) as Record<
      (typeof quickActions)[number]['id'],
      boolean
    >
  );

  const personaDetails = personas[selectedPersona];
  const enabledActions = useMemo(
    () => quickActions.filter((action) => toggles[action.id]),
    [toggles]
  );

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <ScrollView
        contentContainerClassName="px-6 pb-24 pt-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <GradientCard
            colors={personaAccent[selectedPersona]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="rounded-3xl p-6"
          >
            <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              KineFlow · MVP
            </Text>
            <Text className="mt-4 text-4xl font-black leading-tight text-white">
              {personaDetails.title}: {personaDetails.subtitle}
            </Text>
            <Text className="mt-4 text-base leading-6 text-white/90">{personaDetails.pitch}</Text>
          </GradientCard>

          <View className="mt-6 flex-row rounded-full bg-white/5 p-1">
            {(Object.keys(personas) as PersonaKey[]).map((key) => {
              const isActive = selectedPersona === key;
              return (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  className={`flex-1 rounded-full px-4 py-3 ${
                    isActive ? 'bg-white' : 'bg-transparent'
                  }`}
                  onPress={() => setSelectedPersona(key)}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      isActive ? 'text-slate-900' : 'text-slate-100'
                    }`}
                  >
                    {personas[key].title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-6 space-y-3">
            {personaDetails.focus.map((item) => (
              <View key={item} className="flex-row items-center space-x-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <View className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <Text className="flex-1 text-base text-slate-100">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-10 rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Flujo diario
          </Text>
          <View className="mt-5 space-y-5">
            {dailyFlow.map((step) => (
              <View key={step.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <Text className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                  {step.label}
                </Text>
                <Text className="mt-2 text-base font-semibold text-white">Coach</Text>
                <Text className="text-sm text-slate-200">{step.coach}</Text>
                <Text className="mt-3 text-base font-semibold text-white">Cliente</Text>
                <Text className="text-sm text-slate-200">{step.client}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-10 rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Acciones activas
          </Text>
          <View className="mt-4 space-y-4">
            {quickActions.map((action) => (
              <View
                key={action.id}
                className="flex-row items-start justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <View className="flex-1 pr-6">
                  <Text className="text-base font-semibold text-white">{action.title}</Text>
                  <Text className="mt-1 text-sm text-slate-200">{action.description}</Text>
                </View>
                <Switch
                  accessibilityHint={`Activar ${action.title}`}
                  value={toggles[action.id]}
                  onValueChange={(value) =>
                    setToggles((prev) => ({
                      ...prev,
                      [action.id]: value
                    }))
                  }
                />
              </View>
            ))}
          </View>
          <View className="mt-5 rounded-3xl border border-emerald-400/50 bg-emerald-500/10 p-4">
            <Text className="text-base font-semibold text-emerald-200">Resumen inmediato</Text>
            <Text className="mt-2 text-sm text-emerald-100">
              {enabledActions.length > 0
                ? `Activas ${enabledActions.length} automaciones: ${enabledActions
                    .map((action) => action.title)
                    .join(', ')}.`
                : 'Activa al menos una acción rápida para personalizar la demo.'}
            </Text>
          </View>
        </View>

        <View className="mt-10 rounded-4xl border border-white/10 bg-white/5 p-6">
          <Text className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
            Módulos clave
          </Text>
          <View className="mt-4 space-y-4">
            {highlights.map((highlight) => (
              <View key={highlight.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <Text className="text-base font-semibold text-white">{highlight.title}</Text>
                <Text className="mt-1 text-sm text-slate-200">{highlight.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <Link href="/settings" asChild>
          <Pressable className="mt-12 items-center justify-center rounded-full bg-white px-6 py-4">
            <Text className="text-base font-semibold text-slate-900">Ver guía de instalación y despliegue</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
