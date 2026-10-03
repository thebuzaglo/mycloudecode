import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Reel2} from './Reel2';
import {FPS, TOTAL_FRAMES} from './timeline';
import {TOTAL_FRAMES as TOTAL_FRAMES_V2} from './timeline2';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Dopamine" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="DopamineV2" component={Reel2} durationInFrames={TOTAL_FRAMES_V2} fps={FPS} width={1080} height={1920} />
  </>
);
