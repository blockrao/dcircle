-- Enforce source-backed publication and require review dates for volatile verified facts.

ALTER TABLE public.place_facts
  ADD CONSTRAINT verified_volatile_facts_require_review_due
  CHECK (
    verification_status <> 'verified'
    OR fact_key NOT IN ('opening_hours', 'kitchen_hours', 'special_hours', 'price_range', 'menu_item', 'booking_url', 'reservation_url', 'event_date')
    OR review_due_at IS NOT NULL
  );

ALTER TABLE public.guide_places
  ADD CONSTRAINT guide_places_rationale_not_blank
  CHECK (nullif(btrim(editorial_rationale), '') IS NOT NULL);

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
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER places_publication_ready
  BEFORE INSERT OR UPDATE OF publication_status, published_at, neighborhood_id, address_line1
  ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.enforce_place_publication_ready();
