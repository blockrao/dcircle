DROP TRIGGER IF EXISTS place_categories_preserve_published_place_integrity ON public.place_categories;
CREATE CONSTRAINT TRIGGER place_categories_preserve_published_place_integrity
  AFTER INSERT OR UPDATE OR DELETE ON public.place_categories
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION public.enforce_published_place_category_integrity();

CREATE OR REPLACE FUNCTION public.prevent_deactivating_published_place_category()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  IF OLD.is_active AND NOT NEW.is_active AND EXISTS (
    SELECT 1
    FROM public.place_categories pc
    JOIN public.places p ON p.id = pc.place_id
    WHERE pc.category_id = OLD.id
      AND p.publication_status = 'published'
      AND p.published_at IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'A category linked to a published place cannot be deactivated';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER categories_protect_published_places
  BEFORE UPDATE OF is_active ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.prevent_deactivating_published_place_category();