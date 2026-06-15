import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, display, outline } from "../theme";

// One animated phrase: springs up into place, holds, then fades.
export const KineticLine: React.FC<{
  text: string;
  startFrame: number;
  durationFrames: number;
  gold?: boolean;
  big?: boolean;
  sub?: boolean;
  ltr?: boolean;
}> = ({ text, startFrame, durationFrames, gold, big, sub, ltr }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  if (local < -2 || local > durationFrames + 12) return null;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, stiffness: 150, mass: 0.7 },
  });

  const exit = interpolate(
    local,
    [durationFrames - 8, durationFrames + 6],
    [0, 1],
    { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = enter * (1 - exit);
  const translateY = (1 - enter) * 46 + exit * -24;
  const scale = 0.92 + enter * 0.08;

  const fontSize = sub ? 52 : big ? 104 : 76;
  const color = gold ? COLORS.gold : COLORS.navy;
  const stroke = gold ? "#FFFFFF" : "#FFFFFF";

  return (
    <div
      dir={ltr ? "ltr" : "rtl"}
      style={{
        fontFamily: display,
        fontWeight: sub ? 700 : 900,
        fontSize,
        lineHeight: 1.1,
        color,
        textAlign: "center",
        textShadow: outline(stroke),
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        maxWidth: 920,
        padding: "0 40px",
      }}
    >
      {text}
    </div>
  );
};
