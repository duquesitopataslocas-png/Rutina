export type Role = 'coach' | 'client';

export interface User {
  id: string;
  email: string | null;
  role: Role;
  name: string | null;
}

export interface Client {
  id: string;
  coach_id: string;
  name: string;
  contact: string | null;
  notes: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  tags: string[] | null;
}

export interface Routine {
  id: string;
  client_id: string;
  title: string;
  goal: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  order: number;
  sets: number | null;
  reps: number | null;
  load: string | null;
  tempo: string | null;
  rest: string | null;
  notes: string | null;
  exercise?: Exercise;
}

export type SessionStatus = 'pending' | 'done';

export interface Session {
  id: string;
  client_id: string;
  date: string;
  routine_id: string | null;
  status: SessionStatus;
}

export interface Feedback {
  id: string;
  session_id: string;
  rpe: number | null;
  pain: number | null;
  adherence: number | null;
  comments: string | null;
  media: string | null;
  rating: number | null;
  session?: Session;
}

export interface PushToken {
  id: string;
  user_id: string;
  expo_push_token: string;
}

export interface RoutineWithExercises extends Routine {
  routine_exercises: RoutineExercise[];
}

export interface ClientWithRoutines extends Client {
  routines: RoutineWithExercises[];
  sessions: Session[];
}

export interface FeedbackWithSession extends Feedback {
  session: Session;
  routine?: Routine | null;
}
