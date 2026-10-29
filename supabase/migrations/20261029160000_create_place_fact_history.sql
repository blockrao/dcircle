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
  operation text NOT NULL CHECK (operation IN ('UPDATE', 'DELETE')),
  old_fact jsonb NOT NULL,
  new_fact jsonb,
  changed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  actor_role text,
  actor_subject text,
  session_user_name text NOT NULL DEFAULT session_user::text,
  CHECK (
    (operation = 'UPDATE' AND new_fact IS NOT NULL)
    OR (operation = 'DELETE' AND new_fact IS NULL)
  )
);

COMMENT ON TABLE dcircle_private.place_fact_history IS
  'Private before/after audit records for updates and deletions of canonical place_facts. Never expose through public APIs.';

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
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD IS DISTINCT FROM NEW THEN
      INSERT INTO dcircle_private.place_fact_history (
        place_id,
        fact_id,
        operation,
        old_fact,
        new_fact,
        actor_role,
        actor_subject,
        session_user_name
      )
      VALUES (
        OLD.place_id,
        OLD.id,
        'UPDATE',
        to_jsonb(OLD),
        to_jsonb(NEW),
        COALESCE(
          NULLIF(current_setting('request.jwt.claim.role', true), ''),
          NULLIF(current_setting('role', true), '')
        ),
        NULLIF(current_setting('request.jwt.claim.sub', true), ''),
        session_user::text
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO dcircle_private.place_fact_history (
      place_id,
      fact_id,
      operation,
      old_fact,
      new_fact,
      actor_role,
      actor_subject,
      session_user_name
    )
    VALUES (
      OLD.place_id,
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      NULL,
      COALESCE(
        NULLIF(current_setting('request.jwt.claim.role', true), ''),
        NULLIF(current_setting('role', true), '')
      ),
      NULLIF(current_setting('request.jwt.claim.sub', true), ''),
      session_user::text
    );
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$function$;

-- SECURITY DEFINER is required only for the trigger's internal audit write.
-- Keep the function in the non-exposed schema and revoke direct invocation.
REVOKE ALL ON FUNCTION dcircle_private.capture_place_fact_history() FROM PUBLIC, anon, authenticated, service_role;

DROP TRIGGER IF EXISTS place_facts_capture_history ON public.place_facts;
CREATE TRIGGER place_facts_capture_history
  AFTER UPDATE OR DELETE ON public.place_facts
  FOR EACH ROW
  EXECUTE FUNCTION dcircle_private.capture_place_fact_history();
