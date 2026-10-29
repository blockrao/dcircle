-- Rollback-only regression tests for private place-fact audit history.
-- Run against a non-production Supabase project, or live only when authorized.
-- Creates uniquely named test rows and rolls everything back on success.

BEGIN;

DO $test$
DECLARE
  test_suffix text := replace(gen_random_uuid()::text, '-', '');
  test_category_id uuid;
  test_place_id uuid;
  test_source_id uuid;
  test_fact_id uuid;
  history_count integer;
  history_row dcircle_private.place_fact_history%ROWTYPE;
BEGIN
  IF has_schema_privilege('anon', 'dcircle_private', 'USAGE')
    OR has_schema_privilege('authenticated', 'dcircle_private', 'USAGE')
    OR has_schema_privilege('service_role', 'dcircle_private', 'USAGE')
  THEN
    RAISE EXCEPTION 'Public API roles must not have usage on the private audit schema';
  END IF;

  IF has_table_privilege('anon', 'dcircle_private.place_fact_history', 'SELECT')
    OR has_table_privilege('anon', 'dcircle_private.place_fact_history', 'INSERT')
    OR has_table_privilege('anon', 'dcircle_private.place_fact_history', 'UPDATE')
    OR has_table_privilege('anon', 'dcircle_private.place_fact_history', 'DELETE')
    OR has_table_privilege('authenticated', 'dcircle_private.place_fact_history', 'SELECT')
    OR has_table_privilege('authenticated', 'dcircle_private.place_fact_history', 'INSERT')
    OR has_table_privilege('authenticated', 'dcircle_private.place_fact_history', 'UPDATE')
    OR has_table_privilege('authenticated', 'dcircle_private.place_fact_history', 'DELETE')
    OR has_table_privilege('service_role', 'dcircle_private.place_fact_history', 'SELECT')
    OR has_table_privilege('service_role', 'dcircle_private.place_fact_history', 'INSERT')
    OR has_table_privilege('service_role', 'dcircle_private.place_fact_history', 'UPDATE')
    OR has_table_privilege('service_role', 'dcircle_private.place_fact_history', 'DELETE')
  THEN
    RAISE EXCEPTION 'Public API roles must not have direct access to place_fact_history';
  END IF;

  IF has_function_privilege('anon', 'dcircle_private.capture_place_fact_history()', 'EXECUTE')
    OR has_function_privilege('authenticated', 'dcircle_private.capture_place_fact_history()', 'EXECUTE')
    OR has_function_privilege('service_role', 'dcircle_private.capture_place_fact_history()', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'API roles must not be able to execute the history trigger function directly';
  END IF;

  SELECT id INTO test_category_id
  FROM public.categories
  WHERE slug = 'other' AND is_active
  LIMIT 1;

  IF test_category_id IS NULL THEN
    RAISE EXCEPTION 'Required active category fixture is missing';
  END IF;

  INSERT INTO public.places (slug, name, city, region, publication_status)
  VALUES ('fact-history-test-' || test_suffix, 'Fact history test place', 'Dallas', 'TX', 'draft')
  RETURNING id INTO test_place_id;

  INSERT INTO public.place_categories (place_id, category_id, is_primary)
  VALUES (test_place_id, test_category_id, true);

  INSERT INTO public.place_sources (place_id, source_url, source_type, publisher_name)
  VALUES (
    test_place_id,
    'https://example.com/fact-history-test-' || test_suffix,
    'official_website',
    'Fact history regression test'
  )
  RETURNING id INTO test_source_id;

  INSERT INTO public.place_facts
    (place_id, source_id, fact_key, fact_value, verification_status, checked_at)
  VALUES
    (test_place_id, test_source_id, 'test_fact', '"before"'::jsonb, 'unverified', now())
  RETURNING id INTO test_fact_id;

  SELECT count(*) INTO history_count
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'INSERT';

  IF history_count <> 1 THEN
    RAISE EXCEPTION 'Expected one insert history record, got %', history_count;
  END IF;

  SELECT * INTO history_row
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'INSERT'
  ORDER BY changed_at DESC
  LIMIT 1;

  IF history_row.old_fact IS NOT NULL
    OR history_row.new_fact -> 'fact_value' IS DISTINCT FROM '"before"'::jsonb
  THEN
    RAISE EXCEPTION 'Insert history did not preserve the initial fact value';
  END IF;

  UPDATE public.place_facts
  SET fact_value = '"after"'::jsonb,
      verification_status = 'verified',
      checked_at = now()
  WHERE id = test_fact_id;

  SELECT count(*) INTO history_count
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'UPDATE';

  IF history_count <> 1 THEN
    RAISE EXCEPTION 'Expected one update history record, got %', history_count;
  END IF;

  SELECT * INTO history_row
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'UPDATE'
  ORDER BY changed_at DESC
  LIMIT 1;

  IF history_row.old_fact -> 'fact_value' IS DISTINCT FROM '"before"'::jsonb
    OR history_row.new_fact -> 'fact_value' IS DISTINCT FROM '"after"'::jsonb
    OR history_row.old_fact ->> 'verification_status' IS DISTINCT FROM 'unverified'
    OR history_row.new_fact ->> 'verification_status' IS DISTINCT FROM 'verified'
  THEN
    RAISE EXCEPTION 'Update history did not preserve expected before/after values';
  END IF;

  DELETE FROM public.place_facts WHERE id = test_fact_id;

  SELECT count(*) INTO history_count
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'DELETE';

  IF history_count <> 1 THEN
    RAISE EXCEPTION 'Expected one delete history record, got %', history_count;
  END IF;

  SELECT * INTO history_row
  FROM dcircle_private.place_fact_history
  WHERE fact_id = test_fact_id AND operation = 'DELETE'
  ORDER BY changed_at DESC
  LIMIT 1;

  IF history_row.old_fact -> 'fact_value' IS DISTINCT FROM '"after"'::jsonb
    OR history_row.new_fact IS NOT NULL
  THEN
    RAISE EXCEPTION 'Delete history did not preserve the last fact value';
  END IF;

  RAISE NOTICE 'Place fact history regression checks passed; all test rows will be rolled back.';
END;
$test$;

ROLLBACK;
