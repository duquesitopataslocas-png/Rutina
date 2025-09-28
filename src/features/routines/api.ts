import { supabase } from '@/lib/supabase';
import type { Routine, RoutineExercise, RoutineWithExercises } from '@/types/database';

export async function fetchRoutine(routineId: string): Promise<RoutineWithExercises | null> {
  const { data, error } = await supabase
    .from('routines')
    .select(
      `*,
      routine_exercises(*, exercise:exercises(*))
    `
    )
    .eq('id', routineId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return {
    ...(data as Routine),
    routine_exercises:
      ((data as any).routine_exercises as any[])?.map((item: any) => ({
        ...(item as RoutineExercise),
        exercise: item.exercise
      })) ?? []
  } as RoutineWithExercises;
}

export async function createRoutine(payload: Partial<Routine>, exercises: Partial<RoutineExercise>[]) {
  const { data, error } = await supabase.from('routines').insert(payload).select().single();
  if (error) {
    throw error;
  }

  const createdRoutine = data as Routine;

  if (exercises.length) {
    const { error: reError } = await supabase
      .from('routine_exercises')
      .insert(
        exercises.map((exercise, index) => ({
          ...exercise,
          routine_id: createdRoutine.id,
          order: exercise.order ?? index + 1
        }))
      );
    if (reError) {
      throw reError;
    }
  }

  return createdRoutine;
}

export async function updateRoutine(
  routineId: string,
  payload: Partial<Routine>,
  exercises: Partial<RoutineExercise>[],
  deletedExerciseIds: string[]
) {
  const { error } = await supabase.from('routines').update(payload).eq('id', routineId);
  if (error) {
    throw error;
  }

  if (deletedExerciseIds.length) {
    const { error: deleteError } = await supabase
      .from('routine_exercises')
      .delete()
      .in('id', deletedExerciseIds);
    if (deleteError) {
      throw deleteError;
    }
  }

  for (const exercise of exercises) {
    if (exercise.id) {
      const { error: updateError } = await supabase
        .from('routine_exercises')
        .update(exercise)
        .eq('id', exercise.id);
      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('routine_exercises')
        .insert({
          ...exercise,
          routine_id: routineId
        });
      if (insertError) {
        throw insertError;
      }
    }
  }
}

export async function deleteRoutine(routineId: string) {
  const { error } = await supabase.from('routines').delete().eq('id', routineId);
  if (error) {
    throw error;
  }
}
