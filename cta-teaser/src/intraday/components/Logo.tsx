import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, display } from "../theme";

// Faithful SVG recreation of the Prop Firm Payless logo (navy coin + gold
// price-tag with a $ and a right arrow, "PAYLESS" wordmark below).
// If an official logo is dropped at public/logo.png it overrides this drawing.
export const Logo: React.FC<{
  size?: number;
  showWordmark?: boolean;
  useFile?: boolean;
}> = ({ size = 360, showWordmark = true, useFile = false }) => {
  if (useFile) {
    return (
      <Img
        src={staticFile("logo.png")}
        style={{ width: size, height: "auto" }}
      />
    );
  }

  const coin = size;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.06,
      }}
    >
      <svg width={coin} height={coin} viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="coinG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2C465C" />
            <stop offset="1" stopColor={COLORS.navy} />
          </linearGradient>
          <linearGradient id="tagG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.goldLight} />
            <stop offset="1" stopColor={COLORS.gold} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#coinG)" />
        <circle cx="100" cy="100" r="92" stroke="#16242F" strokeWidth="3" opacity="0.5" />
        {/* price tag body */}
        <path
          d="M70 58 h44 a8 8 0 0 1 5.6 2.3 l40 40 a10 10 0 0 1 0 14 l-30 30 a10 10 0 0 1 -14 0 l-40 -40 a8 8 0 0 1 -2.3 -5.6 V66 a8 8 0 0 1 8 -8 Z"
          fill="url(#tagG)"
          transform="translate(-12,-2)"
        />
        {/* tag hole */}
        <circle cx="76" cy="76" r="9" fill={COLORS.navy} />
        {/* dollar sign */}
        <text
          x="92"
          y="118"
          fontFamily={display}
          fontWeight={900}
          fontSize="64"
          fill={COLORS.navy}
          textAnchor="middle"
        >
          $
        </text>
        {/* right arrow */}
        <path
          d="M150 108 h20 v-9 l18 17 -18 17 v-9 h-20 Z"
          fill={COLORS.navy}
          transform="translate(-6,-16)"
        />
      </svg>
      {showWordmark && (
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: size * 0.26,
            letterSpacing: size * 0.012,
            color: COLORS.navy,
            lineHeight: 1,
          }}
        >
          PAYLESS
        </div>
      )}
    </div>
  );
};
