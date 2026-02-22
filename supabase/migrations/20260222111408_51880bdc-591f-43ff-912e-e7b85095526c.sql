
-- Fix security definer view
DROP VIEW IF EXISTS public.blog_view_counts;
CREATE OR REPLACE VIEW public.blog_view_counts WITH (security_invoker = true) AS
SELECT slug, COUNT(*) as view_count
FROM public.blog_views
GROUP BY slug;
