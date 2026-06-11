import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Rubik";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["hebrew", "latin"],
});

const CTA_START = 122;
const HEADLINE_START = 126;
const CHIP_STARTS = [140, 148, 156];
const SUBSCRIBE_START = 170;
const SHINE_START = 192;
const BELL_START = 188;
const LIKE_PULSE = 204;

const Icon: React.FC<{ d: string; size?: number }> = ({ d, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
);

const ICONS = {
  like: "M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
  comment:
    "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  share:
    "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
  bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
};

const Chip: React.FC<{
  label: string;
  icon: string;
  startFrame: number;
  pulseFrame?: number;
}> = ({ label, icon, startFrame, pulseFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  const pulse = pulseFrame
    ? interpolate(frame, [pulseFrame, pulseFrame + 5, pulseFrame + 11], [1, 1.14, 1], {
        easing: Easing.inOut(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const iconTilt = pulseFrame
    ? interpolate(frame, [pulseFrame, pulseFrame + 5, pulseFrame + 11], [0, -14, 0], {
        easing: Easing.inOut(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 28px",
        borderRadius: 999,
        background: "rgba(255, 255, 255, 0.13)",
        border: "1.5px solid rgba(255, 255, 255, 0.28)",
        backdropFilter: "blur(14px)",
        color: "white",
        fontSize: 27,
        fontWeight: 700,
        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.35)",
        opacity: pop,
        transform: `translateY(${(1 - pop) * 36}px) scale(${pop * pulse})`,
      }}
    >
      <span style={{ display: "flex", transform: `rotate(${iconTilt}deg)` }}>
        <Icon d={icon} />
      </span>
      {label}
    </div>
  );
};

const SubscribeButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - SUBSCRIBE_START,
    fps,
    config: { damping: 11, stiffness: 150 },
  });

  const bellRotation = interpolate(
    frame,
    [BELL_START, BELL_START + 5, BELL_START + 10, BELL_START + 15, BELL_START + 20, BELL_START + 25],
    [0, -20, 15, -10, 5, 0],
    {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const shineX = interpolate(frame, [SHINE_START, SHINE_START + 20], [-120, 360], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle breathing pulse after the button has settled
  const breathe =
    1 +
    0.025 *
      Math.sin(((frame - SUBSCRIBE_START) / fps) * Math.PI * 1.4) *
      interpolate(frame, [SUBSCRIBE_START + 20, SUBSCRIBE_START + 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 44px",
        borderRadius: 999,
        background: "linear-gradient(135deg, #ff1f3d 0%, #d6001c 100%)",
        color: "white",
        fontSize: 31,
        fontWeight: 800,
        boxShadow: "0 10px 36px rgba(214, 0, 28, 0.5)",
        opacity: pop,
        transform: `translateY(${(1 - pop) * 40}px) scale(${pop * breathe})`,
      }}
    >
      <span
        style={{
          display: "flex",
          transform: `rotate(${bellRotation}deg)`,
          transformOrigin: "50% 15%",
        }}
      >
        <Icon d={ICONS.bell} size={30} />
      </span>
      הירשמו לערוץ
      <div
        style={{
          position: "absolute",
          top: -20,
          bottom: -20,
          left: shineX,
          width: 70,
          background:
            "linear-gradient(105deg, transparent, rgba(255,255,255,0.45), transparent)",
          transform: "skewX(-18deg)",
        }}
      />
    </div>
  );
};

export const CtaTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const gradientOpacity = interpolate(frame, [CTA_START, CTA_START + 20], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headlinePop = spring({
    frame: frame - HEADLINE_START,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black", fontFamily }}>
      <Video
        src={staticFile("source-clean.mp4")}
        volume={(f) =>
          interpolate(f, [durationInFrames - 12, durationInFrames - 1], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(2, 8, 6, 0.88) 0%, rgba(2, 8, 6, 0.55) 22%, transparent 48%)",
          opacity: gradientOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          direction: "rtl",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 34,
          gap: 20,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 46,
            fontWeight: 800,
            textShadow: "0 4px 22px rgba(0, 0, 0, 0.7)",
            opacity: headlinePop,
            transform: `translateY(${(1 - headlinePop) * 44}px)`,
          }}
        >
          רגע לפני שממשיכים — תפרגנו!
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          <Chip label="לייק" icon={ICONS.like} startFrame={CHIP_STARTS[0]} pulseFrame={LIKE_PULSE} />
          <Chip label="תגובה" icon={ICONS.comment} startFrame={CHIP_STARTS[1]} />
          <Chip label="שיתוף" icon={ICONS.share} startFrame={CHIP_STARTS[2]} />
        </div>

        <SubscribeButton />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
