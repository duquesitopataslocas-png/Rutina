import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'rutina://auth' } });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Revisa tu correo', 'Te enviamos un enlace mágico para ingresar.');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="mb-6 text-3xl font-bold text-secondary">Rutina</Text>
        <Text className="mb-4 text-base text-slate-600">
          Ingresa tu correo para recibir un enlace de acceso.
        </Text>
        <Input
          label="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
        />
        <Button title="Enviar enlace" onPress={handleMagicLink} loading={loading} disabled={!email} />
      </View>
    </KeyboardAvoidingView>
  );
}
