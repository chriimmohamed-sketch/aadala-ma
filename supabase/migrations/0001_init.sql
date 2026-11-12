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

-- Legal knowledge encyclopedia
create table if not exists legal_documents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  official_title text not null,
  doc_type text not null,
  number text,
  issue_date date,
  publication_date date,
  publication_source text,
  effective_date date,
  status text not null default 'draft',
  current_version_id uuid,
  source_url text,
  usage_rights text,
  last_verified_at timestamptz,
  verified_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists legal_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references legal_documents(id) on delete cascade,
  version_label text not null,
  is_original boolean default false,
  published_at date,
  notes text,
  source_file text,
  created_at timestamptz default now()
);

create table if not exists legal_articles (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references legal_documents(id) on delete cascade,
  version_id uuid references legal_document_versions(id) on delete cascade,
  article_number text not null,
  title text,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz default now()
);

create table if not exists legal_amendments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references legal_documents(id) on delete cascade,
  amending_doc_id uuid references legal_documents(id),
  summary text not null,
  effective_date date,
  created_at timestamptz default now()
);

create table if not exists legal_abrogations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references legal_documents(id) on delete cascade,
  abrogating_doc_id uuid references legal_documents(id),
  scope text not null default 'full',
  effective_date date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists legal_sources (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references legal_documents(id) on delete set null,
  source_type text not null,
  source_ref text not null,
  retrieved_at timestamptz default now(),
  retrieved_by text,
  checksum text,
  license text,
  notes text
);

create table if not exists publication_reviews (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  reviewer_id text not null,
  action text not null,
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_legal_docs_slug on legal_documents(slug);
create index if not exists idx_legal_articles_doc on legal_articles(document_id);
create index if not exists idx_legal_versions_doc on legal_document_versions(document_id);