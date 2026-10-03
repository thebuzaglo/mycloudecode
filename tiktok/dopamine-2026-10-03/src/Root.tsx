import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Reel2} from './Reel2';
import {Reel3} from './Reel3';
import {FPS, TOTAL_FRAMES} from './timeline';
import {TOTAL_FRAMES as TOTAL_FRAMES_V2} from './timeline2';
import {TOTAL_FRAMES as TOTAL_FRAMES_V3} from './timeline3';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Dopamine" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="DopamineV2" component={Reel2} durationInFrames={TOTAL_FRAMES_V2} fps={FPS} width={1080} height={1920} />
    <Composition id="DopamineV3" component={Reel3} durationInFrames={TOTAL_FRAMES_V3} fps={FPS} width={1080} height={1920} />
  </>
);
