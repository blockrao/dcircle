-- Private audit history for changes to canonical place facts.
-- Additive only: this does not change current fact eligibility or public read behavior.
-- Do not apply to production until migration sequencing, SQL review, and regression tests pass.

-- Keep audit objects outside Supabase's exposed public schema.
-- Use a dedicated schema so this migration does not alter grants on an existing private schema.
CREATE SCHEMA dcircle_private;
REVOKE ALL ON SCHEMA dcircle_private FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE dcircle_private.place_fact_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL,
  fact_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_fact jsonb,
  new_fact jsonb,
  changed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  actor_role text,
  actor_subject text,
  change_reason text,
  session_user_name text NOT NULL DEFAULT session_user::text,
  CHECK (
    (operation = 'INSERT' AND old_fact IS NULL AND new_fact IS NOT NULL)
    OR (operation = 'UPDATE' AND old_fact IS NOT NULL AND new_fact IS NOT NULL)
    OR (operation = 'DELETE' AND old_fact IS NOT NULL AND new_fact IS NULL)
  )
);

COMMENT ON TABLE dcircle_private.place_fact_history IS
  'Private before/after audit records for inserts, updates, and deletions of canonical place_facts. Never expose through public APIs.';

CREATE INDEX place_fact_history_place_changed_idx
  ON dcircle_private.place_fact_history (place_id, changed_at DESC);

CREATE INDEX place_fact_history_fact_changed_idx
  ON dcircle_private.place_fact_history (fact_id, changed_at DESC);

ALTER TABLE dcircle_private.place_fact_history ENABLE ROW LEVEL SECURITY;

-- No table privileges or RLS policies for API roles, including service_role.
-- The private trigger function writes audit rows using its owner privileges.
REVOKE ALL ON TABLE dcircle_private.place_fact_history FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION dcircle_private.capture_place_fact_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  old_value jsonb;
  new_value jsonb;
  affected_place_id uuid;
  affected_fact_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    old_value := NULL;
    new_value := to_jsonb(NEW);
    affected_place_id := NEW.place_id;
    affected_fact_id := NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD IS NOT DISTINCT FROM NEW THEN
      RETURN NEW;
    END IF;
    old_value := to_jsonb(OLD);
    new_value := to_jsonb(NEW);
    affected_place_id := NEW.place_id;
    affected_fact_id := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    old_value := to_jsonb(OLD);
    new_value := NULL;
    affected_place_id := OLD.place_id;
    affected_fact_id := OLD.id;
  ELSE
    RETURN NULL;
  END IF;

  INSERT INTO dcircle_private.place_fact_history (
    place_id,
    fact_id,
    operation,
    old_fact,
    new_fact,
    actor_role,
    actor_subject,
    change_reason,
    session_user_name
  )
  VALUES (
    affected_place_id,
    affected_fact_id,
    TG_OP,
    old_value,
    new_value,
    COALESCE(
      NULLIF(current_setting('request.jwt.claim.role', true), ''),
      NULLIF(current_setting('role', true), '')
    ),
    NULLIF(current_setting('request.jwt.claim.sub', true), ''),
    NULLIF(current_setting('app.change_reason', true), ''),
    session_user::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

-- SECURITY DEFINER is required only for the trigger's internal audit write.
-- Keep the function in the non-exposed schema and revoke direct invocation.
REVOKE ALL ON FUNCTION dcircle_private.capture_place_fact_history() FROM PUBLIC, anon, authenticated, service_role;

DROP TRIGGER IF EXISTS place_facts_capture_history ON public.place_facts;
CREATE TRIGGER place_facts_capture_history
  AFTER INSERT OR UPDATE OR DELETE ON public.place_facts
  FOR EACH ROW
  EXECUTE FUNCTION dcircle_private.capture_place_fact_history();
