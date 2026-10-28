-- Initial source-backed editorial vertical slice for Deep Ellum.
-- Seed only facts verified from official public business websites on 2026-10-28.

WITH deep_ellum AS (
  SELECT id FROM public.neighborhoods WHERE slug = 'deep-ellum'
),
place_seed(slug, name, summary, website_url, phone, address_line1, postal_code) AS (
  VALUES
    ('serious-pizza-deep-ellum', 'Serious Pizza', 'Pizza by the slice and whole pies at 2807 Elm Street. Its official location page lists later closing hours on Fridays and Saturdays than on other days.', 'https://www.seriouspizza.com/location/dallas/', '469-949-9234', '2807 Elm Street', '75226'),
    ('pecan-lodge-deep-ellum', 'Pecan Lodge', 'A Deep Ellum barbecue restaurant on Main Street. Its official website publishes different closing times across the week, so check the schedule for your visit.', 'https://pecanlodge.com/', '214-748-8900', '2702 Main Street', '75226'),
    ('armoury-deep-ellum', 'Armoury D.E.', 'A restaurant and bar on Elm Street. The official site lists venue hours separately from kitchen hours and notes a limited menu on Tuesdays and Wednesdays.', 'https://armouryde.com/', '972-803-5151', '2714 Elm Street', '75226')
),
upsert_places AS (
  INSERT INTO public.places
    (slug, name, summary, website_url, phone, address_line1, city, region, postal_code, neighborhood_id, publication_status)
  SELECT s.slug, s.name, s.summary, s.website_url, s.phone, s.address_line1, 'Dallas', 'TX', s.postal_code, n.id, 'draft'
  FROM place_seed s CROSS JOIN deep_ellum n
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    summary = EXCLUDED.summary,
    website_url = EXCLUDED.website_url,
    phone = EXCLUDED.phone,
    address_line1 = EXCLUDED.address_line1,
    city = EXCLUDED.city,
    region = EXCLUDED.region,
    postal_code = EXCLUDED.postal_code,
    neighborhood_id = EXCLUDED.neighborhood_id
  RETURNING id, slug
),
place_ids AS (
  SELECT id, slug FROM upsert_places
  UNION
  SELECT p.id, p.slug FROM public.places p JOIN place_seed s ON s.slug = p.slug
),
sources AS (
  INSERT INTO public.place_sources (place_id, source_url, source_type, publisher_name, accessed_at)
  SELECT p.id, s.website_url, 'official_website', s.name, now()
  FROM place_ids p JOIN place_seed s ON s.slug = p.slug
  ON CONFLICT (place_id, source_url) DO UPDATE SET
    source_type = EXCLUDED.source_type,
    publisher_name = EXCLUDED.publisher_name,
    accessed_at = EXCLUDED.accessed_at
  RETURNING id, place_id
)
INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, true
FROM place_ids p
JOIN public.categories c ON c.slug = 'restaurant'
ON CONFLICT (place_id, category_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;

INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, false
FROM public.places p
JOIN public.categories c ON c.slug = 'bar'
WHERE p.slug = 'armoury-deep-ellum'
ON CONFLICT (place_id, category_id) DO UPDATE SET is_primary = false;

INSERT INTO public.place_facts (place_id, source_id, fact_key, fact_value, verification_status, checked_at, review_due_at)
SELECT p.id, s.id, f.fact_key, f.fact_value, 'verified', now(), now() + interval '30 days'
FROM public.places p
JOIN public.place_sources s ON s.place_id = p.id AND s.source_url = p.website_url
JOIN (
  VALUES
    ('serious-pizza-deep-ellum', 'opening_hours', '{"sunday_thursday":"11:00 AM–12:00 AM","friday_saturday":"11:00 AM–3:00 AM","timezone":"America/Chicago"}'::jsonb),
    ('pecan-lodge-deep-ellum', 'opening_hours', '{"monday":"11:00 AM–3:00 PM","tuesday_thursday":"11:00 AM–8:00 PM","friday":"11:00 AM–9:00 PM","saturday":"11:00 AM–10:00 PM","sunday":"11:00 AM–9:00 PM","timezone":"America/Chicago"}'::jsonb),
    ('armoury-deep-ellum', 'opening_hours', '{"monday_friday":"4:00 PM–2:00 AM","saturday_sunday":"2:00 PM–2:00 AM","timezone":"America/Chicago"}'::jsonb),
    ('armoury-deep-ellum', 'kitchen_hours', '{"tuesday_thursday":"4:00 PM–2:00 AM","friday":"4:00 PM–2:00 AM","saturday_sunday":"2:00 PM–2:00 AM","menu_note":"Limited menu Tuesday and Wednesday","timezone":"America/Chicago"}'::jsonb)
) AS f(slug, fact_key, fact_value) ON f.slug = p.slug
ON CONFLICT (place_id, fact_key, source_id) DO UPDATE SET
  fact_value = EXCLUDED.fact_value,
  verification_status = EXCLUDED.verification_status,
  checked_at = EXCLUDED.checked_at,
  review_due_at = EXCLUDED.review_due_at,
  updated_at = now();

UPDATE public.places
SET publication_status = 'published',
    published_at = COALESCE(published_at, now()),
    last_editorial_review_at = now()
WHERE slug IN ('serious-pizza-deep-ellum', 'pecan-lodge-deep-ellum', 'armoury-deep-ellum');

INSERT INTO public.guides (slug, title, summary, body, author_name, publication_status)
VALUES (
  'three-deep-ellum-dinner-stops',
  'Three Deep Ellum dinner stops to consider before a night out',
  'Three source-backed options with different timing considerations: barbecue, pizza, and a restaurant-bar whose kitchen schedule is published separately.',
  'Planning dinner around a show is partly a timing problem. These three Deep Ellum options publish useful details on their own websites, but they serve different needs. This is a practical shortlist, not a ranking or a claim of firsthand visits.

Pecan Lodge is on Main Street and publishes a day-by-day schedule. Its listed Monday hours end at 3 p.m., while the other days have later closing times, so check the day before building plans around it.

Serious Pizza is on Elm Street. Its official location page lists hours until midnight Sunday through Thursday and until 3 a.m. Friday and Saturday. Those are venue hours, not a guarantee that every item or service will be available at closing.

Armoury D.E. is on Elm Street and publishes kitchen hours separately from venue hours. Its site also notes a limited menu on Tuesdays and Wednesdays, making the kitchen schedule worth checking rather than relying only on the closing time.

Before setting out, confirm current hours and menu availability directly with the business. Schedules can change for holidays, events, and other operational reasons.',
  'DallasCircle Editorial',
  'draft'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  body = EXCLUDED.body,
  author_name = EXCLUDED.author_name;

INSERT INTO public.guide_sources (guide_id, source_url, source_type, publisher_name, accessed_at)
SELECT g.id, s.source_url, 'official_website', s.publisher_name, now()
FROM public.guides g
CROSS JOIN (
  VALUES
    ('https://www.seriouspizza.com/location/dallas/', 'Serious Pizza'),
    ('https://pecanlodge.com/', 'Pecan Lodge'),
    ('https://armouryde.com/', 'Armoury D.E.')
) AS s(source_url, publisher_name)
WHERE g.slug = 'three-deep-ellum-dinner-stops'
ON CONFLICT (guide_id, source_url) DO UPDATE SET
  publisher_name = EXCLUDED.publisher_name,
  accessed_at = EXCLUDED.accessed_at;

INSERT INTO public.guide_places (guide_id, place_id, position, editorial_rationale, is_sponsored)
SELECT g.id, p.id, x.position, x.editorial_rationale, false
FROM public.guides g
JOIN (
  VALUES
    ('pecan-lodge-deep-ellum', 1, 'Useful if barbecue is the goal; the official schedule varies by day and Monday closes earlier.'),
    ('serious-pizza-deep-ellum', 2, 'A pizza option with official late closing hours listed for Friday and Saturday.'),
    ('armoury-deep-ellum', 3, 'Worth checking when kitchen timing matters because kitchen hours and venue hours are published separately.')
) AS x(place_slug, position, editorial_rationale) ON true
JOIN public.places p ON p.slug = x.place_slug
WHERE g.slug = 'three-deep-ellum-dinner-stops'
ON CONFLICT (guide_id, place_id) DO UPDATE SET
  position = EXCLUDED.position,
  editorial_rationale = EXCLUDED.editorial_rationale,
  is_sponsored = false,
  sponsorship_disclosure = NULL;

UPDATE public.guides
SET publication_status = 'published',
    published_at = COALESCE(published_at, now()),
    reviewed_at = now()
WHERE slug = 'three-deep-ellum-dinner-stops';