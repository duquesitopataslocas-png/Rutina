create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  role text check (role in ('coach', 'client')) not null,
  name text,
  created_at timestamptz default now()
);

create table if not exists public.clients (
  id uuid primary key references public.users(id) on delete cascade,
  coach_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  contact text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  video_url text,
  tags text[],
  created_at timestamptz default now()
);

create table if not exists public.routines (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  goal text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

create table if not exists public.routine_exercises (
  id uuid primary key default uuid_generate_v4(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  "order" int default 1,
  sets int,
  reps int,
  load text,
  tempo text,
  rest text,
  notes text
);

create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  date date not null,
  status text not null default 'pending' check (status in ('pending', 'done')),
  created_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  rpe numeric,
  pain numeric,
  adherence numeric,
  comments text,
  media text,
  rating numeric,
  created_at timestamptz default now()
);

create table if not exists public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  expo_push_token text not null,
  updated_at timestamptz default now()
);

create unique index if not exists idx_clients_coach_name on public.clients(coach_id, lower(name));
create unique index if not exists idx_exercises_coach_name on public.exercises(coach_id, lower(name));
create index if not exists idx_sessions_client_date on public.sessions(client_id, date);
create index if not exists idx_feedback_session on public.feedback(session_id);
