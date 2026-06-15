import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

export type Candle = { o: number; h: number; l: number; c: number };

type Props = {
  candles: Candle[];
  revealStart: number; // frame when candles begin revealing
  stagger?: number; // frames between candle reveals
  showFloor?: boolean;
  trailDistance?: number; // price units below the running high-water-mark
  lockFloorAt?: number; // floor stops rising once it reaches this value
  breachIndex?: number | null; // candle index where price pierces the floor
  width?: number;
  height?: number;
};

// Builds the ratcheting trailing-stop floor: tracks the running max high and
// sits `trailDistance` below it; only rises, never falls; optionally locks.
const buildFloor = (
  candles: Candle[],
  trailDistance: number,
  lockFloorAt?: number,
) => {
  let runningHigh = -Infinity;
  let floor = -Infinity;
  return candles.map((c) => {
    runningHigh = Math.max(runningHigh, c.h);
    let f = runningHigh - trailDistance;
    if (floor === -Infinity) floor = f;
    floor = Math.max(floor, f); // ratchet: never decreases
    if (lockFloorAt !== undefined) floor = Math.min(floor, lockFloorAt);
    return floor;
  });
};

export const CandlestickChart: React.FC<Props> = ({
  candles,
  revealStart,
  stagger = 5,
  showFloor = true,
  trailDistance = 0,
  lockFloorAt,
  breachIndex = null,
  width = 920,
  height = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floors = showFloor
    ? buildFloor(candles, trailDistance, lockFloorAt)
    : [];

  const allLows = candles.map((c) => c.l);
  const allHighs = candles.map((c) => c.h);
  const pMin = Math.min(...allLows, ...(showFloor ? floors : [])) - 6;
  const pMax = Math.max(...allHighs) + 8;
  const range = pMax - pMin;

  const padX = 40;
  const usableW = width - padX * 2;
  const step = usableW / candles.length;
  const bodyW = Math.min(step * 0.56, 46);

  const xAt = (i: number) => padX + step * i + step / 2;
  const yAt = (price: number) => height - ((price - pMin) / range) * height;

  const lastRevealed = Math.floor((frame - revealStart) / stagger);

  // Floor polyline points up to the last revealed candle (stepped).
  const floorPts: string[] = [];
  if (showFloor) {
    for (let i = 0; i <= Math.min(lastRevealed, candles.length - 1); i++) {
      const x0 = i === 0 ? padX : xAt(i) - step / 2;
      const x1 = xAt(i) + step / 2;
      const y = yAt(floors[i]);
      floorPts.push(`${x0},${y}`);
      floorPts.push(`${x1},${y}`);
    }
  }

  // Breach flash when the breaching candle reveals.
  const hasBreach = breachIndex != null;
  const breachFrame = hasBreach ? revealStart + breachIndex * stagger : 0;
  const flash = hasBreach
    ? interpolate(
        frame,
        [breachFrame, breachFrame + 4, breachFrame + 22],
        [0, 0.5, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;
  const breached = hasBreach && frame >= breachFrame;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* candles */}
        {candles.map((c, i) => {
          const appear = spring({
            frame: frame - revealStart - i * stagger,
            fps,
            config: { damping: 18, stiffness: 90 },
          });
          if (appear <= 0.001) return null;
          const up = c.c >= c.o;
          const isBreach = breachIndex === i && breached;
          const color = isBreach
            ? COLORS.danger
            : up
              ? COLORS.gold
              : COLORS.navy;
          const x = xAt(i);
          const yHigh = yAt(c.h);
          const yLow = yAt(c.l);
          const yOpen = yAt(c.o);
          const yClose = yAt(c.c);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(Math.abs(yClose - yOpen), 3);
          const baseline = (bodyTop + bodyH / 2);
          return (
            <g
              key={i}
              opacity={appear}
              style={{
                transform: `translateY(${(1 - appear) * 24}px)`,
                transformOrigin: `${x}px ${baseline}px`,
              }}
            >
              <line
                x1={x}
                x2={x}
                y1={yHigh}
                y2={yLow}
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <rect
                x={x - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyH}
                rx={5}
                fill={color}
              />
            </g>
          );
        })}

        {/* trailing-stop floor line (stepped, ratcheting) */}
        {showFloor && floorPts.length > 1 && (
          <>
            <polyline
              points={floorPts.join(" ")}
              fill="none"
              stroke={breached ? COLORS.danger : COLORS.navy}
              strokeWidth={5}
              strokeDasharray="14 10"
              strokeLinecap="round"
              opacity={0.92}
            />
            {lastRevealed >= 0 && lastRevealed < candles.length && (
              <text
                x={padX + 6}
                y={yAt(floors[Math.min(lastRevealed, floors.length - 1)]) - 14}
                fill={breached ? COLORS.danger : COLORS.navy}
                fontSize={28}
                fontWeight={800}
                fontFamily="monospace"
              >
                STOP
              </text>
            )}
          </>
        )}
      </svg>

      {flash > 0 && (
        <AbsoluteFill
          style={{ backgroundColor: COLORS.danger, opacity: flash }}
        />
      )}
    </div>
  );
};
