import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  const expoPushToken = token.data;

  await supabase
    .from('push_tokens')
    .upsert({ user_id: userId, expo_push_token: expoPushToken })
    .select();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Recordatorio diario',
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  return expoPushToken;
}

export async function scheduleDailyReminder(hour = 9, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Entrenamiento del día',
      body: 'No olvides completar tu rutina de hoy.'
    },
    trigger: {
      hour,
      minute,
      repeats: true
    }
  });
}
