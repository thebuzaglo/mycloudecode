import "./index.css";
import { Composition } from "remotion";
import { CtaTeaser } from "./CtaTeaser";

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
    </>
  );
};
