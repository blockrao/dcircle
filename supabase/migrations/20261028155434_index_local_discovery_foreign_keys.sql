CREATE INDEX IF NOT EXISTS place_facts_source_place_idx
  ON public.place_facts (source_id, place_id);
CREATE INDEX IF NOT EXISTS places_neighborhood_id_idx
  ON public.places (neighborhood_id);
