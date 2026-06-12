import { Quote } from "lucide-react";
import { SectionHeading, Marquee } from "@/components/ui/primitives";
import { testimonials } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="relative py-20">
      <div className="container">
        <SectionHeading
          eyebrow="הקהילה מדברת"
          title="סוחרים אמיתיים,"
          highlight="תוצאות אמיתיות"
        />
      </div>
      <Marquee speed="slow">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="relative w-[340px] shrink-0 rounded-2xl glass p-6 md:w-[400px]"
            dir="rtl"
          >
            <Quote className="absolute -top-3 right-6 h-7 w-7 rounded-lg bg-gradient-gold p-1.5 text-navy-950" />
            <blockquote className="min-h-[96px] text-[15px] leading-relaxed text-foreground/90">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-xl object-cover ring-2 ring-secondary/30"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-base font-black text-white">
                  {t.name[0]}
                </span>
              )}
              <div>
                <div className="text-sm font-extrabold">{t.name}</div>
                {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
              </div>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
