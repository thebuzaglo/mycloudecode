import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import { SectionHeading, Reveal, GoldButton } from "@/components/ui/primitives";
import { companies } from "@/data/companies";

export default function ComparisonTeaser() {
  return (
    <section className="container relative py-20">
      <SectionHeading
        eyebrow="השוואה מהירה"
        title="כל הנתונים,"
        highlight="במבט אחד"
        subtitle="טבלת השוואה חיה של כל חברות המימון — דירוג, מימון מקסימלי, קוד קופון והרשמה ישירה"
      />
      <Reveal>
        <div className="overflow-hidden rounded-2xl glass">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-sm text-muted-foreground">
                  <th className="px-5 py-4 font-bold">חברה</th>
                  <th className="px-5 py-4 font-bold">דירוג</th>
                  <th className="px-5 py-4 font-bold">מימון מקסימלי</th>
                  <th className="px-5 py-4 font-bold">יתרון בולט</th>
                  <th className="px-5 py-4 font-bold">קוד קופון</th>
                  <th className="px-5 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`group border-b border-white/5 transition-colors hover:bg-primary/[0.05] ${i % 2 ? "bg-white/[0.015]" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <Link to={`/company/${c.id}`} className="flex items-center gap-3 font-extrabold hover:text-secondary transition-colors">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] p-1.5">
                          <img src={c.logo} alt="" loading="lazy" className={`max-h-full max-w-full object-contain ${c.invertLogo ? "invert" : ""}`} />
                        </span>
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-secondary" dir="ltr">
                        {c.rating}
                        <Star className="h-4 w-4 fill-secondary" />
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-gradient-cyan" dir="ltr">{c.maxAllocation}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{c.features[0]}</td>
                    <td className="px-5 py-4">
                      {c.promo ? (
                        <span className="rounded-lg border border-dashed border-secondary/50 bg-secondary/10 px-2.5 py-1 text-xs font-black text-secondary">
                          {c.promo}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={c.signupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-gold px-3.5 py-2 text-xs font-black text-navy-950 opacity-90 transition-all hover:opacity-100 hover:shadow-glow-gold"
                      >
                        להרשמה
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
      <Reveal className="mt-9 text-center">
        <GoldButton to="/companies" size="lg">
          להשוואה המלאה והמפורטת
        </GoldButton>
      </Reveal>
    </section>
  );
}
