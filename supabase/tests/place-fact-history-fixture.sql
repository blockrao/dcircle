-- Minimal PostgreSQL fixture for executing the place-fact-history migration and rollback-only test.
-- This is intentionally an isolated CI schema, not a replacement for validation against the full Supabase schema.

CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN;

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true
);

INSERT INTO public.categories (slug, is_active) VALUES ('other', true);

CREATE TABLE public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL,
  region text NOT NULL,
  publication_status text NOT NULL CHECK (publication_status IN ('draft', 'published', 'archived'))
);

CREATE TABLE public.place_categories (
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id),
  is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (place_id, category_id)
);

CREATE TABLE public.place_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  source_url text NOT NULL,
  source_type text NOT NULL,
  publisher_name text NOT NULL
);

CREATE TABLE public.place_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.place_sources(id),
  fact_key text NOT NULL CHECK (fact_key ~ '^[a-z][a-z0-9_]*$'),
  fact_value jsonb NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('verified', 'unverified', 'conflicting', 'stale')),
  checked_at timestamptz,
  review_due_at timestamptz
);
