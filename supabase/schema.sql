-- Portfolio content schema. Run in Supabase SQL Editor as project owner.
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  stack text[] not null default '{}',
  demo_url text,
  repo_url text,
  image_url text,
  details text,
  featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists projects_title_unique on public.projects (lower(title));

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  category text not null default 'Other',
  issued_on date,
  credential_url text,
  credential_id text,
  file_url text,
  is_published boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists certificates_title_issuer_unique on public.certificates (lower(title), lower(issuer));

create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ 
begin 
  new.updated_at = now(); 
  return new; 
end; 
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists certificates_updated_at on public.certificates;
create trigger certificates_updated_at before update on public.certificates for each row execute function public.set_updated_at();

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Public reads published projects" on public.projects;
create policy "Public reads published projects" on public.projects for select to anon, authenticated using (is_published = true);

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects for all to authenticated 
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') 
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public reads published certificates" on public.certificates;
create policy "Public reads published certificates" on public.certificates for select to anon, authenticated using (is_published = true);

drop policy if exists "Admins manage certificates" on public.certificates;
create policy "Admins manage certificates" on public.certificates for all to authenticated 
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') 
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public reads site content" on public.site_content;
create policy "Public reads site content" on public.site_content for select to anon, authenticated using (true);

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content" on public.site_content for all to authenticated 
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') 
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Public bucket for portfolio certificate images/PDFs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-certificates','portfolio-certificates',true,10485760,array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 10485760, allowed_mime_types = array['application/pdf','image/png','image/jpeg','image/webp'];

drop policy if exists "Public reads portfolio certificates" on storage.objects;
create policy "Public reads portfolio certificates" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-certificates');

drop policy if exists "Admins upload portfolio certificates" on storage.objects;
create policy "Admins upload portfolio certificates" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-certificates' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins update portfolio certificates" on storage.objects;
create policy "Admins update portfolio certificates" on storage.objects for update to authenticated using (bucket_id = 'portfolio-certificates' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check (bucket_id = 'portfolio-certificates' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins delete portfolio certificates" on storage.objects;
create policy "Admins delete portfolio certificates" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-certificates' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
