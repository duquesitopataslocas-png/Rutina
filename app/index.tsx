import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useSupabase } from '@/providers/SupabaseProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { scheduleDailyReminder } from '@/utils/notifications';

export default function HomeScreen() {
  const router = useRouter();
  const { session, signOut } = useSupabase();

  useEffect(() => {
    if (!session) {
      router.replace('/auth/login');
      return;
    }
    scheduleDailyReminder().catch(console.error);
  }, [router, session]);

  if (!session) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-gray-900">Hola 👋</Text>
        <Text className="mt-1 text-base text-gray-600">
          Este es el dashboard inicial de Rutina. Aquí mostraremos el resumen diario del coach o cliente según su rol.
        </Text>
      </View>

      <View className="mb-4 rounded-2xl bg-surface p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900">Accesos rápidos</Text>
        <View className="mt-3 space-y-3">
          <Link
            href="/settings"
            className="rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-white"
          >
            Configuración
          </Link>
          <PrimaryButton label="Cerrar sesión" variant="secondary" onPress={signOut} />
        </View>
      </View>
    </ScrollView>
  );
}
