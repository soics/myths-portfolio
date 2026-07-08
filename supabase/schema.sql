create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 120),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now(),
  user_agent text,
  read_at timestamptz
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  repository_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  url text,
  issued_at date,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
alter table public.blog_posts enable row level security;
alter table public.projects enable row level security;
alter table public.updates enable row level security;
alter table public.certificates enable row level security;

create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);

create policy "Published blog posts are public"
  on public.blog_posts
  for select
  to anon
  using (published = true);

create policy "Published projects are public"
  on public.projects
  for select
  to anon
  using (featured = true);
