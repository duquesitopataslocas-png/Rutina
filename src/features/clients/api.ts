import { supabase } from '@/lib/supabase';
import type { Client, ClientWithRoutines, Routine, RoutineExercise, RoutineWithExercises } from '@/types/database';

export async function fetchClients(coachId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('coach_id', coachId)
    .order('name');

  if (error) {
    throw error;
  }

  return data as Client[];
}

export async function fetchClientDetail(clientId: string): Promise<ClientWithRoutines | null> {
  const { data, error } = await supabase
    .from('clients')
    .select(
      `*,
      routines(*,
        routine_exercises(*, exercise:exercises(*))
      ),
      sessions(*)
    `
    )
    .eq('id', clientId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) return null;

  const routines = (data.routines as any[] | null)?.map((routine) => ({
    ...(routine as Routine),
    routine_exercises: (routine.routine_exercises as any[] | null)?.map((re: any) => ({
      ...(re as RoutineExercise),
      exercise: re.exercise
    })) ?? []
  })) as RoutineWithExercises[];

  return {
    ...(data as Client),
    routines: routines ?? [],
    sessions: (data.sessions as any[]) ?? []
  };
}

export async function createClient(payload: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase.from('clients').insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function updateClient(id: string, payload: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase.from('clients').update(payload).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) {
    throw error;
  }
}
