// v3 timeline (seconds on the final video = vo_v3.wav time).
// Voice: Higgsfield elevenlabs_v4 + Shlomi voice element (same technique as the site-launch video).
// Character: gpt_image_2 stills from the 4K face frame + Kling silent motion. No lip-sync.
export const FPS = 30;
export const VO_END = 31.63;
export const LOOP_SEC = 1.0;
export const TOTAL_SEC = VO_END + LOOP_SEC;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);
export const F = (t: number) => Math.round(t * FPS);

export const C = {green: '#2EE59D', red: '#FF4D5E', gold: '#F5C451', white: '#FFFFFF', ink: '#070B10'};

export type Shot = {
  id: string;
  src: string; // file in public/media ('' = graphic scene)
  from: number;
  to: number;
  startFrom: number;
  kind: 'still' | 'clip' | 'graphic';
  zoom?: [number, number];
  pan?: [number, number]; // vertical drift in px (start, end)
  punch?: number[];
  rate?: number;
  filter?: string;
  origin?: string;
};

export const SHOTS: Shot[] = [
  {id: 'casino', src: 'casino.mp4', from: 0, to: 2.77, startFrom: 0.0, kind: 'clip', zoom: [1.07, 1.0], filter: 'brightness(0.8) saturate(0.62) contrast(1.06)'},
  {id: 'flash', src: '', from: 2.77, to: 3.57, startFrom: 0, kind: 'graphic'},
  {id: 'desk', src: 'k_desk.mp4', from: 3.57, to: 4.49, startFrom: 1.2, kind: 'clip', zoom: [1.04, 1.08], origin: '45% 30%'},
  {id: 'buy', src: 'buyscreen.mp4', from: 4.49, to: 5.4, startFrom: 1.8, kind: 'clip', zoom: [1.0, 1.08]},
  {id: 'smug', src: 'k_smug.mp4', from: 5.4, to: 8.85, startFrom: 0.4, kind: 'clip', zoom: [1.0, 1.06], origin: '50% 30%'},
  {id: 'green', src: 'chart.mp4', from: 8.85, to: 10.1, startFrom: 0.8, kind: 'clip', zoom: [1.1, 1.02], filter: 'brightness(0.72) saturate(1.05)'},
  {id: 'chart', src: '', from: 10.1, to: 15.1, startFrom: 0, kind: 'graphic'},
  {id: 'rulesA', src: 'c5.jpg', from: 15.1, to: 18.71, startFrom: 0, kind: 'still', zoom: [1.0, 1.06], pan: [0, -20], punch: [15.19, 16.75]},
  {id: 'rulesB', src: 'c4.jpg', from: 18.71, to: 23.75, startFrom: 0, kind: 'still', zoom: [1.04, 1.1], pan: [0, -24], punch: [21.03]},
  {id: 'decision', src: 'k_calm.mp4', from: 23.75, to: 26.36, startFrom: 1.4, kind: 'clip', zoom: [1.06, 1.1], origin: '50% 30%', punch: [25.26]},
  {id: 'cta', src: 'c8.jpg', from: 26.36, to: VO_END, startFrom: 0, kind: 'still', zoom: [1.0, 1.07], pan: [0, -16]},
  {id: 'loop', src: 'hook.mp4', from: VO_END, to: TOTAL_SEC, startFrom: 1.69, kind: 'clip'},
];

export type Word = {t: number; w: string; c?: string};
export type Chunk = {from: number; to: number; words: Word[]};
const g = C.green, r = C.red;
export const CHUNKS: Chunk[] = [
  {from: 3.57, to: 4.49, words: [{t: 3.57, w: 'נכנסים'}, {t: 4.03, w: 'לעסקה'}]},
  {from: 5.45, to: 6.87, words: [{t: 5.45, w: 'ומשכנעים'}, {t: 6.31, w: 'את'}, {t: 6.43, w: 'עצמנו'}]},
  {from: 6.87, to: 8.85, words: [{t: 6.87, w: 'שהכל'}, {t: 7.55, w: 'הולך'}, {t: 7.91, w: 'לפי'}, {t: 8.19, w: 'התוכנית,', c: g}]},
  {from: 10.14, to: 11.9, words: [{t: 10.14, w: 'ואז'}, {t: 10.62, w: 'מרחיקים'}, {t: 11.12, w: 'את'}, {t: 11.24, w: 'הסטופ,', c: r}]},
  {from: 11.9, to: 13.12, words: [{t: 11.9, w: 'מוסיפים'}, {t: 12.48, w: 'עוד'}, {t: 12.74, w: 'חוזה,', c: r}]},
  {from: 13.12, to: 15.1, words: [{t: 13.12, w: 'ונכנסים'}, {t: 14.08, w: 'לעוד'}, {t: 14.44, w: 'עסקה.', c: r}]},
];
export const CAPTION_WINDOWS: [number, number][] = [[3.57, 4.49], [5.4, 8.85], [10.1, 15.1]];

// chart scene: NQ points relative to the first entry, $20 per point per contract
export const CHART_T0 = 10.1;
export const CHART_T1 = 15.1;
export const PRICE_KEYS: [number, number][] = [
  [10.1, 0], [10.3, 5], [10.5, -5], [10.7, -12], [10.85, -14], [11.15, -20], [11.4, -28], [11.5, -30],
  [11.8, -24], [12.1, -31], [12.45, -36], [12.74, -40], [13.05, -46], [13.45, -54], [13.7, -57],
  [14.05, -52], [14.35, -60], [14.7, -72], [15.1, -80],
];
export const STOP_KEYS: [number, number][] = [[10.75, -15], [11.1, -32], [11.45, -32], [11.8, -60], [13.65, -60], [13.95, -95]];
export const ENTRIES: {t: number; px: number}[] = [{t: 10.1, px: 0}, {t: 12.74, px: -40}, {t: 14.44, px: -52}];
export const FAIL_AT = 14.75;
export const MOVE_AT = 10.75;
