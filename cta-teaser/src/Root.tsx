import "./index.css";
import { Composition } from "remotion";
import { CtaTeaser } from "./CtaTeaser";
import { IntradayStop } from "./intraday/IntradayStop";
import { FPS, WIDTH, HEIGHT } from "./intraday/theme";
import { TOTAL_FRAMES } from "./intraday/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CtaTeaser"
        component={CtaTeaser}
        durationInFrames={240}
        fps={24}
        width={1280}
        height={720}
      />
      <Composition
        id="IntradayStop"
        component={IntradayStop}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          voiceover: "voiceover/intraday-stop.mp3" as string | null,
          useLogoFile: false,
        }}
      />
    </>
  );
};
