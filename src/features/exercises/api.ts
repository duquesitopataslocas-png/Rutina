import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types/database';

export async function fetchExercises(coachId: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('coach_id', coachId)
    .order('name');

  if (error) {
    throw error;
  }

  return data as Exercise[];
}

export async function createExercise(payload: Partial<Exercise> & { coach_id: string }): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data as Exercise;
}

export async function updateExercise(id: string, payload: Partial<Exercise>): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').update(payload).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data as Exercise;
}

export async function deleteExercise(id: string) {
  const { error } = await supabase.from('exercises').delete().eq('id', id);
  if (error) {
    throw error;
  }
}
