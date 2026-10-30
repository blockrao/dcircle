-- Preserve permanent place-profile URLs when editorial slugs change.
-- Public users can resolve historical slugs only for currently published places.

CREATE TABLE public.place_slug_history (
  old_slug text PRIMARY KEY
    CHECK (old_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX place_slug_history_place_id_idx
  ON public.place_slug_history (place_id);

ALTER TABLE public.place_slug_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_slug_history_for_published_places
  ON public.place_slug_history FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.places p
      WHERE p.id = place_slug_history.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
  );

GRANT SELECT (old_slug, place_id)
  ON public.place_slug_history TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_place_slug_history()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    IF EXISTS (
      SELECT 1
      FROM public.place_slug_history h
      WHERE h.old_slug = NEW.slug
        AND h.place_id <> OLD.id
    ) THEN
      RAISE EXCEPTION 'The requested place slug is reserved by another place history record';
    END IF;

    -- Reclaim a previous slug when the same place is deliberately renamed back.
    DELETE FROM public.place_slug_history
    WHERE old_slug = NEW.slug
      AND place_id = OLD.id;

    INSERT INTO public.place_slug_history (old_slug, place_id)
    VALUES (OLD.slug, OLD.id)
    ON CONFLICT (old_slug) DO NOTHING;

    IF NOT EXISTS (
      SELECT 1
      FROM public.place_slug_history h
      WHERE h.old_slug = OLD.slug
        AND h.place_id = OLD.id
    ) THEN
      RAISE EXCEPTION 'Unable to preserve the previous canonical place slug';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER places_record_slug_history
  BEFORE UPDATE OF slug ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.record_place_slug_history();

REVOKE ALL ON FUNCTION public.record_place_slug_history()
  FROM PUBLIC, anon, authenticated;
