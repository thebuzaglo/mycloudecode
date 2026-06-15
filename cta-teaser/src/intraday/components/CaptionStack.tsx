import React from "react";
import { secToFrames, type Phrase } from "../timeline";
import { KineticLine } from "./KineticLine";

// Renders a scene's phrases as kinetic lines. Phrases that overlap in time
// stack vertically; we render them in a centered column and let timing control
// visibility, so typically 1–2 are visible at once.
export const CaptionStack: React.FC<{
  phrases: Phrase[];
  align?: "center" | "bottom" | "top";
}> = ({ phrases, align = "center" }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent:
          align === "bottom" ? "flex-end" : align === "top" ? "flex-start" : "center",
        alignItems: "center",
        gap: 18,
        paddingBottom: align === "bottom" ? 220 : 0,
        paddingTop: align === "top" ? 260 : 0,
      }}
    >
      {phrases.map((p, i) => {
        const from = secToFrames(p.from ?? 0);
        const dur = secToFrames(p.dur ?? 2);
        return (
          <KineticLine
            key={i}
            text={p.text}
            startFrame={from}
            durationFrames={dur}
            gold={p.gold}
            big={p.big}
            sub={p.sub}
            ltr={p.ltr}
          />
        );
      })}
    </div>
  );
};
