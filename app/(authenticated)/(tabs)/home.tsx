import { useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAuthContext, useRole } from '@/providers/AuthProvider';
import { fetchClients } from '@/features/clients/api';
import { fetchExercises } from '@/features/exercises/api';
import { fetchTodayRoutine, markSessionComplete } from '@/features/sessions/api';
import { submitFeedback } from '@/features/feedback/api';
import { enqueueAction } from '@/store/offlineQueue';
import { randomId } from '@/utils/id';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { FeedbackInput } from '@/features/feedback/api';

function CoachHome() {
  const { user } = useAuthContext();
  const router = useRouter();
  const coachId = user?.id ?? '';

  const { data: clients } = useQuery({
    queryKey: ['clients', coachId],
    queryFn: () => fetchClients(coachId),
    enabled: Boolean(coachId)
  });

  const { data: exercises } = useQuery({
    queryKey: ['exercises', coachId],
    queryFn: () => fetchExercises(coachId),
    enabled: Boolean(coachId)
  });

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <SectionTitle
        title="Clientes"
        action={
          <Button
            title="Agregar"
            variant="ghost"
            onPress={() => router.push('/(authenticated)/coach/clients/create')}
          />
        }
      />
      {clients?.length ? (
        clients.slice(0, 5).map((client) => (
          <Link
            key={client.id}
            href={{ pathname: '/(authenticated)/coach/clients/[id]', params: { id: client.id } }}
            className="mb-3 rounded-lg border border-slate-200 p-4"
          >
            <Text className="text-base font-semibold text-secondary">{client.name}</Text>
            {client.notes ? <Text className="text-sm text-slate-500">{client.notes}</Text> : null}
          </Link>
        ))
      ) : (
        <EmptyState message="No tienes clientes aún." />
      )}
      {clients && clients.length > 5 ? (
        <Link href="/(authenticated)/coach/clients/index" className="mt-2 text-primary">
          Ver todos
        </Link>
      ) : null}

      <SectionTitle title="Ejercicios" />
      {exercises?.length ? (
        <FlatList
          data={exercises.slice(0, 5)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-3 rounded-lg border border-slate-200 p-4">
              <Text className="text-base font-medium text-secondary">{item.name}</Text>
              {item.description ? <Text className="text-sm text-slate-500">{item.description}</Text> : null}
            </View>
          )}
        />
      ) : (
        <EmptyState message="Registra ejercicios para tus rutinas." />
      )}

      <Button
        title="Gestionar clientes"
        variant="ghost"
        onPress={() => router.push('/(authenticated)/coach/clients/index')}
      />
    </ScrollView>
  );
}

function FeedbackForm({ sessionId }: { sessionId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FeedbackInput>({
    session_id: sessionId,
    rpe: null,
    pain: null,
    adherence: null,
    comments: '',
    media: null,
    rating: null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof FeedbackInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value === '' ? null : Number.isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitFeedback(form);
      await queryClient.invalidateQueries({ queryKey: ['today-routine'] });
      Alert.alert('Gracias', 'Feedback enviado');
    } catch (error) {
      console.warn('Feedback offline, se encola', error);
      await enqueueAction({ id: randomId('feedback'), type: 'submit_feedback', payload: form });
      Alert.alert('Sin conexión', 'Guardamos tu feedback y lo enviaremos al reconectar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="mt-4 rounded-lg border border-slate-200 p-4">
      <Text className="mb-2 text-base font-semibold text-secondary">Feedback</Text>
      <Input
        label="RPE (0-10)"
        keyboardType="numeric"
        value={form.rpe?.toString() ?? ''}
        onChangeText={(text) => handleChange('rpe', text)}
      />
      <Input
        label="Dolor (0-10)"
        keyboardType="numeric"
        value={form.pain?.toString() ?? ''}
        onChangeText={(text) => handleChange('pain', text)}
      />
      <Input
        label="Adherencia %"
        keyboardType="numeric"
        value={form.adherence?.toString() ?? ''}
        onChangeText={(text) => handleChange('adherence', text)}
      />
      <Input
        label="Comentarios"
        multiline
        numberOfLines={4}
        value={form.comments ?? ''}
        onChangeText={(text) => setForm((prev) => ({ ...prev, comments: text }))}
      />
      <Button title="Enviar feedback" onPress={handleSubmit} loading={submitting} />
    </View>
  );
}

function ClientHome() {
  const { user } = useAuthContext();
  const clientId = user?.id ?? '';
  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['today-routine', clientId],
    queryFn: () => fetchTodayRoutine(clientId, today),
    enabled: Boolean(clientId)
  });

  const mutation = useMutation({
    mutationFn: (sessionId: string) => markSessionComplete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-routine', clientId] });
    }
  });

  const handleComplete = async () => {
    if (!data?.session) return;
    try {
      await mutation.mutateAsync(data.session.id);
      Alert.alert('¡Listo!', 'Marcaste la sesión como hecha');
    } catch (error) {
      await enqueueAction({
        id: randomId('session'),
        type: 'complete_session',
        payload: { session_id: data.session.id, status: 'done' }
      });
      Alert.alert('Sin conexión', 'Guardamos el estado para sincronizar luego.');
    }
  };

  if (!data?.routine) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-lg font-semibold text-secondary">No hay rutina para hoy</Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Cuando tu kinesiólogo te asigne una rutina la verás aquí.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-secondary">Rutina de hoy</Text>
      <Text className="mb-4 text-sm text-slate-500">{data.routine.goal ?? 'Trabaja a tu ritmo'}</Text>

      {data.routine.routine_exercises.map((item) => (
        <View key={item.id} className="mb-3 rounded-lg border border-slate-200 p-4">
          <Text className="text-base font-semibold text-secondary">{item.exercise?.name}</Text>
          <Text className="text-sm text-slate-500">
            Series: {item.sets ?? '-'} | Reps: {item.reps ?? '-'} | Carga: {item.load ?? '-'}
          </Text>
          <Text className="text-sm text-slate-500">
            Tempo: {item.tempo ?? '-'} | Descanso: {item.rest ?? '-'}
          </Text>
          {item.notes ? <Text className="text-sm text-slate-500">Notas: {item.notes}</Text> : null}
        </View>
      ))}

      {data.session?.status !== 'done' ? (
        <Button title="Marcar como realizada" onPress={handleComplete} loading={mutation.isPending} />
      ) : (
        <Text className="mt-2 text-green-600">¡Sesión completada!</Text>
      )}

      {data.session ? <FeedbackForm sessionId={data.session.id} /> : null}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const role = useRole();

  if (role === 'coach') {
    return <CoachHome />;
  }

  if (role === 'client') {
    return <ClientHome />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-base text-slate-500">Cargando...</Text>
    </View>
  );
}
