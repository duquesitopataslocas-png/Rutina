import { ScrollView, Text, View } from 'react-native';

import { useSupabase } from '@/providers/SupabaseProvider';

export default function SettingsScreen() {
  const { session } = useSupabase();

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-semibold text-gray-900">Configuración</Text>
      <View className="mt-4 space-y-4">
        <View className="rounded-2xl bg-surface p-4 shadow-sm">
          <Text className="text-sm font-medium text-gray-500">Correo</Text>
          <Text className="text-base text-gray-900">{session?.user.email ?? 'Sin sesión'}</Text>
        </View>
        <View className="rounded-2xl bg-surface p-4 shadow-sm">
          <Text className="text-sm font-medium text-gray-500">ID de usuario</Text>
          <Text className="text-base text-gray-900">{session?.user.id ?? '-'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
