import { Link } from "react-router-dom";
import { Youtube, Instagram, Facebook, Mail, MessageCircle, Music2 } from "lucide-react";
import { footerGroups, footerDisclaimer, socials } from "@/data/site";
import logo from "@/assets/brand/payless-logo-optimized.webp";

const socialLinks = [
  { href: socials.youtube, label: "YouTube", Icon: Youtube },
  { href: socials.instagram, label: "Instagram", Icon: Instagram },
  { href: socials.facebook, label: "קבוצת הפייסבוק", Icon: Facebook },
  { href: socials.tiktok, label: "TikTok", Icon: Music2 },
  { href: socials.whatsapp, label: "WhatsApp", Icon: MessageCircle },
  { href: socials.email, label: "שליחת מייל לכתובת support@propfirmpayless.com", Icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/5 bg-navy-950">
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <img src={logo} alt="PAYLESS" className="h-20 w-auto" loading="lazy" />
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
              הפלטפורמה המובילה בישראל להשוואת{" "}
              <span className="font-bold text-secondary">חברות מימון (PropFirms)</span>{" "}
              למסחר בחוזים עתידיים!
            </p>
            <div className="mt-6">
              <div className="mb-3 text-sm font-bold text-foreground">דרכי התקשרות</div>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex h-11 w-11 items-center justify-center rounded-xl glass-bright transition-all duration-300 hover:border-secondary/50 hover:shadow-glow-gold hover:-translate-y-1"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-secondary" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-secondary">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        to={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="beam-divider my-10" />

        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-muted-foreground/70">
          {footerDisclaimer}
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} PAYLESS — propfirmpayless.com</span>
          <div className="flex items-center gap-3">
            <Link to="/terms" className="hover:text-foreground transition-colors">תנאי שימוש</Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">מדיניות פרטיות</Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/accessibility" className="hover:text-foreground transition-colors">הצהרת נגישות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
