import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuthContext } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import Toast from 'react-native-toast-message';
import { registerForPushNotificationsAsync, scheduleDailyReminder } from '@/features/notifications';
import { useOfflineSync } from '@/hooks/useOfflineSync';

function AppEffects() {
  useOfflineSync();
  const { user } = useAuthContext();

  useEffect(() => {
    const setupNotifications = async () => {
      if (!user) return;
      await registerForPushNotificationsAsync(user.id);
      await scheduleDailyReminder();
    };

    setupNotifications();
  }, [user]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppEffects />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
        </Stack>
        <Toast position="bottom" />
      </AuthProvider>
    </QueryProvider>
  );
}
