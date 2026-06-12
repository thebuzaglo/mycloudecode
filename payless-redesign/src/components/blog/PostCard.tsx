import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import { GlassCard, Badge } from "@/components/ui/primitives";
import type { BlogPost } from "@/data/blogPosts";
import { hebDate, readingTime } from "./utils";

function MetaRow({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-secondary/70" />
        {hebDate(post.published_at)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-secondary/70" />
        <span dir="ltr">{readingTime(post.content)}</span> דקות קריאה
      </span>
    </div>
  );
}

/* Compact grid card */
export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <GlassCard className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
          <span className="absolute right-4 top-4">
            <Badge tone="gold">{post.category}</Badge>
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="text-lg font-extrabold leading-snug transition-colors group-hover:text-secondary">
            {post.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
          <MetaRow post={post} />
        </div>
      </GlassCard>
    </Link>
  );
}

/* Large hero card for the latest post */
export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <GlassCard glow className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[240px] md:min-h-[360px]">
            <img
              src={post.featured_image}
              alt={post.title}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-l from-navy-950/60 via-navy-950/10 to-transparent" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
            <div className="flex items-center gap-2">
              <Badge tone="gold">{post.category}</Badge>
            </div>
            <h2 className="text-2xl font-black leading-snug text-gradient-ice md:text-3xl">
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base line-clamp-4">
              {post.excerpt}
            </p>
            <MetaRow post={post} />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
