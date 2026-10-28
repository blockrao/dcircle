DROP POLICY public_read_categories_with_published_places ON public.categories;
CREATE POLICY public_read_active_categories
  ON public.categories FOR SELECT TO anon, authenticated
  USING (is_active);
