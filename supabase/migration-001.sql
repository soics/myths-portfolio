-- Migration 001: Add audit columns, indexes, and rate-limiting support

-- Add request_id and updated_at to existing contact_messages
alter table public.contact_messages add column if not exists request_id text;
alter table public.contact_messages add column if not exists updated_at timestamptz;

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_contact_messages_read_at on public.contact_messages(read_at);

-- Add audit columns to blog_posts
alter table public.blog_posts add column if not exists updated_at timestamptz not null default now();
alter table public.blog_posts add column if not exists author text;
create index if not exists idx_blog_posts_published on public.blog_posts(published) where published = true;
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_created_at on public.blog_posts(created_at desc);

-- Add audit columns to projects
alter table public.projects add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_projects_featured on public.projects(featured) where featured = true;
create index if not exists idx_projects_created_at on public.projects(created_at desc);

-- Add audit columns to updates
alter table public.updates add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_updates_created_at on public.updates(created_at desc);

-- Add audit columns to certificates
alter table public.certificates add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_certificates_issued_at on public.certificates(issued_at desc);

-- Enable pgcrypto if not already enabled
create extension if not exists pgcrypto;
