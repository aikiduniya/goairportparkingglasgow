import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBlogViews(slug?: string) {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Fetch all view counts
  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase
        .from("blog_view_counts")
        .select("slug, view_count");
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((row: any) => {
          counts[row.slug] = row.view_count;
        });
        setViewCounts(counts);
      }
    };
    fetchCounts();
  }, []);

  // Track a view when slug is provided (blog detail page)
  useEffect(() => {
    if (!slug) return;
    const trackView = async () => {
      await supabase.from("blog_views").insert({ slug });
    };
    trackView();
  }, [slug]);

  return viewCounts;
}
