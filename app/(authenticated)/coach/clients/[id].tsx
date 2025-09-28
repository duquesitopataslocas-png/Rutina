import { useEffect } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/providers/AuthProvider';
import { deleteClient, fetchClientDetail } from '@/features/clients/api';
import { fetchFeedbackByClient } from '@/features/feedback/api';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { exportFeedbackToCsv } from '@/utils/csv';

export default function ClientDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const coachId = user?.id ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['client-detail', id],
    queryFn: () => fetchClientDetail(id),
    enabled: Boolean(id)
  });

  const { data: feedback } = useQuery({
    queryKey: ['feedback', id],
    queryFn: () => fetchFeedbackByClient(id),
    enabled: Boolean(id)
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients', coachId] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message ?? 'No se pudo eliminar el cliente');
    }
  });

  const handleDelete = () => {
    Alert.alert('Eliminar cliente', '¿Seguro que quieres eliminar este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate() }
    ]);
  };

  const handleExport = async () => {
    if (!data) return;
    const fileUri = await exportFeedbackToCsv(feedback ?? [], `feedback-${data.name}`);
    Alert.alert('Exportación lista', `Archivo guardado en ${fileUri}`);
  };

  useEffect(() => {
    navigation.setOptions({ title: data?.name ?? 'Cliente' });
  }, [data?.name, navigation]);

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-slate-500">Cargando cliente...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-secondary">{data.name}</Text>
      {data.contact ? <Text className="text-sm text-slate-500">Contacto: {data.contact}</Text> : null}
      {data.notes ? <Text className="mt-2 text-sm text-slate-500">Notas: {data.notes}</Text> : null}

      <View className="mt-4 flex-row gap-2">
        <Button
          title="Editar"
          variant="ghost"
          onPress={() => router.push({ pathname: '/(authenticated)/coach/clients/create', params: { id } })}
        />
        <Button title="Eliminar" variant="ghost" onPress={handleDelete} loading={deleteMutation.isPending} />
      </View>

      <SectionTitle
        title="Rutinas"
        action={
          <Button
            title="Nueva rutina"
            variant="ghost"
            onPress={() => router.push({ pathname: '/(authenticated)/coach/routines/new', params: { clientId: id } })}
          />
        }
      />

      {data.routines.length ? (
        data.routines.map((routine) => (
          <Button
            key={routine.id}
            title={routine.title}
            variant="ghost"
            onPress={() => router.push({ pathname: '/(authenticated)/coach/routines/[id]', params: { id: routine.id } })}
          />
        ))
      ) : (
        <EmptyState message="Crea una rutina para este cliente." />
      )}

      <SectionTitle title="Feedback" action={<Button title="Exportar CSV" variant="ghost" onPress={handleExport} />} />
      {feedback?.length ? (
        feedback.map((item) => (
          <View key={item.id} className="mb-3 rounded-lg border border-slate-200 p-4">
            <Text className="text-sm text-secondary">{item.session?.date}</Text>
            <Text className="text-sm text-slate-500">RPE: {item.rpe ?? '-'}</Text>
            <Text className="text-sm text-slate-500">Dolor: {item.pain ?? '-'}</Text>
            {item.comments ? <Text className="text-sm text-slate-500">{item.comments}</Text> : null}
          </View>
        ))
      ) : (
        <EmptyState message="Aún no hay feedback." />
      )}
    </ScrollView>
  );
}
