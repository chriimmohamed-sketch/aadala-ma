-- AADALA.MA initial schema (to be applied in Supabase SQL editor)
create table if not exists legal_sources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text,
  description text,
  file_path text,
  created_at timestamptz default now()
);

create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  locale text,
  created_at timestamptz default now()
);