-- Trigger functions are invoked by PostgreSQL; API roles do not need direct EXECUTE.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
