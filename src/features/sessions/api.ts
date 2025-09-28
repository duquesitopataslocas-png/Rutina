import { supabase } from '@/lib/supabase';
import type { RoutineWithExercises, Session } from '@/types/database';

export interface TodayRoutineResult {
  session: Session | null;
  routine: RoutineWithExercises | null;
}

export async function fetchTodayRoutine(clientId: string, date: string): Promise<TodayRoutineResult> {
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientId)
    .eq('date', date)
    .maybeSingle();

  if (sessionError) {
    throw sessionError;
  }

  let routine: RoutineWithExercises | null = null;
  if (session?.routine_id) {
    const { data, error } = await supabase
      .from('routines')
      .select(
        `*,
        routine_exercises(*, exercise:exercises(*))
      `
      )
      .eq('id', session.routine_id)
      .single();
    if (error) {
      throw error;
    }
    routine = {
      ...(data as any),
      routine_exercises: ((data as any).routine_exercises ?? []).map((item: any) => ({
        ...item,
        exercise: item.exercise
      }))
    } as RoutineWithExercises;
  }

  return { session: session ?? null, routine };
}

export async function markSessionComplete(sessionId: string) {
  const { error } = await supabase.from('sessions').update({ status: 'done' }).eq('id', sessionId);
  if (error) {
    throw error;
  }
}
