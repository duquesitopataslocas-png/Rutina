import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

const personas = {
  coach: {
    title: 'Coach',
    description:
      'Gestiona clientes, arma rutinas completas y recibe feedback de cada sesión en tiempo real.',
    highlights: ['Agenda diaria de sesiones', 'Editor visual de rutinas', 'Historial de feedback exportable']
  },
  client: {
    title: 'Cliente',
    description:
      'Revisa tu entrenamiento del día incluso sin conexión y envía tu esfuerzo percibido al finalizar.',
    highlights: ['Modo offline básico', 'Recordatorios diarios', 'Seguimiento de dolor y adherencia']
  }
} as const;

const quickActions = [
  {
    id: 'offline',
    title: 'Modo offline',
    description:
      'Cachea la rutina y sincroniza el feedback cuando vuelva la conexión.',
    defaultEnabled: true
  },
  {
    id: 'reminder',
    title: 'Recordatorio diario',
    description: 'Configura notificaciones locales o push vía Expo Notifications.',
    defaultEnabled: false
  },
  {
    id: 'media',
    title: 'Carga multimedia',
    description: 'Adjunta fotos o videos opcionales para enriquecer el feedback del cliente.',
    defaultEnabled: false
  }
] as const;

export default function HomeScreen() {
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas>('coach');
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
        contentContainerClassName="px-6 pt-16 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Text className="text-center text-4xl font-black tracking-tight text-white">
            Rutina Coach
          </Text>
          <Text className="mt-3 max-w-xl text-center text-base text-slate-300">
            Punto de partida para la app móvil/web de kinesiólogos. Alterna entre vista de coach y
            cliente para explorar las funciones clave del MVP.
          </Text>
        </View>

        <View className="mt-10 flex-row justify-center space-x-3">
          {Object.entries(personas).map(([key, persona]) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              className={`flex-1 rounded-full border px-5 py-3 ${
                selectedPersona === key
                  ? 'border-white bg-white/10'
                  : 'border-white/10 bg-white/5'
              }`}
              onPress={() => setSelectedPersona(key as keyof typeof personas)}
            >
              <Text
                className={`text-center text-base font-semibold ${
                  selectedPersona === key ? 'text-white' : 'text-slate-300'
                }`}
              >
                {persona.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <Text className="text-2xl font-semibold text-white">{personaDetails.title}</Text>
          <Text className="mt-2 text-base leading-6 text-slate-200">{personaDetails.description}</Text>
          <View className="mt-4 space-y-2">
            {personaDetails.highlights.map((highlight) => (
              <View key={highlight} className="flex-row items-center space-x-3">
                <View className="h-2 w-2 rounded-full bg-emerald-400" />
                <Text className="flex-1 text-base text-slate-100">{highlight}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-8 space-y-4">
          <Text className="text-lg font-semibold text-white">Acciones rápidas</Text>
          {quickActions.map((action) => (
            <View
              key={action.id}
              className="flex-row items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <View className="flex-1 pr-4">
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

        <View className="mt-10 rounded-3xl border border-emerald-400/60 bg-emerald-500/10 p-6">
          <Text className="text-lg font-semibold text-emerald-200">Resumen activo</Text>
          <Text className="mt-2 text-base text-emerald-100">
            {enabledActions.length > 0
              ? `Tienes ${enabledActions.length} acciones activas: ${enabledActions
                  .map((action) => action.title)
                  .join(', ')}.`
              : 'Activa una acción rápida para personalizar tu MVP.'}
          </Text>
        </View>

        <Link href="/settings" asChild>
          <Pressable className="mt-10 items-center justify-center rounded-full bg-white px-6 py-3">
            <Text className="text-base font-semibold text-slate-900">Ir a ajustes e instalación</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
