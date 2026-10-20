-- Run in Supabase SQL editor.

create table if not exists public.subscriptions (
  payer_email text primary key,
  mp_preapproval_id text unique not null,
  status text not null,               -- authorized | paused | cancelled | pending
  updated_at timestamptz not null default now()
);

create table if not exists public.exclusive_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  audio_path text not null,           -- path inside the exclusive-audio bucket
  published_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.exclusive_episodes enable row level security;

create or replace function public.is_active_subscriber()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.subscriptions s
    where lower(s.payer_email) = lower(auth.jwt() ->> 'email')
      and s.status = 'authorized'
  );
$$;

-- Users can see only their own subscription row (webhook writes with the service role).
create policy "own subscription" on public.subscriptions
  for select to authenticated
  using (lower(payer_email) = lower(auth.jwt() ->> 'email'));

create policy "subscribers read exclusive" on public.exclusive_episodes
  for select to authenticated
  using (public.is_active_subscriber());

-- Private bucket for exclusive audio.
insert into storage.buckets (id, name, public)
values ('exclusive-audio', 'exclusive-audio', false)
on conflict (id) do nothing;

create policy "subscribers read exclusive audio" on storage.objects
  for select to authenticated
  using (bucket_id = 'exclusive-audio' and public.is_active_subscriber());
