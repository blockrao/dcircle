-- Canonical, source-backed local-discovery schema for DallasCircle.
-- This is additive: legacy empty tables are retained until their retirement is reviewed.

CREATE TABLE public.neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Dallas' CHECK (city = 'Dallas'),
  region text NOT NULL DEFAULT 'TX' CHECK (region = 'TX'),
  country text NOT NULL DEFAULT 'USA' CHECK (country = 'USA'),
  description text,
  publication_status text NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'published', 'hidden', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL,
  category text NOT NULL
    CHECK (category IN ('restaurant', 'bar', 'cafe', 'live_music', 'entertainment', 'attraction', 'other')),
  summary text,
  website_url text CHECK (website_url IS NULL OR website_url ~ '^https?://'),
  phone text,
  address_line1 text,
  address_line2 text,
  city text NOT NULL DEFAULT 'Dallas' CHECK (city = 'Dallas'),
  region text NOT NULL DEFAULT 'TX' CHECK (region = 'TX'),
  postal_code text,
  latitude double precision CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  longitude double precision CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE RESTRICT,
  price_level smallint CHECK (price_level IS NULL OR price_level BETWEEN 1 AND 4),
  publication_status text NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'needs_review', 'published', 'hidden', 'duplicate', 'closed', 'archived')),
  published_at timestamptz,
  last_editorial_review_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (publication_status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  author_name text NOT NULL,
  publication_status text NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'needs_review', 'published', 'hidden', 'archived')),
  published_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (publication_status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE public.place_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  source_url text NOT NULL CHECK (source_url ~ '^https?://'),
  source_type text NOT NULL
    CHECK (source_type IN ('official_website', 'official_menu', 'official_venue', 'direct_business_contact', 'government_or_public_agency', 'other_reliable_public_source')),
  publisher_name text,
  accessed_at timestamptz NOT NULL DEFAULT now(),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (place_id, source_url)
);

CREATE TABLE public.place_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.place_sources(id) ON DELETE RESTRICT,
  fact_key text NOT NULL CHECK (fact_key ~ '^[a-z][a-z0-9_]*$'),
  fact_value jsonb NOT NULL,
  verification_status text NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('verified', 'unverified', 'conflicting', 'stale')),
  checked_at timestamptz NOT NULL DEFAULT now(),
  review_due_at timestamptz,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (place_id, fact_key, source_id)
);

CREATE TABLE public.guide_places (
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position > 0),
  editorial_rationale text NOT NULL,
  is_sponsored boolean NOT NULL DEFAULT false,
  sponsorship_disclosure text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (guide_id, place_id),
  UNIQUE (guide_id, position),
  CHECK (NOT is_sponsored OR nullif(btrim(sponsorship_disclosure), '') IS NOT NULL)
);

CREATE TABLE public.guide_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  source_url text NOT NULL CHECK (source_url ~ '^https?://'),
  source_type text NOT NULL
    CHECK (source_type IN ('official_website', 'official_menu', 'official_venue', 'direct_business_contact', 'government_or_public_agency', 'other_reliable_public_source')),
  publisher_name text,
  accessed_at timestamptz NOT NULL DEFAULT now(),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guide_id, source_url)
);

CREATE INDEX places_publication_neighborhood_idx
  ON public.places (publication_status, neighborhood_id);
CREATE INDEX places_publication_category_idx
  ON public.places (publication_status, category);
CREATE INDEX place_sources_place_id_idx
  ON public.place_sources (place_id);
CREATE INDEX place_facts_public_lookup_idx
  ON public.place_facts (place_id, fact_key, verification_status);
CREATE INDEX place_facts_source_id_idx
  ON public.place_facts (source_id);
CREATE INDEX guides_publication_idx
  ON public.guides (publication_status, published_at DESC);
CREATE INDEX guide_places_place_id_idx
  ON public.guide_places (place_id);
CREATE INDEX guide_sources_guide_id_idx
  ON public.guide_sources (guide_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER neighborhoods_set_updated_at
  BEFORE UPDATE ON public.neighborhoods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER places_set_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER guides_set_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER place_facts_set_updated_at
  BEFORE UPDATE ON public.place_facts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER guide_places_set_updated_at
  BEFORE UPDATE ON public.guide_places
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_published_neighborhoods
  ON public.neighborhoods FOR SELECT TO anon, authenticated
  USING (publication_status = 'published');

CREATE POLICY public_read_published_places
  ON public.places FOR SELECT TO anon, authenticated
  USING (publication_status = 'published' AND published_at IS NOT NULL);

CREATE POLICY public_read_published_guides
  ON public.guides FOR SELECT TO anon, authenticated
  USING (publication_status = 'published' AND published_at IS NOT NULL);

CREATE POLICY public_read_sources_for_published_places
  ON public.place_sources FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = place_sources.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
    AND EXISTS (
      SELECT 1 FROM public.place_facts f
      WHERE f.source_id = place_sources.id
        AND f.place_id = place_sources.place_id
        AND f.verification_status = 'verified'
        AND (f.review_due_at IS NULL OR f.review_due_at >= now())
    )
  );

CREATE POLICY public_read_current_verified_place_facts
  ON public.place_facts FOR SELECT TO anon, authenticated
  USING (
    verification_status = 'verified'
    AND (review_due_at IS NULL OR review_due_at >= now())
    AND EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = place_facts.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
  );

CREATE POLICY public_read_places_in_published_guides
  ON public.guide_places FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_places.guide_id
        AND g.publication_status = 'published'
        AND g.published_at IS NOT NULL
    )
    AND EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = guide_places.place_id
        AND p.publication_status = 'published'
        AND p.published_at IS NOT NULL
    )
  );

CREATE POLICY public_read_sources_for_published_guides
  ON public.guide_sources FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_sources.guide_id
        AND g.publication_status = 'published'
        AND g.published_at IS NOT NULL
    )
  );

-- Grant only public reads. Internal notes and all writes remain unavailable to API roles.
GRANT SELECT ON public.neighborhoods TO anon, authenticated;
GRANT SELECT ON public.places TO anon, authenticated;
GRANT SELECT ON public.guides TO anon, authenticated;
GRANT SELECT (id, place_id, source_url, source_type, publisher_name, accessed_at, created_at)
  ON public.place_sources TO anon, authenticated;
GRANT SELECT (id, place_id, source_id, fact_key, fact_value, verification_status, checked_at, review_due_at, created_at, updated_at)
  ON public.place_facts TO anon, authenticated;
GRANT SELECT (guide_id, place_id, position, editorial_rationale, is_sponsored, sponsorship_disclosure, created_at, updated_at)
  ON public.guide_places TO anon, authenticated;
GRANT SELECT (id, guide_id, source_url, source_type, publisher_name, accessed_at, created_at)
  ON public.guide_sources TO anon, authenticated;

INSERT INTO public.neighborhoods (slug, name, city, region, country, publication_status)
VALUES ('deep-ellum', 'Deep Ellum', 'Dallas', 'TX', 'USA', 'published')
ON CONFLICT (slug) DO NOTHING;
