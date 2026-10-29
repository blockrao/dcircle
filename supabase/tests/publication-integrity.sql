-- Rollback-only regression checks for the canonical publication contract.
-- Run against a non-production Supabase project or the live project only when
-- authorized. This script inserts uniquely named test records and rolls back.
-- It raises an exception on failure and leaves no test rows on success.

BEGIN;

DO $test$
DECLARE
  test_suffix text := replace(gen_random_uuid()::text, '-', '');
  test_neighborhood_id uuid;
  test_category_id uuid;
  test_place_id uuid;
  test_source_id uuid;
  test_fact_id uuid;
  test_guide_id uuid;
  test_guide_source_id uuid;
  expected_failure boolean;
BEGIN
  -- Public read-only access and private editorial fields must remain restricted.
  IF has_table_privilege('anon', 'public.places', 'INSERT')
    OR has_table_privilege('anon', 'public.places', 'UPDATE')
    OR has_table_privilege('anon', 'public.places', 'DELETE')
  THEN
    RAISE EXCEPTION 'Anonymous users must not be able to write place records';
  END IF;

  IF has_column_privilege('anon', 'public.place_sources', 'internal_notes', 'SELECT')
    OR has_column_privilege('anon', 'public.place_facts', 'internal_notes', 'SELECT')
    OR has_column_privilege('anon', 'public.guide_sources', 'internal_notes', 'SELECT')
  THEN
    RAISE EXCEPTION 'Internal editorial notes must not be readable by anonymous users';
  END IF;

  SELECT id INTO test_neighborhood_id
  FROM public.neighborhoods WHERE slug = 'deep-ellum' LIMIT 1;
  SELECT id INTO test_category_id
  FROM public.categories WHERE slug = 'restaurant' AND is_active LIMIT 1;
  IF test_neighborhood_id IS NULL OR test_category_id IS NULL THEN
    RAISE EXCEPTION 'Required Deep Ellum test fixtures are missing';
  END IF;

  INSERT INTO public.places
    (slug, name, summary, address_line1, city, region, postal_code, neighborhood_id, publication_status)
  VALUES
    ('integrity-test-' || test_suffix, 'Integrity test place', 'Rollback-only test record', '100 Test Street', 'Dallas', 'TX', '75226', test_neighborhood_id, 'draft')
  RETURNING id INTO test_place_id;

  expected_failure := false;
  BEGIN
    UPDATE public.places
    SET publication_status = 'published', published_at = now()
    WHERE id = test_place_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%requires at least one source%' THEN
      expected_failure := true;
    ELSE
      RAISE;
    END IF;
  END;
  IF NOT expected_failure THEN
    RAISE EXCEPTION 'Place publication unexpectedly succeeded without a source';
  END IF;

  INSERT INTO public.place_sources (place_id, source_url, source_type, publisher_name)
  VALUES (test_place_id, 'https://example.com/integrity-test-' || test_suffix, 'official_website', 'Integrity test')
  RETURNING id INTO test_source_id;

  INSERT INTO public.place_facts
    (place_id, source_id, fact_key, fact_value, verification_status, checked_at, review_due_at)
  VALUES
    (test_place_id, test_source_id, 'test_fact', '"verified test fact"'::jsonb, 'verified', now(), now() + interval '1 day')
  RETURNING id INTO test_fact_id;

  INSERT INTO public.place_categories (place_id, category_id, is_primary)
  VALUES (test_place_id, test_category_id, true);

  UPDATE public.places
  SET publication_status = 'published', published_at = now()
  WHERE id = test_place_id;

  expected_failure := false;
  BEGIN
    DELETE FROM public.place_facts WHERE id = test_fact_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%must retain at least one current verified fact%' THEN
      expected_failure := true;
    ELSE
      RAISE;
    END IF;
  END;
  IF NOT expected_failure THEN
    RAISE EXCEPTION 'Deleting the last current fact unexpectedly succeeded';
  END IF;

  INSERT INTO public.guides
    (slug, title, summary, body, author_name, publication_status)
  VALUES
    ('integrity-test-guide-' || test_suffix, 'Integrity test guide', 'Rollback-only test guide', 'Test body', 'Test', 'draft')
  RETURNING id INTO test_guide_id;

  INSERT INTO public.guide_sources (guide_id, source_url, source_type, publisher_name)
  VALUES (test_guide_id, 'https://example.com/integrity-test-guide-' || test_suffix, 'official_website', 'Integrity test')
  RETURNING id INTO test_guide_source_id;

  INSERT INTO public.guide_places (guide_id, place_id, position, editorial_rationale)
  VALUES (test_guide_id, test_place_id, 1, 'Rollback-only integrity test');

  UPDATE public.guides
  SET publication_status = 'published', published_at = now(), reviewed_at = now()
  WHERE id = test_guide_id;

  expected_failure := false;
  BEGIN
    DELETE FROM public.guide_sources WHERE id = test_guide_source_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%must retain at least one source%' THEN
      expected_failure := true;
    ELSE
      RAISE;
    END IF;
  END;
  IF NOT expected_failure THEN
    RAISE EXCEPTION 'Deleting the last guide source unexpectedly succeeded';
  END IF;

  expected_failure := false;
  BEGIN
    DELETE FROM public.guide_places
    WHERE guide_id = test_guide_id AND place_id = test_place_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%must retain at least one place%' THEN
      expected_failure := true;
    ELSE
      RAISE;
    END IF;
  END;
  IF NOT expected_failure THEN
    RAISE EXCEPTION 'Deleting the last guide place unexpectedly succeeded';
  END IF;

  expected_failure := false;
  BEGIN
    UPDATE public.places
    SET publication_status = 'draft', published_at = NULL
    WHERE id = test_place_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Unpublish linked guides before unpublishing a place%' THEN
      expected_failure := true;
    ELSE
      RAISE;
    END IF;
  END;
  IF NOT expected_failure THEN
    RAISE EXCEPTION 'Unpublishing a place used by a published guide unexpectedly succeeded';
  END IF;

  RAISE NOTICE 'Publication integrity regression checks passed; test records will be rolled back.';
END;
$test$;

ROLLBACK;
