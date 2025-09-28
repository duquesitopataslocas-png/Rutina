import { View, Text, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Button } from '@/components/Button';
import { useAuthContext } from '@/providers/AuthProvider';
import { processQueue, clearQueue } from '@/store/offlineQueue';

export default function SettingsScreen() {
  const { user, signOut } = useAuthContext();

  const handleSync = async () => {
    await processQueue();
    Alert.alert('Sincronización', 'Se intentó sincronizar la cola offline.');
  };

  const handleClearQueue = async () => {
    await clearQueue();
    Alert.alert('Cola limpia', 'Se limpiaron las acciones pendientes.');
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-secondary">Ajustes</Text>
      <Text className="mt-2 text-sm text-slate-500">{user?.email}</Text>
      <Text className="text-sm text-slate-500">Rol: {user?.role}</Text>

      <View className="mt-6">
        <Button title="Sincronizar offline" variant="ghost" onPress={handleSync} />
        <Button title="Limpiar cola" variant="ghost" onPress={handleClearQueue} />
        <Button title="Cerrar sesión" onPress={signOut} />
      </View>

      <Text className="mt-8 text-xs text-slate-400">Version {Constants.expoConfig?.version}</Text>
    </ScrollView>
  );
}
