import { useMemo, useState } from "react";
import { Search, Newspaper } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/primitives";
import PostCard, { FeaturedPostCard } from "@/components/blog/PostCard";
import { useBlogPosts } from "@/components/blog/utils";
import { cn } from "@/lib/utils";

export default function Blog() {
  const { posts } = useBlogPosts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, category]);

  const [featured, ...rest] = filtered;

  const chipCls = (active: boolean) =>
    cn(
      "rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-300",
      active
        ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
        : "glass-bright text-muted-foreground hover:text-foreground"
    );

  return (
    <>
      <Seo
        title="בלוג PAYLESS - מאמרים, טיפים ועדכונים על מסחר וחברות מימון"
        description="מאמרים מקצועיים, טיפים שימושיים ועדכונים חמים על עולם המסחר וחברות המימון. למד מהמומחים ושפר את ביצועי המסחר שלך"
      />

      <PageHero
        eyebrow="הבלוג הרשמי של אתר PAYLESS"
        title="מדריכים וטיפים למסחר"
        highlight="בחברות מימון"
        subtitle="כל המידע שצריך על חברות מימון (Prop Firms) לסוחרים, השוואות, קודי קופון והנחות, וטיפים מקצועיים להצלחה במסחר"
      />

      <section className="container relative pb-24">
        <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[680px] max-w-full -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />

        {/* search + category filter */}
        <Reveal className="relative mx-auto mb-12 flex max-w-3xl flex-col gap-5">
          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש מאמרים..."
              className="glass w-full rounded-2xl py-3.5 pl-4 pr-12 text-base text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:shadow-glow-cyan"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button type="button" onClick={() => setCategory(null)} className={chipCls(category === null)}>
              הכל
            </button>
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)} className={chipCls(category === c)}>
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* featured latest post */}
        {featured && (
          <Reveal className="relative mb-12">
            <FeaturedPostCard post={featured} />
          </Reveal>
        )}

        {/* the rest of the posts */}
        {rest.length > 0 && (
          <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}

        {/* empty states */}
        {filtered.length === 0 && (
          <Reveal className="relative py-20 text-center">
            <Newspaper className="mx-auto mb-5 h-14 w-14 text-muted-foreground/50" />
            <p className="text-lg font-bold text-muted-foreground">
              {query || category
                ? "לא נמצאו מאמרים התואמים את החיפוש"
                : "בקרוב יתווספו מאמרים חדשים ומעניינים"}
            </p>
          </Reveal>
        )}
      </section>
    </>
  );
}
