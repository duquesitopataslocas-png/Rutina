import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export default function AuthenticatedLayout() {
  const { session, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/(auth)');
    }
  }, [loading, session, router]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coach/clients/index" options={{ title: 'Clientes' }} />
      <Stack.Screen name="coach/clients/create" options={{ title: 'Nuevo Cliente' }} />
      <Stack.Screen name="coach/clients/[id]" options={{ title: 'Detalle Cliente' }} />
      <Stack.Screen name="coach/routines/[id]" options={{ title: 'Rutina' }} />
    </Stack>
  );
}
