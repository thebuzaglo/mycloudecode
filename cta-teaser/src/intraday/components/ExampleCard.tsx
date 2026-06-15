import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, display } from "../theme";

const Row: React.FC<{
  label: string;
  value: string;
  delay: number;
  accent?: boolean;
}> = ({ label, value, delay, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
        padding: "26px 36px",
        borderRadius: 22,
        background: accent ? COLORS.gold : COLORS.bgPanel,
        border: `2px solid ${accent ? COLORS.gold : "rgba(34,56,74,0.10)"}`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 30}px)`,
        boxShadow: "0 10px 30px rgba(34,56,74,0.10)",
      }}
    >
      <span
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 40,
          color: accent ? COLORS.navyDeep : COLORS.muted,
        }}
      >
        {label}
      </span>
      <span
        dir="ltr"
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 56,
          color: COLORS.navy,
        }}
      >
        {value}
      </span>
    </div>
  );
};

export const ExampleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const lockPulse = interpolate(
    frame,
    [Math.round(6.2 * fps), Math.round(6.2 * fps) + 6, Math.round(6.2 * fps) + 16],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        padding: "0 70px",
      }}
    >
      <div
        dir="ltr"
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 80,
          color: COLORS.navy,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 30}px)`,
          marginBottom: 8,
        }}
      >
        MFFU Rapid · $50K
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
        <Row label="נגרר מתחת לשיא" value="-$2,000" delay={0.9 * fps} />
        <div style={{ transform: `scale(${lockPulse})` }}>
          <Row label="נעילה ברווח" value="+$100 🔒" delay={1.8 * fps} accent />
        </div>
      </div>
    </div>
  );
};
