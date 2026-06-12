import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock, Eye, User } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal, Badge, GoldButton, ArrowLink, SectionHeading } from "@/components/ui/primitives";
import Markdown from "@/components/blog/Markdown";
import ShareRow from "@/components/blog/ShareRow";
import FeaturedOffers, { hasRenderableOffers } from "@/components/blog/FeaturedOffers";
import PostCard from "@/components/blog/PostCard";
import { useBlogPosts, hebDate, readingTime } from "@/components/blog/utils";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, status } = useBlogPosts();

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    /* slug not in the static snapshot — wait for the live feed before 404ing */
    if (status === "loading") {
      return (
        <section className="container py-24">
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="glass h-8 w-2/3 animate-pulse rounded-xl" />
            <div className="glass h-64 w-full animate-pulse rounded-2xl" />
            <div className="glass h-40 w-full animate-pulse rounded-2xl" />
          </div>
        </section>
      );
    }
    return (
      <>
        <Seo title="המאמר לא נמצא | בלוג PayLess" />
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden text-center">
          <div className="grid-overlay absolute inset-0" />
          <div className="relative">
            <div className="text-[7rem] font-black leading-none text-gradient-gold md:text-[10rem]">404</div>
            <h1 className="mt-2 text-2xl font-extrabold">המאמר לא נמצא</h1>
            <div className="mt-8">
              <GoldButton to="/blog">חזרה לבלוג</GoldButton>
            </div>
          </div>
        </section>
      </>
    );
  }

  const related = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const minutes = readingTime(post.content);

  return (
    <>
      <Seo title={`${post.title} | בלוג PayLess`} description={post.meta_description || post.excerpt} />

      {/* hero — featured image + gradient overlay */}
      <section className="relative isolate overflow-hidden">
        <img
          src={post.featured_image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
        <div className="noise-overlay" />

        <div className="container relative z-10 pb-14 pt-28 md:pb-20 md:pt-36">
          <Reveal>
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-secondary">
                בית
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <Link to="/blog" className="transition-colors hover:text-secondary">
                בלוג
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <span className="line-clamp-1 max-w-[16rem] text-foreground/80 md:max-w-md">{post.title}</span>
            </nav>

            <Badge tone="gold">{post.category}</Badge>

            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.2] text-gradient-ice md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-secondary/70" />
                מאת: <span className="font-bold text-foreground/90">{post.author}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-secondary/70" />
                {hebDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary/70" />
                <span dir="ltr">{minutes}</span> דקות קריאה
              </span>
              {post.views_count > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-secondary/70" />
                  <span dir="ltr">{post.views_count.toLocaleString()}</span> צפיות
                </span>
              )}
            </div>

            <div className="mt-7">
              <ArrowLink to="/blog">חזרה לבלוג</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* article body */}
      <section className="container relative py-14 md:py-16">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[480px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[130px]" />
        <article className="relative">
          <Markdown content={post.content} />
        </article>

        {/* featured offers */}
        {hasRenderableOffers(post.featured_offers) && (
          <div className="relative mt-16">
            <div className="beam-divider mb-14" />
            <FeaturedOffers ids={post.featured_offers} />
          </div>
        )}

        {/* tags + share */}
        <div className="relative mx-auto mt-14 flex max-w-3xl flex-col gap-6 border-t border-white/10 pt-8">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold text-muted-foreground">תגיות:</span>
              {post.tags.map((t) => (
                <Badge key={t} tone="muted">
                  {t}
                </Badge>
              ))}
            </div>
          )}
          <ShareRow />
        </div>
      </section>

      {/* related posts */}
      {related.length > 0 && (
        <section className="container relative pb-24">
          <SectionHeading title="מאמרים" highlight="קשורים" align="right" className="mb-8 md:mb-10" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
