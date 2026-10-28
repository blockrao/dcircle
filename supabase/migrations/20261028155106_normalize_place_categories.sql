-- Normalize place categories before editorial inventory is populated.
-- Preserve any existing category assignments, then remove the single-category source of truth.

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 100 CHECK (sort_order >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.place_categories (
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (place_id, category_id)
);

CREATE UNIQUE INDEX place_categories_one_primary_per_place_idx
  ON public.place_categories (place_id)
  WHERE is_primary;

CREATE INDEX place_categories_category_place_idx
  ON public.place_categories (category_id, place_id);

INSERT INTO public.categories (slug, name, sort_order)
VALUES
  ('restaurant', 'Restaurants', 10),
  ('bar', 'Bars', 20),
  ('cafe', 'Cafes', 30),
  ('live-music', 'Live music', 40),
  ('entertainment', 'Entertainment', 50),
  ('attraction', 'Attractions', 60),
  ('other', 'Other places', 100)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, true
FROM public.places p
JOIN public.categories c ON c.slug = replace(p.category, '_', '-')
ON CONFLICT (place_id, category_id) DO NOTHING;

DROP INDEX IF EXISTS public.places_publication_category_idx;
ALTER TABLE public.places DROP CONSTRAINT IF EXISTS places_category_check;
ALTER TABLE public.places DROP COLUMN category;

CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_categories_with_published_places
  ON public.categories FOR SELECT TO anon, authenticated
  USING (
    is_active
    AND EXISTS (
      SELECT 1
      FROM public.place_categories pc
      JOIN public.places p ON p.id = pc.place_id
      WHERE pc.category_id = categories.id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
  );

CREATE POLICY public_read_categories_for_published_places
  ON public.place_categories FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.places p
      JOIN public.neighborhoods n ON n.id = p.neighborhood_id
      JOIN public.categories c ON c.id = place_categories.category_id
      WHERE p.id = place_categories.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
        AND n.publication_status = 'published'
        AND c.is_active
    )
  );

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT (place_id, category_id, is_primary, created_at)
  ON public.place_categories TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.enforce_place_publication_ready()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF NEW.publication_status = 'published' THEN
    IF NEW.published_at IS NULL THEN
      RAISE EXCEPTION 'A place requires published_at before publication';
    END IF;
    IF nullif(btrim(NEW.address_line1), '') IS NULL THEN
      RAISE EXCEPTION 'A place requires a verified address before publication';
    END IF;
    IF NEW.neighborhood_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.neighborhoods n
      WHERE n.id = NEW.neighborhood_id
        AND n.publication_status = 'published'
    ) THEN
      RAISE EXCEPTION 'A place must belong to a published neighborhood before publication';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.place_sources s
      WHERE s.place_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'A place requires at least one source before publication';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.place_facts f
      WHERE f.place_id = NEW.id
        AND f.verification_status = 'verified'
        AND (f.review_due_at IS NULL OR f.review_due_at >= now())
        AND (
          f.fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
          OR f.review_due_at IS NOT NULL
        )
    ) THEN
      RAISE EXCEPTION 'A place requires at least one current verified fact before publication';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.place_categories pc
      JOIN public.categories c ON c.id = pc.category_id
      WHERE pc.place_id = NEW.id
        AND pc.is_primary
        AND c.is_active
    ) THEN
      RAISE EXCEPTION 'A place requires one active primary category before publication';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enforce_published_place_category_integrity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
DECLARE
  affected_place_id uuid;
  is_published boolean;
  category_count integer;
  primary_count integer;
BEGIN
  affected_place_id := COALESCE(NEW.place_id, OLD.place_id);
  SELECT p.publication_status = 'published'
    INTO is_published
  FROM public.places p
  WHERE p.id = affected_place_id;

  IF COALESCE(is_published, false) THEN
    SELECT count(*)::integer, count(*) FILTER (WHERE pc.is_primary)::integer
      INTO category_count, primary_count
    FROM public.place_categories pc
    JOIN public.categories c ON c.id = pc.category_id AND c.is_active
    WHERE pc.place_id = affected_place_id;

    IF category_count = 0 OR primary_count <> 1 THEN
      RAISE EXCEPTION 'A published place must have at least one active category and exactly one primary category';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE TRIGGER place_categories_preserve_published_place_integrity
  AFTER INSERT OR UPDATE OR DELETE ON public.place_categories
  FOR EACH ROW EXECUTE FUNCTION public.enforce_published_place_category_integrity();
