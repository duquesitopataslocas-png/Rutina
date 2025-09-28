import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { useSupabase } from '@/providers/SupabaseProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, session, loading } = useSupabase();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [router, session]);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Falta email', 'Ingresa un correo válido.');
      return;
    }

    try {
      await signInWithEmail(email.trim().toLowerCase());
      Alert.alert('Revisa tu correo', 'Te enviamos un enlace mágico para iniciar sesión.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No pudimos enviar el enlace. Verifica el correo o intenta más tarde.');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-semibold text-gray-900">Bienvenido a Rutina</Text>
          <Text className="mt-2 text-base text-gray-600">
            Ingresa tu correo y te enviaremos un enlace mágico para acceder.
          </Text>

          <View className="mt-8 space-y-4">
            <TextField
              label="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholder="coach@rutina.app"
            />
            <PrimaryButton label={loading ? 'Enviando...' : 'Recibir enlace'} onPress={handleSubmit} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
