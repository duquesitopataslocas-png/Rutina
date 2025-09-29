import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#020617' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#020617' }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'KineFlow' }} />
      <Stack.Screen name="settings" options={{ title: 'Guía de instalación' }} />
    </Stack>
  );
}
