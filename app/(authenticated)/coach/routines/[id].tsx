import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/providers/AuthProvider';
import { fetchExercises } from '@/features/exercises/api';
import { createRoutine, fetchRoutine, updateRoutine } from '@/features/routines/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { randomId } from '@/utils/id';

interface RoutineExerciseForm {
  key: string;
  id?: string;
  exercise_id: string;
  sets?: string;
  reps?: string;
  load?: string;
  tempo?: string;
  rest?: string;
  notes?: string;
  order: number;
}

export default function RoutineScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const clientId = typeof params.clientId === 'string' ? params.clientId : undefined;
  const isNew = id === 'new';
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const coachId = user?.id ?? '';
  const queryClient = useQueryClient();

  const { data: exercises } = useQuery({
    queryKey: ['exercises', coachId],
    queryFn: () => fetchExercises(coachId),
    enabled: Boolean(coachId)
  });

  const { data: routine } = useQuery({
    queryKey: ['routine', id],
    queryFn: () => fetchRoutine(id),
    enabled: !isNew && Boolean(id)
  });

  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState<RoutineExerciseForm[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? 'Nueva rutina' : 'Editar rutina' });
  }, [isNew, navigation]);

  useEffect(() => {
    if (routine) {
      setTitle(routine.title);
      setGoal(routine.goal ?? '');
      setStartDate(routine.start_date ?? '');
      setEndDate(routine.end_date ?? '');
      setItems(
        routine.routine_exercises.map((item, index) => ({
          key: item.id,
          id: item.id,
          exercise_id: item.exercise_id,
          sets: item.sets?.toString(),
          reps: item.reps?.toString(),
          load: item.load ?? '',
          tempo: item.tempo ?? '',
          rest: item.rest ?? '',
          notes: item.notes ?? '',
          order: item.order ?? index + 1
        }))
      );
    }
  }, [routine]);

  const availableExercises = useMemo(() => exercises ?? [], [exercises]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!clientId && isNew) {
        throw new Error('Falta el cliente');
      }

      const payload = {
        title,
        goal,
        start_date: startDate || null,
        end_date: endDate || null,
        client_id: clientId ?? routine?.client_id
      };

      const exercisePayload = items.map((item, index) => ({
        id: item.id,
        exercise_id: item.exercise_id,
        sets: item.sets ? Number(item.sets) : null,
        reps: item.reps ? Number(item.reps) : null,
        load: item.load ?? null,
        tempo: item.tempo ?? null,
        rest: item.rest ?? null,
        notes: item.notes ?? null,
        order: index + 1
      }));

      if (isNew) {
        await createRoutine(payload, exercisePayload);
      } else {
        await updateRoutine(id, payload, exercisePayload, deletedItems);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['routine', id] });
      await queryClient.invalidateQueries({ queryKey: ['client-detail', clientId ?? routine?.client_id] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message ?? 'No se pudo guardar la rutina');
    }
  });

  const handleAddExercise = () => {
    if (!availableExercises.length) {
      Alert.alert('Atención', 'Primero crea ejercicios en el panel principal.');
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        key: randomId('routine-item'),
        id: undefined,
        exercise_id: availableExercises[0].id,
        order: prev.length + 1
      }
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setItems((prev) => {
      const removed = prev[index];
      if (removed?.id) {
        setDeletedItems((ids) => [...ids, removed.id!]);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const updateItem = (index: number, updates: Partial<RoutineExerciseForm>) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item)));
  };

  const handleSubmit = () => {
    if (!title) {
      Alert.alert('Atención', 'La rutina necesita un título');
      return;
    }
    if (!items.length) {
      Alert.alert('Atención', 'Agrega al menos un ejercicio');
      return;
    }
    mutation.mutate();
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Input label="Título" value={title} onChangeText={setTitle} placeholder="Rutina fuerza" />
      <Input label="Objetivo" value={goal} onChangeText={setGoal} placeholder="Descripción del objetivo" />
      <Input
        label="Fecha inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
        placeholder="2024-01-01"
      />
      <Input
        label="Fecha fin (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
        placeholder="2024-01-31"
      />

      <Text className="mt-4 text-lg font-semibold text-secondary">Ejercicios</Text>
      {items.map((item, index) => (
        <View key={item.key} className="mt-4 rounded-lg border border-slate-200 p-4">
          <Text className="mb-2 text-base font-semibold text-secondary">Bloque {index + 1}</Text>
          <Picker
            selectedValue={item.exercise_id}
            onValueChange={(value) => updateItem(index, { exercise_id: value })}
          >
            {availableExercises.map((exercise) => (
              <Picker.Item key={exercise.id} label={exercise.name} value={exercise.id} />
            ))}
          </Picker>
          <Input
            label="Series"
            value={item.sets ?? ''}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, { sets: text })}
          />
          <Input
            label="Repeticiones"
            value={item.reps ?? ''}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, { reps: text })}
          />
          <Input label="Carga" value={item.load ?? ''} onChangeText={(text) => updateItem(index, { load: text })} />
          <Input label="Tempo" value={item.tempo ?? ''} onChangeText={(text) => updateItem(index, { tempo: text })} />
          <Input label="Descanso" value={item.rest ?? ''} onChangeText={(text) => updateItem(index, { rest: text })} />
          <Input
            label="Indicaciones"
            value={item.notes ?? ''}
            onChangeText={(text) => updateItem(index, { notes: text })}
            multiline
            numberOfLines={3}
          />
          <Button title="Eliminar ejercicio" variant="ghost" onPress={() => handleRemoveExercise(index)} />
        </View>
      ))}

      <Button title="Agregar ejercicio" variant="ghost" onPress={handleAddExercise} />
      <Button title="Guardar rutina" onPress={handleSubmit} loading={mutation.isPending} />
    </ScrollView>
  );
}
