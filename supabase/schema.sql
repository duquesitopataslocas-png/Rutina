create extension if not exists "uuid-ossp";

-- Supuestos:
-- 1. Utilizamos la autenticación nativa de Supabase (tabla auth.users).
-- 2. La columna role vive en un perfil extendido llamado public.profiles.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  role text check (role in ('coach', 'client')) not null default 'coach',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  contact text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  video_url text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.routines (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  goal text,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.routine_exercises (
  id uuid primary key default uuid_generate_v4(),
  routine_id uuid references public.routines(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete restrict,
  order_index int not null default 0,
  sets int,
  reps text,
  load text,
  tempo text,
  rest text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  session_date date not null,
  status text not null check (status in ('pending', 'done')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade,
  rpe numeric check (rpe between 0 and 10),
  pain numeric check (pain between 0 and 10),
  adherence numeric check (adherence between 0 and 100),
  comments text,
  media_url text,
  rating numeric check (rating between 1 and 5),
  created_at timestamptz default now()
);

create table if not exists public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  expo_push_token text not null,
  created_at timestamptz default now()
);

-- RLS Policies básicas
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.sessions enable row level security;
alter table public.feedback enable row level security;
alter table public.push_tokens enable row level security;

create policy "Profiles solo dueño"
  on public.profiles for select using (auth.uid() = id);

create policy "Profiles insert"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Clients coach"
  on public.clients for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

create policy "Exercises coach"
  on public.exercises for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

create policy "Routines cliente"
  on public.routines for select using (
    auth.uid() = (select coach_id from public.clients where clients.id = routines.client_id)
    or auth.uid() = (select id from public.clients where clients.id = routines.client_id and clients.id = auth.uid())
  );

create policy "Routines coach"
  on public.routines for insert, update, delete using (
    auth.uid() = (select coach_id from public.clients where clients.id = routines.client_id)
  ) with check (
    auth.uid() = (select coach_id from public.clients where clients.id = routines.client_id)
  );

create policy "Routine exercises coach"
  on public.routine_exercises for all using (
    auth.uid() = (select coach_id from public.clients where clients.id = (select client_id from public.routines where routines.id = routine_exercises.routine_id))
  ) with check (
    auth.uid() = (select coach_id from public.clients where clients.id = (select client_id from public.routines where routines.id = routine_exercises.routine_id))
  );

create policy "Sessions acceso"
  on public.sessions for select using (
    auth.uid() = (select coach_id from public.clients where clients.id = sessions.client_id)
    or auth.uid() = (select id from public.clients where clients.id = sessions.client_id and clients.id = auth.uid())
  );

create policy "Sessions coach"
  on public.sessions for insert, update, delete using (
    auth.uid() = (select coach_id from public.clients where clients.id = sessions.client_id)
  ) with check (
    auth.uid() = (select coach_id from public.clients where clients.id = sessions.client_id)
  );

create policy "Feedback lectura"
  on public.feedback for select using (
    auth.uid() = (select coach_id from public.clients where clients.id = (select client_id from public.sessions where sessions.id = feedback.session_id))
    or auth.uid() = (select id from public.clients where clients.id = (select client_id from public.sessions where sessions.id = feedback.session_id) and clients.id = auth.uid())
  );

create policy "Feedback escritura"
  on public.feedback for insert using (
    auth.uid() = (select id from public.clients where clients.id = (select client_id from public.sessions where sessions.id = feedback.session_id) and clients.id = auth.uid())
  ) with check (
    auth.uid() = (select id from public.clients where clients.id = (select client_id from public.sessions where sessions.id = feedback.session_id) and clients.id = auth.uid())
  );

create policy "Push tokens owner"
  on public.push_tokens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
