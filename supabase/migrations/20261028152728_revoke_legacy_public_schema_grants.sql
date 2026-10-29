-- Lock down the current public-schema surface before rebuilding the DallasCircle data API.
-- RLS is enabled but no policies exist; public grants are unnecessary until a reviewed
-- publication-gated read/write contract is implemented.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
