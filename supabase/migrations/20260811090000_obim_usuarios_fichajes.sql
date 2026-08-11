-- O-BIM: usuarios autorizados (login email+PIN) y fichaje/tickaje con coste imputado.
-- RLS activo sin políticas => solo service_role (server functions).
-- Aplicada en el proyecto NEXUS-METADATA (irpkofhsaahwwkyszmzm) el 2026-08-11.

create table if not exists public.obim_usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  nombre text not null default '',
  rol text not null default 'participante' check (rol in ('admin','participante')),
  puesto text not null default '',
  dedicacion_pct numeric(5,2) not null default 100,
  coste_hora numeric(10,2) not null default 0,
  telefono text not null default '',
  notas text not null default '',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.obim_usuarios enable row level security;

create table if not exists public.obim_fichajes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.obim_usuarios (id) on delete cascade,
  fecha date not null default current_date,
  horas numeric(6,2) not null check (horas > 0),
  tarea text not null default '',
  etapa text not null default '',
  coste numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
alter table public.obim_fichajes enable row level security;
create index if not exists obim_fichajes_usuario_idx on public.obim_fichajes (usuario_id);
create index if not exists obim_fichajes_fecha_idx on public.obim_fichajes (fecha);
