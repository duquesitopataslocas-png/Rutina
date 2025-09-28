import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

const STORAGE_KEY = 'rutina.offlineQueue';

type FeedbackPayload = {
  session_id: string;
  rpe: number | null;
  pain: number | null;
  adherence: number | null;
  comments: string | null;
  media: string | null;
  rating: number | null;
};

type CompleteSessionPayload = {
  session_id: string;
  status: 'done';
};

export type OfflineAction =
  | { id: string; type: 'submit_feedback'; payload: FeedbackPayload }
  | { id: string; type: 'complete_session'; payload: CompleteSessionPayload };

async function readQueue(): Promise<OfflineAction[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OfflineAction[];
  } catch (error) {
    console.error('Failed to parse offline queue', error);
    return [];
  }
}

async function writeQueue(queue: OfflineAction[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function enqueueAction(action: OfflineAction) {
  const queue = await readQueue();
  queue.push(action);
  await writeQueue(queue);
}

async function processAction(action: OfflineAction) {
  switch (action.type) {
    case 'submit_feedback': {
      const { payload } = action;
      const { error } = await supabase.from('feedback').insert(payload);
      if (error) {
        throw error;
      }
      break;
    }
    case 'complete_session': {
      const { payload } = action;
      const { error } = await supabase
        .from('sessions')
        .update({ status: payload.status })
        .eq('id', payload.session_id);
      if (error) {
        throw error;
      }
      break;
    }
    default:
      break;
  }
}

export async function processQueue() {
  const queue = await readQueue();
  if (!queue.length) return;
  const remaining: OfflineAction[] = [];

  for (const action of queue) {
    try {
      await processAction(action);
    } catch (error) {
      console.error('Failed to process action', action.type, error);
      remaining.push(action);
    }
  }

  if (remaining.length) {
    Toast.show({
      type: 'error',
      text1: 'Sincronización incompleta',
      text2: 'Algunas acciones no pudieron sincronizarse'
    });
  } else {
    Toast.show({ type: 'success', text1: 'Datos sincronizados' });
  }

  await writeQueue(remaining);
}

export async function clearQueue() {
  await writeQueue([]);
}
