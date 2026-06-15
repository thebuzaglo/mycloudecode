import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS } from "./theme";
import { sceneRanges, TOTAL_FRAMES, secToFrames } from "./timeline";
import { BrandFrame } from "./components/BrandFrame";
import { CaptionStack } from "./components/CaptionStack";
import { CandlestickChart } from "./components/CandlestickChart";
import { ExampleCard } from "./components/ExampleCard";
import { Logo } from "./components/Logo";
import {
  candlesWhat,
  candlesFloor,
  candlesTrap,
  trapTrail,
  trapBreachIndex,
} from "./data";

export type IntradayStopProps = {
  voiceover?: string | null; // staticFile path under public/, or null for silent
  useLogoFile?: boolean; // use public/logo.png instead of the SVG recreation
};

// Upper chart area for the chart-driven scenes.
const ChartHolder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 230,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const SceneVisual: React.FC<{ id: string; useLogoFile?: boolean }> = ({
  id,
  useLogoFile,
}) => {
  switch (id) {
    case "what":
      return (
        <ChartHolder>
          <CandlestickChart
            candles={candlesWhat}
            revealStart={secToFrames(0.6)}
            stagger={8}
            trailDistance={7}
            width={760}
            height={560}
          />
        </ChartHolder>
      );
    case "floor":
      return (
        <ChartHolder>
          <CandlestickChart
            candles={candlesFloor}
            revealStart={secToFrames(0.4)}
            stagger={9}
            trailDistance={9}
            width={940}
            height={760}
          />
        </ChartHolder>
      );
    case "trap":
      return (
        <ChartHolder>
          <CandlestickChart
            candles={candlesTrap}
            revealStart={secToFrames(0.4)}
            stagger={8}
            trailDistance={trapTrail}
            breachIndex={trapBreachIndex}
            width={940}
            height={760}
          />
        </ChartHolder>
      );
    case "example":
      return <ExampleCard />;
    case "cta":
      return <CtaEndCard useLogoFile={useLogoFile} />;
    default:
      return null;
  }
};

const CtaEndCard: React.FC<{ useLogoFile?: boolean }> = ({ useLogoFile }) => {
  const frame = useCurrentFrame();
  const logoIn = interpolate(frame, [secToFrames(4.4), secToFrames(5.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 120,
        gap: 28,
        opacity: logoIn,
        transform: `translateY(${(1 - logoIn) * 30}px)`,
      }}
    >
      <Logo size={300} useFile={useLogoFile} />
      <div
        dir="ltr"
        style={{
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 40,
          color: COLORS.gold,
          letterSpacing: 1,
        }}
      >
        propfirmpayless.com
      </div>
    </div>
  );
};

export const IntradayStop: React.FC<IntradayStopProps> = ({
  voiceover = "voiceover/intraday-stop.mp3",
  useLogoFile = false,
}) => {
  const frame = useCurrentFrame();
  const progress = frame / TOTAL_FRAMES;

  return (
    <AbsoluteFill style={{ direction: "rtl" }}>
      <BrandFrame progress={progress}>
        {sceneRanges.map((sc) => (
          <Sequence
            key={sc.id}
            from={sc.from}
            durationInFrames={sc.durationInFrames}
            name={sc.id}
          >
            <AbsoluteFill>
              <SceneVisual id={sc.id} useLogoFile={useLogoFile} />
              {/* The example card carries its own labels — no caption overlay. */}
              {sc.id !== "example" && (
                <CaptionStack
                  phrases={sc.phrases}
                  align={
                    sc.id === "hook"
                      ? "center"
                      : sc.id === "cta"
                        ? "top"
                        : "bottom"
                  }
                />
              )}
            </AbsoluteFill>
          </Sequence>
        ))}
      </BrandFrame>

      {voiceover ? (
        <Audio
          src={staticFile(voiceover)}
          volume={(f) =>
            interpolate(
              f,
              [TOTAL_FRAMES - 14, TOTAL_FRAMES - 1],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
