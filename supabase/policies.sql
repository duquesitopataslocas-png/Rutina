alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.sessions enable row level security;
alter table public.feedback enable row level security;
alter table public.push_tokens enable row level security;

create policy "Users read themselves" on public.users for select using (auth.uid() = id);
create policy "Users update themselves" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Coach manages clients" on public.clients
  for all using (auth.uid() = coach_id) with check (auth.uid() = coach_id);
create policy "Client reads profile" on public.clients
  for select using (auth.uid() = id);

create policy "Coach manages exercises" on public.exercises
  for all using (auth.uid() = coach_id) with check (auth.uid() = coach_id);

create policy "Coach manages routines" on public.routines
  for all using (
    exists (
      select 1 from public.clients c
      where c.id = public.routines.client_id and c.coach_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients c
      where c.id = public.routines.client_id and c.coach_id = auth.uid()
    )
  );

create policy "Client reads routines" on public.routines
  for select using (
    exists (
      select 1 from public.clients c
      where c.id = public.routines.client_id and c.id = auth.uid()
    )
  );

create policy "Coach manages routine exercises" on public.routine_exercises
  for all using (
    exists (
      select 1 from public.routines r
      join public.clients c on c.id = r.client_id
      where r.id = public.routine_exercises.routine_id and c.coach_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routines r
      join public.clients c on c.id = r.client_id
      where r.id = public.routine_exercises.routine_id and c.coach_id = auth.uid()
    )
  );

create policy "Coach manages sessions" on public.sessions
  for all using (
    exists (
      select 1 from public.clients c
      where c.id = public.sessions.client_id and c.coach_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients c
      where c.id = public.sessions.client_id and c.coach_id = auth.uid()
    )
  );

create policy "Client reads sessions" on public.sessions
  for select using (
    exists (
      select 1 from public.clients c
      where c.id = public.sessions.client_id and c.id = auth.uid()
    )
  );
create policy "Client updates their sessions" on public.sessions
  for update using (
    exists (
      select 1 from public.clients c
      where c.id = public.sessions.client_id and c.id = auth.uid()
    )
  ) with check (status in ('pending','done'));

create policy "Client inserts feedback" on public.feedback
  for insert with check (
    exists (
      select 1 from public.sessions s
      join public.clients c on c.id = s.client_id
      where s.id = session_id and c.id = auth.uid()
    )
  );
create policy "Client updates feedback" on public.feedback
  for update using (
    exists (
      select 1 from public.sessions s
      join public.clients c on c.id = s.client_id
      where s.id = session_id and c.id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.sessions s
      join public.clients c on c.id = s.client_id
      where s.id = session_id and c.id = auth.uid()
    )
  );
create policy "Coach reads feedback" on public.feedback
  for select using (
    exists (
      select 1 from public.sessions s
      join public.clients c on c.id = s.client_id
      where s.id = session_id and c.coach_id = auth.uid()
    )
  );

create policy "Users manage push tokens" on public.push_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
