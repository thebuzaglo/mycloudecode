import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Coupon-code chip with copy-to-clipboard + success feedback.
*/
export default function CopyCode({
  code,
  copiedLabel = "הועתק בהצלחה!",
  className,
}: {
  code: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-2.5 transition-all",
        copied
          ? "border-emerald-400/60 bg-emerald-500/10"
          : "border-secondary/40 bg-secondary/[0.07] hover:border-secondary/70 hover:bg-secondary/[0.12]",
        className
      )}
      aria-label={`העתקת קוד ${code}`}
    >
      {copied ? (
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <Check className="h-4 w-4" />
          {copiedLabel}
        </span>
      ) : (
        <span className="flex items-center gap-2 text-xs font-bold text-secondary">
          <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          קוד קופון:
        </span>
      )}
      <span className="font-mono text-sm font-black tracking-widest text-secondary" dir="ltr">
        {code}
      </span>
    </button>
  );
}
