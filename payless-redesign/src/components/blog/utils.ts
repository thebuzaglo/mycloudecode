import { useEffect, useMemo, useState } from "react";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { fetchBlogPosts } from "@/lib/supabase";

/* Reading time ≈ words / 200, in minutes (at least 1). */
export const readingTime = (content: string) =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const hebFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const hebDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : hebFormatter.format(d);
};

/* Coerce a live Supabase row into the local BlogPost shape (null if unusable). */
export function normalizePost(raw: any): BlogPost | null {
  if (!raw || typeof raw.slug !== "string" || !raw.slug) return null;
  if (typeof raw.title !== "string" || typeof raw.content !== "string") return null;
  return {
    id: String(raw.id ?? raw.slug),
    title: raw.title,
    slug: raw.slug,
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt : "",
    content: raw.content,
    author: typeof raw.author === "string" && raw.author ? raw.author : "צוות PayLess",
    category: typeof raw.category === "string" ? raw.category : "",
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t: unknown) => typeof t === "string") : [],
    featured_image: typeof raw.featured_image === "string" ? raw.featured_image : "",
    meta_description: typeof raw.meta_description === "string" ? raw.meta_description : "",
    published_at: typeof raw.published_at === "string" ? raw.published_at : "",
    views_count: typeof raw.views_count === "number" ? raw.views_count : 0,
    featured_offers: Array.isArray(raw.featured_offers)
      ? raw.featured_offers.filter((o: unknown) => typeof o === "string")
      : [],
  };
}

/* Merge live posts over the static fallback, by slug (live wins), newest first. */
export function mergePosts(staticPosts: BlogPost[], live: BlogPost[]): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();
  for (const p of staticPosts) bySlug.set(p.slug, p);
  for (const p of live) bySlug.set(p.slug, p);
  return [...bySlug.values()].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

/*
  useBlogPosts — tries the live Supabase feed, silently falls back to the
  static snapshot on any error; merges by slug, preferring live rows.
*/
export function useBlogPosts() {
  const [live, setLive] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let mounted = true;
    fetchBlogPosts()
      .then((rows: any[]) => {
        if (!mounted || !Array.isArray(rows)) return;
        setLive(rows.map(normalizePost).filter((p): p is BlogPost => p !== null));
      })
      .catch(() => {
        /* offline / API error → static snapshot only */
      })
      .finally(() => {
        if (mounted) setStatus("ready");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const posts = useMemo(() => mergePosts(blogPosts, live), [live]);
  return { posts, status };
}
