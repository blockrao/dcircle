-- Regression coverage for permanent place slugs, stable identity, and public RLS.
-- Run against a disposable database or with the surrounding transaction intact.
BEGIN;

DO $test$
DECLARE
  target_id uuid;
  original_slug text;
  temporary_slug text;
  alias_count integer;
  rejected_reuse boolean := false;
  deletion_blocked boolean := false;
BEGIN
  SELECT id, slug
    INTO target_id, original_slug
  FROM public.places
  WHERE slug = 'serious-pizza-deep-ellum'
    AND publication_status = 'published'
  LIMIT 1;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'Expected published Serious Pizza fixture was not found';
  END IF;

  temporary_slug := original_slug || '-slug-history-regression';

  UPDATE public.places
  SET slug = temporary_slug
  WHERE id = target_id;

  IF NOT EXISTS (
    SELECT 1 FROM public.place_slug_history
    WHERE old_slug = original_slug AND place_id = target_id
  ) THEN
    RAISE EXCEPTION 'First rename did not preserve the previous slug';
  END IF;

  -- Renaming back reclaims the current slug and preserves the interim alias.
  UPDATE public.places
  SET slug = original_slug
  WHERE id = target_id;

  IF EXISTS (
    SELECT 1 FROM public.place_slug_history
    WHERE old_slug = original_slug
  ) THEN
    RAISE EXCEPTION 'Reclaimed current slug remained in historical aliases';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.place_slug_history
    WHERE old_slug = temporary_slug AND place_id = target_id
  ) THEN
    RAISE EXCEPTION 'Reversion did not preserve the interim slug';
  END IF;

  -- A different place must never be allowed to claim a historical slug.
  BEGIN
    INSERT INTO public.places (slug, name, publication_status)
    VALUES (temporary_slug, 'Slug reuse regression fixture', 'draft');
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    rejected_reuse := true;
  END;

  IF NOT rejected_reuse THEN
    RAISE EXCEPTION 'A new place was allowed to reuse a historical slug';
  END IF;

  -- Deleting the entity must not erase its permanent URL reservation.
  BEGIN
    DELETE FROM public.places WHERE id = target_id;
  EXCEPTION WHEN foreign_key_violation THEN
    deletion_blocked := true;
  END;

  IF NOT deletion_blocked THEN
    RAISE EXCEPTION 'A place with historical slugs was allowed to be deleted';
  END IF;

  SELECT count(*) INTO alias_count
  FROM public.place_slug_history
  WHERE old_slug = temporary_slug AND place_id = target_id;

  IF alias_count <> 1 THEN
    RAISE EXCEPTION 'Historical slug must map to exactly one original place';
  END IF;
END;
$test$;

-- Seed one published alias and one unpublished alias for role-scoped RLS tests.
INSERT INTO public.places (slug, name, publication_status, published_at)
VALUES ('unpublished-rsl-fixture', 'Unpublished RLS fixture', 'draft', NULL);

INSERT INTO public.place_slug_history (old_slug, place_id)
SELECT 'published-rsl-fixture', id
FROM public.places
WHERE slug = 'serious-pizza-deep-ellum';

INSERT INTO public.place_slug_history (old_slug, place_id)
SELECT 'unpublished-rsl-fixture-old', id
FROM public.places
WHERE slug = 'unpublished-rsl-fixture';

-- Anonymous users may read aliases only for published places and cannot write.
SET LOCAL ROLE anon;
DO $anon$
DECLARE
  visible_count integer;
  write_blocked boolean := false;
BEGIN
  SELECT count(*) INTO visible_count
  FROM public.place_slug_history
  WHERE old_slug IN ('published-rsl-fixture', 'unpublished-rsl-fixture-old');

  IF visible_count <> 1 THEN
    RAISE EXCEPTION 'anon must see exactly the published alias; saw %', visible_count;
  END IF;

  BEGIN
    INSERT INTO public.place_slug_history (old_slug, place_id)
    SELECT 'anon-write-must-fail', id
    FROM public.places
    WHERE slug = 'serious-pizza-deep-ellum';
  EXCEPTION WHEN insufficient_privilege THEN
    write_blocked := true;
  END;

  IF NOT write_blocked THEN
    RAISE EXCEPTION 'anon unexpectedly has write access to place_slug_history';
  END IF;
END;
$anon$;
RESET ROLE;

-- Authenticated users receive the same public read boundary and no write access.
SET LOCAL ROLE authenticated;
DO $authenticated$
DECLARE
  visible_count integer;
  write_blocked boolean := false;
BEGIN
  SELECT count(*) INTO visible_count
  FROM public.place_slug_history
  WHERE old_slug IN ('published-rsl-fixture', 'unpublished-rsl-fixture-old');

  IF visible_count <> 1 THEN
    RAISE EXCEPTION 'authenticated must see exactly the published alias; saw %', visible_count;
  END IF;

  BEGIN
    INSERT INTO public.place_slug_history (old_slug, place_id)
    SELECT 'authenticated-write-must-fail', id
    FROM public.places
    WHERE slug = 'serious-pizza-deep-ellum';
  EXCEPTION WHEN insufficient_privilege THEN
    write_blocked := true;
  END;

  IF NOT write_blocked THEN
    RAISE EXCEPTION 'authenticated unexpectedly has write access to place_slug_history';
  END IF;
END;
$authenticated$;
RESET ROLE;

ROLLBACK;
