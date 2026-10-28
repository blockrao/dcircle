-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default.
-- Revoke this globally for objects created by postgres; trigger functions are not public RPCs.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
