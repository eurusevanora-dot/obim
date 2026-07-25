-- O-BIM Project Center, ampliación: documental, avances y participantes/subcontratas.
-- RLS activo sin políticas => solo service_role (server functions).
-- Aplicada en el proyecto NEXUS-METADATA (irpkofhsaahwwkyszmzm) el 2026-07-22.

create table if not exists public.obim_documentos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria text not null default 'general' check (categoria in ('memoria','acta','contrato','plano','informe','presentacion','general')),
  fecha date not null default current_date,
  doc_path text,
  doc_nombre text,
  doc_mime text,
  notas text not null default '',
  created_at timestamptz not null default now()
);
alter table public.obim_documentos enable row level security;

create table if not exists public.obim_avances (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  titulo text not null,
  detalle text not null default '',
  etapa text not null default '',
  created_at timestamptz not null default now()
);
alter table public.obim_avances enable row level security;

create table if not exists public.obim_participantes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null default 'participante' check (tipo in ('participante','subcontrata')),
  rol text not null default '',
  contacto text not null default '',
  email text not null default '',
  telefono text not null default '',
  logo_path text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.obim_participantes enable row level security;
