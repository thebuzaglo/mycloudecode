import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function remaining(endIso: string) {
  const diff = new Date(endIso).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/*
  Live countdown (days:hours:minutes:seconds) for offer.countdown ISO strings.
  Renders nothing once expired.
*/
export default function Countdown({ endIso, className }: { endIso: string; className?: string }) {
  const [time, setTime] = useState(() => remaining(endIso));

  useEffect(() => {
    const t = setInterval(() => setTime(remaining(endIso)), 1000);
    return () => clearInterval(t);
  }, [endIso]);

  if (!time) return null;

  const cells: { v: number; label: string }[] = [
    { v: time.days, label: "ימים" },
    { v: time.hours, label: "שעות" },
    { v: time.minutes, label: "דקות" },
    { v: time.seconds, label: "שניות" },
  ];

  return (
    <div className={cn("flex items-center justify-center gap-2", className)} dir="ltr">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-sm font-black text-secondary/60 -mt-3">:</span>}
          <div className="flex min-w-[3rem] flex-col items-center rounded-lg bg-navy-950/70 border border-white/10 px-2 py-1.5">
            <span className="text-lg font-black tabular-nums text-secondary leading-none">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[9px] font-medium text-muted-foreground">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
