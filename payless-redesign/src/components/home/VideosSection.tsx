import { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronLeft, Youtube } from "lucide-react";
import { SectionHeading, VideoCard, Reveal, GhostButton } from "@/components/ui/primitives";
import { fetchLatestVideos, type YtVideo } from "@/lib/supabase";
import { socials } from "@/data/site";

/* fallback list — real videos from the channel, used if the live feed fails */
const fallbackVideos: YtVideo[] = [
  { id: "LK4opxd1Zik", title: "האם מסלול Bolt של FundedNext Futures עוקף את המתחרים? סקירה מקיפה", thumbnail: "", publishedAt: "", viewCount: "", duration: "" },
  { id: "VM7GiRKU0yQ", title: "המסלול שישבור את השוק? הסיקור המלא ל-Alpha Futures Premium 🪙", thumbnail: "", publishedAt: "", viewCount: "", duration: "" },
  { id: "x4J3G7GoB4o", title: "המחשבון שישמור לכם על התיק | ניהול סיכונים חכם לחברות מימון! 💪", thumbnail: "", publishedAt: "", viewCount: "", duration: "" },
  { id: "R_bOplYK918", title: "סקירת חברות מימון", thumbnail: "", publishedAt: "", viewCount: "", duration: "" },
];

export default function VideosSection() {
  const [videos, setVideos] = useState<YtVideo[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestVideos()
      .then((v) => !cancelled && setVideos(v.length ? v.slice(0, 8) : fallbackVideos))
      .catch(() => !cancelled && setVideos(fallbackVideos));
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  if (!videos.length) return null;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-destructive/[0.05] blur-[120px]" />
      <div className="container relative">
        <SectionHeading
          eyebrow="מהערוץ שלנו"
          title="צפו בסרטונים"
          highlight="האחרונים שלנו"
          subtitle="סקירות עומק, מדריכים וטיפים — ישירות מערוץ היוטיוב של PAYLESS"
        />

        <Reveal>
          <div className="relative">
            <div
              ref={scroller}
              className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
              dir="rtl"
            >
              {videos.map((v) => (
                <div key={v.id} className="w-[320px] shrink-0 snap-start md:w-[380px]">
                  <VideoCard videoId={v.id} title={v.title} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => scrollBy(1)}
                aria-label="הקודם"
                className="flex h-11 w-11 items-center justify-center rounded-xl glass-bright transition-all hover:border-secondary/50 hover:text-secondary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <GhostButton href={socials.youtube}>
                <Youtube className="h-5 w-5 text-red-500" />
                לכל הסרטונים בערוץ
              </GhostButton>
              <button
                onClick={() => scrollBy(-1)}
                aria-label="הבא"
                className="flex h-11 w-11 items-center justify-center rounded-xl glass-bright transition-all hover:border-secondary/50 hover:text-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
