import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard, VideoCard } from "@/components/ui/primitives";

export interface FaqItem {
  question: string;
  answer: string;
  videoEmbed?: string; // YouTube videoId
}

/*
  Glass accordion for FAQ blocks (shared by tool pages + calculators).
*/
export default function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <GlassCard key={i} className="overflow-hidden !rounded-xl">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
            aria-expanded={open === i}
          >
            <span className="text-sm font-bold md:text-base">{f.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-secondary transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.21, 0.65, 0.36, 1] }}
              >
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.answer}
                  {f.videoEmbed && (
                    <div className="mt-4 max-w-xl">
                      <VideoCard videoId={f.videoEmbed} title={f.question} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}
    </div>
  );
}
