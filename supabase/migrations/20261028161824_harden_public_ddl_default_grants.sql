-- Harden future public-schema DDL even when the creator's default ACL is broader.
-- The current postgres connection cannot alter the superuser-owned supabase_admin
-- default ACL directly. Make the existing DDL event trigger execute as the DDL
-- creator, who owns the newly created object, and fail closed if hardening fails.
-- Explicit public SELECT grants in reviewed migrations are applied after CREATE.

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO pg_catalog
AS $function$
DECLARE
  cmd record;
  object_name name;
  function_args text;
  function_kind "char";
  object_keyword text;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.schema_name IS DISTINCT FROM 'public' THEN
      CONTINUE;
    END IF;

    IF cmd.object_type IN ('table', 'partitioned table')
       AND cmd.command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO') THEN
      SELECT c.relname INTO object_name
      FROM pg_catalog.pg_class c
      WHERE c.oid = cmd.objid;

      IF object_name IS NOT NULL THEN
        EXECUTE format(
          'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
          cmd.schema_name, object_name
        );
        EXECUTE format(
          'REVOKE ALL PRIVILEGES ON TABLE %I.%I FROM PUBLIC, anon, authenticated',
          cmd.schema_name, object_name
        );
      END IF;

    ELSIF cmd.object_type IN ('view', 'materialized view', 'foreign table')
       AND cmd.command_tag IN ('CREATE VIEW', 'CREATE MATERIALIZED VIEW', 'CREATE FOREIGN TABLE') THEN
      SELECT c.relname INTO object_name
      FROM pg_catalog.pg_class c
      WHERE c.oid = cmd.objid;

      IF object_name IS NOT NULL THEN
        EXECUTE format(
          'REVOKE ALL PRIVILEGES ON TABLE %I.%I FROM PUBLIC, anon, authenticated',
          cmd.schema_name, object_name
        );
      END IF;

    ELSIF cmd.object_type = 'sequence' THEN
      SELECT c.relname INTO object_name
      FROM pg_catalog.pg_class c
      WHERE c.oid = cmd.objid;

      IF object_name IS NOT NULL THEN
        EXECUTE format(
          'REVOKE ALL PRIVILEGES ON SEQUENCE %I.%I FROM PUBLIC, anon, authenticated',
          cmd.schema_name, object_name
        );
      END IF;

    ELSIF cmd.object_type IN ('function', 'procedure')
       AND cmd.command_tag IN ('CREATE FUNCTION', 'CREATE PROCEDURE') THEN
      SELECT p.proname,
             pg_catalog.pg_get_function_identity_arguments(p.oid),
             p.prokind
      INTO object_name, function_args, function_kind
      FROM pg_catalog.pg_proc p
      WHERE p.oid = cmd.objid;

      IF object_name IS NOT NULL THEN
        object_keyword := CASE WHEN function_kind = 'p' THEN 'PROCEDURE' ELSE 'FUNCTION' END;
        EXECUTE format(
          'REVOKE ALL PRIVILEGES ON %s %I.%I(%s) FROM PUBLIC, anon, authenticated',
          object_keyword, cmd.schema_name, object_name, function_args
        );
      END IF;
    END IF;
  END LOOP;
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
