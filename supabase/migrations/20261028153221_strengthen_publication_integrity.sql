-- Strengthen referential integrity and publication filtering for the first content model.

ALTER TABLE public.place_sources
  ADD CONSTRAINT place_sources_id_place_id_unique UNIQUE (id, place_id);

ALTER TABLE public.place_facts
  DROP CONSTRAINT place_facts_source_id_fkey;

ALTER TABLE public.place_facts
  ADD CONSTRAINT place_facts_source_matches_place_fkey
  FOREIGN KEY (source_id, place_id)
  REFERENCES public.place_sources (id, place_id)
  ON DELETE RESTRICT;

DROP POLICY public_read_published_places ON public.places;
CREATE POLICY public_read_published_places
  ON public.places FOR SELECT TO anon, authenticated
  USING (
    publication_status = 'published'
    AND published_at IS NOT NULL
    AND neighborhood_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.neighborhoods n
      WHERE n.id = places.neighborhood_id
        AND n.publication_status = 'published'
    )
  );

DROP POLICY public_read_sources_for_published_places ON public.place_sources;
CREATE POLICY public_read_sources_for_published_places
  ON public.place_sources FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = place_sources.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
        AND p.neighborhood_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.neighborhoods n
          WHERE n.id = p.neighborhood_id
            AND n.publication_status = 'published'
        )
    )
    AND EXISTS (
      SELECT 1 FROM public.place_facts f
      WHERE f.source_id = place_sources.id
        AND f.place_id = place_sources.place_id
        AND f.verification_status = 'verified'
        AND (f.review_due_at IS NULL OR f.review_due_at >= now())
        AND (
          f.fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
          OR f.review_due_at IS NOT NULL
        )
    )
  );

DROP POLICY public_read_current_verified_place_facts ON public.place_facts;
CREATE POLICY public_read_current_verified_place_facts
  ON public.place_facts FOR SELECT TO anon, authenticated
  USING (
    verification_status = 'verified'
    AND (review_due_at IS NULL OR review_due_at >= now())
    AND (
      fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
      OR review_due_at IS NOT NULL
    )
    AND EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = place_facts.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
        AND p.neighborhood_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.neighborhoods n
          WHERE n.id = p.neighborhood_id
            AND n.publication_status = 'published'
        )
    )
  );

-- Guides must be reviewed before publication; source records and place links are
-- required before a draft can be promoted to published.
CREATE OR REPLACE FUNCTION public.enforce_guide_publication_ready()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF NEW.publication_status = 'published' THEN
    IF NEW.published_at IS NULL OR NEW.reviewed_at IS NULL THEN
      RAISE EXCEPTION 'A guide requires published_at and reviewed_at before publication';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.guide_sources s WHERE s.guide_id = NEW.id) THEN
      RAISE EXCEPTION 'A guide requires at least one source before publication';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.guide_places gp WHERE gp.guide_id = NEW.id) THEN
      RAISE EXCEPTION 'A guide requires at least one place relationship before publication';
    END IF;
    IF EXISTS (
      SELECT 1
      FROM public.guide_places gp
      JOIN public.places p ON p.id = gp.place_id
      WHERE gp.guide_id = NEW.id
        AND (p.publication_status <> 'published' OR p.published_at IS NULL)
    ) THEN
      RAISE EXCEPTION 'All places linked to a published guide must also be published';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER guides_publication_ready
  BEFORE INSERT OR UPDATE OF publication_status, published_at, reviewed_at
  ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.enforce_guide_publication_ready();
