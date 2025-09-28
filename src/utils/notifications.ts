import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function scheduleDailyReminder(hour = 9) {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de entrenar 💪',
      body: 'Revisa tu rutina y registra tu sesión de hoy.'
    },
    trigger: {
      hour,
      minute: 0,
      repeats: true
    }
  });
}
