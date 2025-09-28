import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { AppProviders } from '@/providers/AppProviders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function RootLayout() {
  useEffect(() => {
    const requestPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        await Notifications.requestPermissionsAsync();
      }
    };

    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="settings" options={{ title: 'Configuración' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Ingresar', presentation: 'modal' }} />
      </Stack>
    </AppProviders>
  );
}
