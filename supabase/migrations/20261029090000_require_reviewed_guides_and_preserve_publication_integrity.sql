-- Tighten guide visibility and prevent published content from losing its required evidence.
-- These are additive integrity guards; no content rows are changed or dropped.

DROP POLICY IF EXISTS public_read_published_guides ON public.guides;
CREATE POLICY public_read_published_guides
  ON public.guides FOR SELECT TO anon, authenticated
  USING (
    publication_status = 'published'
    AND published_at IS NOT NULL
    AND reviewed_at IS NOT NULL
  );

DROP POLICY IF EXISTS public_read_sources_for_published_guides ON public.guide_sources;
CREATE POLICY public_read_sources_for_published_guides
  ON public.guide_sources FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.guides g
      WHERE g.id = guide_sources.guide_id
        AND g.publication_status = 'published'
        AND g.published_at IS NOT NULL
        AND g.reviewed_at IS NOT NULL
    )
  );

DROP POLICY IF EXISTS public_read_places_in_published_guides ON public.guide_places;
CREATE POLICY public_read_places_in_published_guides
  ON public.guide_places FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.guides g
      WHERE g.id = guide_places.guide_id
        AND g.publication_status = 'published'
        AND g.published_at IS NOT NULL
        AND g.reviewed_at IS NOT NULL
    )
    AND EXISTS (
      SELECT 1
      FROM public.places p
      WHERE p.id = guide_places.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
  );

CREATE OR REPLACE FUNCTION public.assert_published_guide_integrity(target_guide_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
DECLARE
  guide_status text;
  guide_published_at timestamptz;
  guide_reviewed_at timestamptz;
BEGIN
  SELECT g.publication_status, g.published_at, g.reviewed_at
    INTO guide_status, guide_published_at, guide_reviewed_at
  FROM public.guides g
  WHERE g.id = target_guide_id;

  IF NOT FOUND OR guide_status <> 'published' THEN
    RETURN;
  END IF;

  IF guide_published_at IS NULL OR guide_reviewed_at IS NULL THEN
    RAISE EXCEPTION 'A published guide requires published_at and reviewed_at';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.guide_sources s WHERE s.guide_id = target_guide_id
  ) THEN
    RAISE EXCEPTION 'A published guide must retain at least one source';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.guide_places gp
    WHERE gp.guide_id = target_guide_id
  ) THEN
    RAISE EXCEPTION 'A published guide must retain at least one place';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.guide_places gp
    JOIN public.places p ON p.id = gp.place_id
    WHERE gp.guide_id = target_guide_id
      AND (p.publication_status <> 'published' OR p.published_at IS NULL)
  ) THEN
    RAISE EXCEPTION 'Every place linked to a published guide must also be published';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enforce_published_guide_relation_integrity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    PERFORM public.assert_published_guide_integrity(OLD.guide_id);
  END IF;

  IF TG_OP <> 'DELETE' THEN
    PERFORM public.assert_published_guide_integrity(NEW.guide_id);
  END IF;

  RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS guide_sources_preserve_published_guide_integrity ON public.guide_sources;
CREATE CONSTRAINT TRIGGER guide_sources_preserve_published_guide_integrity
  AFTER INSERT OR UPDATE OR DELETE ON public.guide_sources
  DEFERRABLE INITIALLY IMMEDIATE
  FOR EACH ROW EXECUTE FUNCTION public.enforce_published_guide_relation_integrity();

DROP TRIGGER IF EXISTS guide_places_preserve_published_guide_integrity ON public.guide_places;
CREATE CONSTRAINT TRIGGER guide_places_preserve_published_guide_integrity
  AFTER INSERT OR UPDATE OR DELETE ON public.guide_places
  DEFERRABLE INITIALLY IMMEDIATE
  FOR EACH ROW EXECUTE FUNCTION public.enforce_published_guide_relation_integrity();

CREATE OR REPLACE FUNCTION public.enforce_published_place_has_current_fact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
DECLARE
  affected_place_id uuid;
  place_status text;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    affected_place_id := OLD.place_id;
    SELECT p.publication_status INTO place_status
    FROM public.places p WHERE p.id = affected_place_id;

    IF place_status = 'published' AND NOT EXISTS (
      SELECT 1
      FROM public.place_facts f
      WHERE f.place_id = affected_place_id
        AND f.verification_status = 'verified'
        AND (f.review_due_at IS NULL OR f.review_due_at >= now())
        AND (
          f.fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
          OR f.review_due_at IS NOT NULL
        )
    ) THEN
      RAISE EXCEPTION 'A published place must retain at least one current verified fact';
    END IF;
  END IF;

  IF TG_OP <> 'DELETE' AND (TG_OP <> 'UPDATE' OR NEW.place_id IS DISTINCT FROM OLD.place_id) THEN
    affected_place_id := NEW.place_id;
    SELECT p.publication_status INTO place_status
    FROM public.places p WHERE p.id = affected_place_id;

    IF place_status = 'published' AND NOT EXISTS (
      SELECT 1
      FROM public.place_facts f
      WHERE f.place_id = affected_place_id
        AND f.verification_status = 'verified'
        AND (f.review_due_at IS NULL OR f.review_due_at >= now())
        AND (
          f.fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
          OR f.review_due_at IS NOT NULL
        )
    ) THEN
      RAISE EXCEPTION 'A published place must retain at least one current verified fact';
    END IF;
  END IF;

  RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS place_facts_preserve_published_place_integrity ON public.place_facts;
CREATE CONSTRAINT TRIGGER place_facts_preserve_published_place_integrity
  AFTER INSERT OR UPDATE OR DELETE ON public.place_facts
  DEFERRABLE INITIALLY IMMEDIATE
  FOR EACH ROW EXECUTE FUNCTION public.enforce_published_place_has_current_fact();

CREATE OR REPLACE FUNCTION public.prevent_unpublishing_place_used_by_published_guide()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF OLD.publication_status = 'published'
    AND (NEW.publication_status <> 'published' OR NEW.published_at IS NULL)
    AND EXISTS (
      SELECT 1
      FROM public.guide_places gp
      JOIN public.guides g ON g.id = gp.guide_id
      WHERE gp.place_id = OLD.id
        AND g.publication_status = 'published'
        AND g.published_at IS NOT NULL
        AND g.reviewed_at IS NOT NULL
    )
  THEN
    RAISE EXCEPTION 'Unpublish linked guides before unpublishing a place used by a published guide';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS places_preserve_published_guide_integrity ON public.places;
CREATE TRIGGER places_preserve_published_guide_integrity
  BEFORE UPDATE OF publication_status, published_at ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unpublishing_place_used_by_published_guide();

-- Remove default public execution from the newly added internal trigger helpers.
REVOKE ALL ON FUNCTION public.assert_published_guide_integrity(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_published_guide_relation_integrity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_published_place_has_current_fact() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_unpublishing_place_used_by_published_guide() FROM PUBLIC, anon, authenticated;
