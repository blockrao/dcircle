-- Private audit history for changes to canonical place facts.
-- Additive only: this does not change current fact eligibility or public read behavior.
-- Do not apply to production until the migration and rollback-only regression test are reviewed.

CREATE TABLE public.place_fact_history (
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

COMMENT ON TABLE public.place_fact_history IS
  'Private before/after audit records for updates and deletions of canonical place_facts. Never expose through public APIs.';

CREATE INDEX place_fact_history_place_changed_idx
  ON public.place_fact_history (place_id, changed_at DESC);

CREATE INDEX place_fact_history_fact_changed_idx
  ON public.place_fact_history (fact_id, changed_at DESC);

ALTER TABLE public.place_fact_history ENABLE ROW LEVEL SECURITY;

-- No table privileges or RLS policies for API roles, including service_role.
-- The trigger function writes audit rows using its owner privileges.
REVOKE ALL ON TABLE public.place_fact_history FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.capture_place_fact_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD IS DISTINCT FROM NEW THEN
      INSERT INTO public.place_fact_history (
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
    INSERT INTO public.place_fact_history (
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

REVOKE ALL ON FUNCTION public.capture_place_fact_history() FROM PUBLIC, anon, authenticated, service_role;

DROP TRIGGER IF EXISTS place_facts_capture_history ON public.place_facts;
CREATE TRIGGER place_facts_capture_history
  AFTER UPDATE OR DELETE ON public.place_facts
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_place_fact_history();
