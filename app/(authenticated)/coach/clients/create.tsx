import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/providers/AuthProvider';
import { createClient, fetchClientDetail, updateClient } from '@/features/clients/api';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function UpsertClientScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const { user } = useAuthContext();
  const coachId = user?.id ?? '';
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Editar cliente' : 'Nuevo cliente' });
  }, [isEdit, navigation]);

  const { data } = useQuery({
    queryKey: ['client-detail', id],
    queryFn: () => fetchClientDetail(id ?? ''),
    enabled: isEdit
  });

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (data) {
      setName(data.name);
      setContact(data.contact ?? '');
      setNotes(data.notes ?? '');
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEdit && id) {
        return updateClient(id, { name, contact, notes });
      }
      return createClient({ coach_id: coachId, name, contact, notes });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients', coachId] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message ?? 'No se pudo guardar el cliente');
    }
  });

  const handleSubmit = () => {
    if (!name) {
      Alert.alert('Atención', 'El nombre es obligatorio');
      return;
    }
    mutation.mutate();
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Input label="Nombre" value={name} onChangeText={setName} placeholder="Nombre del cliente" />
      <Input label="Contacto" value={contact} onChangeText={setContact} placeholder="Email / teléfono" />
      <Input
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        placeholder="Detalles importantes"
        multiline
        numberOfLines={4}
      />
      <Button title={isEdit ? 'Actualizar' : 'Crear'} onPress={handleSubmit} loading={mutation.isPending} />
    </ScrollView>
  );
}
