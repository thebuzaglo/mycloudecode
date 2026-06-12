/*
  Lightweight REST access to the existing PAYLESS Supabase backend.
  Uses the same public anon key that ships with the original site bundle.
*/
const SUPABASE_URL = "https://bkrtldtwnrlduzjmwsgt.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcnRsZHR3bnJsZHV6am13c2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjg0MDEsImV4cCI6MjA3NDg0NDQwMX0.GCmjkeDspkteZWnUoAuPUW2cvytcl4wiSJGTFeuaiMg";

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json",
};

export async function fetchBlogPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=*&is_published=eq.true&order=published_at.desc`,
    { headers }
  );
  if (!res.ok) throw new Error("failed to load blog posts");
  return res.json();
}

export async function subscribeNewsletter(email: string, source = "newsletter_home") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({ email, source }),
  });
  if (res.status === 409) return { duplicate: true };
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("duplicate") || body.includes("23505")) return { duplicate: true };
    throw new Error("subscribe failed");
  }
  return { duplicate: false };
}

export interface YtVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

export async function fetchLatestVideos(): Promise<YtVideo[]> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-youtube-videos`, {
    method: "POST",
    headers,
    body: "{}",
  });
  if (!res.ok) throw new Error("failed to load videos");
  const data = await res.json();
  return data.videos || [];
}
