import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, display } from "../theme";

// Light background + subtle tiled brand watermark + a gold progress bar at the
// bottom (the competitor used a progress bar; we keep the cue, on-brand).
export const BrandFrame: React.FC<{
  children: React.ReactNode;
  progress: number; // 0..1 overall video progress
}> = ({ children, progress }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* subtle tiled "PAYLESS" watermark */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: 0,
          opacity: 0.025,
          transform: "rotate(-18deg) scale(1.6)",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 70,
              color: COLORS.navy,
              width: 360,
              textAlign: "center",
              padding: "18px 0",
            }}
          >
            PAYLESS
          </div>
        ))}
      </AbsoluteFill>

      {/* very soft top/bottom vignette to seat the content */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 42%, rgba(255,255,255,0) 55%, rgba(244,246,248,0.9) 100%)",
        }}
      />

      {children}

      {/* progress bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 10,
          backgroundColor: "rgba(34,56,74,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
