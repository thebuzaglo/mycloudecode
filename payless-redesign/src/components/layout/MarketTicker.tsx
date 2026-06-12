import { useEffect, useRef, useState } from "react";

/*
  Live market ticker — TradingView ticker-tape widget (same symbols as the
  original site), wrapped in the new visual language. Shows Israel-time
  market open/closed indicator.
*/
const isMarketOpen = () => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  if (day === 6) return false;
  if (day === 0) return false;
  if (day === 1 && mins < 60) return false;
  if (mins >= 0 && mins < 60) return false;
  return true;
};

export default function MarketTicker() {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(isMarketOpen());

  useEffect(() => {
    const id = setInterval(() => setOpen(isMarketOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !widgetRef.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "OANDA:US30USD", title: "Dow Jones" },
        { proName: "TVC:USOIL", title: "נפט גולמי" },
        { proName: "TVC:GOLD", title: "זהב" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "regular",
      colorTheme: "dark",
      locale: "he",
    });
    widgetRef.current.appendChild(script);
    return () => {
      script.parentNode?.removeChild(script);
    };
  }, [visible]);

  return (
    <div ref={hostRef} className="relative w-full overflow-hidden border-b border-white/5 bg-navy-950/80">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="relative flex items-center">
        <div className="z-10 flex shrink-0 items-center gap-2 border-l border-white/10 bg-navy-900/90 px-4 py-2.5 backdrop-blur">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${open ? "bg-emerald-400" : "bg-red-500"}`}
              style={{ animationDuration: "2s" }}
            />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? "bg-emerald-400" : "bg-red-500"}`} />
          </span>
          <span className="text-xs font-bold text-foreground/80">
            {open ? "השוק פתוח" : "השוק סגור"}
          </span>
        </div>
        <div ref={widgetRef} className="tradingview-widget-container h-[46px] flex-1" dir="ltr" />
      </div>
    </div>
  );
}
