import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Building2, Flame, Wrench, FileText, CornerDownRight } from "lucide-react";
import { staticSearchEntries, type SearchEntry } from "@/data/searchIndex";
import { companies } from "@/data/companies";
import { activeOffers } from "@/data/offers";

const typeMeta: Record<string, { label: string; Icon: any }> = {
  page: { label: "עמודים", Icon: FileText },
  company: { label: "חברות מימון", Icon: Building2 },
  offer: { label: "מבצעים", Icon: Flame },
  tool: { label: "כלים", Icon: Wrench },
};

function buildIndex(): SearchEntry[] {
  const companyEntries: SearchEntry[] = companies.map((c) => ({
    id: `company-${c.id}`,
    title: c.name,
    description: c.shortDescription,
    url: `/company/${c.id}`,
    type: "company",
    keywords: [c.tag, ...c.features, c.promo].filter(Boolean) as string[],
  }));
  const offerEntries: SearchEntry[] = activeOffers.slice(0, 40).map((o) => ({
    id: `offer-${o.id}`,
    title: o.title,
    description: o.description,
    url: "/offers",
    type: "offer",
    keywords: [o.company, o.discount, o.code || ""],
  }));
  const seen = new Set<string>();
  return [...staticSearchEntries, ...companyEntries, ...offerEntries].filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const index = useMemo(buildIndex, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.filter((e) => e.type === "page").slice(0, 8);
    const scored = index
      .map((e) => {
        const inTitle = e.title.toLowerCase().includes(q) ? 3 : 0;
        const inDesc = e.description.toLowerCase().includes(q) ? 1 : 0;
        const inKw = (e.keywords || []).some((k) => k.toLowerCase().includes(q)) ? 2 : 0;
        return { e, score: inTitle + inDesc + inKw };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.e);
    return scored;
  }, [query, index]);

  const go = (entry: SearchEntry) => {
    onClose();
    navigate(entry.url);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      go(results[cursor]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-navy-950/80 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl glass shadow-card-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 text-secondary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKey}
                placeholder="חיפוש חברות, מבצעים, כלים ועמודים..."
                className="flex-1 bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
                aria-label="חיפוש באתר"
              />
              <button onClick={onClose} aria-label="סגור חיפוש" className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2.5">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  לא נמצאו תוצאות עבור „{query}”
                </div>
              ) : (
                results.map((r, i) => {
                  const meta = typeMeta[r.type] || typeMeta.page;
                  return (
                    <button
                      key={r.id}
                      onClick={() => go(r)}
                      onMouseEnter={() => setCursor(i)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-right transition-colors ${
                        i === cursor ? "bg-primary/10" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                        <meta.Icon className="h-4 w-4 text-secondary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-foreground">{r.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{r.description}</span>
                      </span>
                      {i === cursor && <CornerDownRight className="mt-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 text-[11px] text-muted-foreground">
              <span>↑↓ ניווט · Enter בחירה · Esc סגירה</span>
              <span className="font-bold text-secondary">PAYLESS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
