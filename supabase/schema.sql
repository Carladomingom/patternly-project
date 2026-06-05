
create extension if not exists "uuid-ossp";


// Tabla de perfiles de usuario, vinculada a auth.users. Se crea automáticamente al registrarse.

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique,
  email         text not null unique,
  avatar_url    text,
  created_at    timestamptz not null default now()
);

// ── RLS profiles ────────────────────────────────────────────
alter table public.profiles enable row level security;

// Cualquiera puede leer los perfiles (para mostrar nombres/avatares), pero no emails ni datos sensibles
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

// Solo el propio usuario puede actualizar su perfil (username, avatar_url)
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

// Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

// Tabla de patrones de jersey, vinculada a perfiles. Cada patrón tiene configuraciones específicas y puede ser público o privado.
create table public.patterns (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles (id) on delete cascade,

// Configuración del jersey
  title         text not null,
  size          text not null check (size in ('s', 'm', 'l')),
  neck          text not null check (neck in ('redondo', 'pico', 'alto')),
  sleeves       text not null check (sleeves in ('anchas', 'ajustadas', 'rectas')),
  stitch        text not null check (stitch in ('punto_bajo', 'punto_alto', 'relieve')),
  yarn_weight   text not null check (yarn_weight in ('fino', 'medio', 'grueso')),
  fit           text not null check (fit in ('ajustado', 'normal', 'oversize')),

// Visibilidad
  is_public     boolean not null default false,

// SVG identificador (nombre del archivo svg, e.j: "s_redondo_anchas")
  svg_key       text not null,

// Materiales y pasos de confección, almacenados como JSONB para flexibilidad
  materials     jsonb not null default '[]',   -- [{ name, quantity, unit }]
  steps         jsonb not null default '[]',   -- [{ order, description }]

// Contador de "me gusta" para patrones públicos
  likes_count   integer not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

// ── RLS patterns ───────────────────────────────────────────
alter table public.patterns enable row level security;

// Leer: patrones públicos o propios
create policy "patterns_select"
  on public.patterns for select
  using (
    is_public = true
    or auth.uid() = user_id
  );

// Insertar: solo usuarios autenticados y propios
create policy "patterns_insert"
  on public.patterns for insert
  with check (auth.uid() = user_id);

// Actualizar: solo el propietario
create policy "patterns_update"
  on public.patterns for update
  using (auth.uid() = user_id);

// Eliminar: solo el propietario
create policy "patterns_delete"
  on public.patterns for delete
  using (auth.uid() = user_id);

// Trigger: updated_at automático 
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger patterns_updated_at
  before update on public.patterns
  for each row execute procedure public.handle_updated_at();

// Tabla de favoritos, relaciona usuarios con patrones que han marcado como favoritos. Un usuario puede marcar un patrón como favorito solo una vez.
create table public.favorites (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  pattern_id    uuid not null references public.patterns (id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (user_id, pattern_id)
);

// ── RLS favorites ───────────────────────────────────────────
alter table public.favorites enable row level security;

// Solo el propio usuario puede ver, agregar o quitar sus favoritos
create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

// Tabla de suscriptores al newsletter, solo con email. No vinculada a perfiles, ya que pueden suscribirse sin registrarse.
create table public.newsletter_subscribers (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null unique,
  created_at    timestamptz not null default now()
);

// ── RLS newsletter_subscribers ───────────────────────────
alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_insert_anon"
  on public.newsletter_subscribers for insert
  with check (true);

// Función para alternar el estado de favorito de un patrón para el usuario autenticado. Si el patrón ya es favorito, lo quita; si no lo es, lo agrega. También actualiza el contador de "me gusta" en la tabla de patrones.
create or replace function public.toggle_favorite(p_pattern_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
  v_exists  boolean;
begin
  select exists (
    select 1 from public.favorites
    where user_id = v_user_id and pattern_id = p_pattern_id
  ) into v_exists;

  if v_exists then
    delete from public.favorites
      where user_id = v_user_id and pattern_id = p_pattern_id;
    update public.patterns
      set likes_count = greatest(likes_count - 1, 0)
      where id = p_pattern_id;
    return false;  -- ya no es favorito
  else
    insert into public.favorites (user_id, pattern_id)
      values (v_user_id, p_pattern_id);
    update public.patterns
      set likes_count = likes_count + 1
      where id = p_pattern_id;
    return true;   -- ahora es favorito
  end if;
end;
$$;

// Función para obtener patrones públicos aleatorios, limitada por un parámetro opcional (por defecto 3). Útil para mostrar patrones destacados en la página principal.
create or replace function public.get_random_public_patterns(p_limit integer default 3)
returns setof public.patterns language sql stable as $$
  select * from public.patterns
  where is_public = true
  order by random()
  limit p_limit;
$$;
