import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  offlineQueue: '@rutina/offlineQueue',
  cachedRoutines: '@rutina/cachedRoutines'
};

export async function saveItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}
