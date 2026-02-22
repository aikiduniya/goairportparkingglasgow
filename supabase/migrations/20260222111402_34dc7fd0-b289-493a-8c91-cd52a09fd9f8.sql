
-- Create table to track blog views
CREATE TABLE public.blog_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_hash TEXT
);

-- Create a view to get counts per slug
CREATE OR REPLACE VIEW public.blog_view_counts AS
SELECT slug, COUNT(*) as view_count
FROM public.blog_views
GROUP BY slug;

-- Enable RLS
ALTER TABLE public.blog_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (track views)
CREATE POLICY "Anyone can track views"
ON public.blog_views
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read view counts
CREATE POLICY "Anyone can read views"
ON public.blog_views
FOR SELECT
USING (true);

-- Index for fast slug lookups
CREATE INDEX idx_blog_views_slug ON public.blog_views (slug);
