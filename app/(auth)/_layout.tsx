import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const { session, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/(authenticated)/(tabs)/home');
    }
  }, [loading, session, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
