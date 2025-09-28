import { supabase } from '@/lib/supabase';
import type { Feedback, FeedbackWithSession } from '@/types/database';

export interface FeedbackInput {
  session_id: string;
  rpe: number | null;
  pain: number | null;
  adherence: number | null;
  comments: string | null;
  media: string | null;
  rating: number | null;
}

export async function submitFeedback(payload: FeedbackInput): Promise<Feedback> {
  const { data, error } = await supabase.from('feedback').insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data as Feedback;
}

export async function fetchFeedbackByClient(clientId: string): Promise<FeedbackWithSession[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select(`*, session:sessions(*, routine:routines(*))`)
    .eq('session.client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as any[]).map((item) => ({
    ...(item as Feedback),
    session: item.session,
    routine: item.session?.routine ?? null
  }));
}
