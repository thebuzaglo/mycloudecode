// v2 timeline. All times are seconds on the final video (= vo_v2.wav time).
export const FPS = 30;
export const VO_END = 29.065;
export const LOOP_SEC = 1.0;
export const TOTAL_SEC = VO_END + LOOP_SEC;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);
export const F = (t: number) => Math.round(t * FPS);

export const C = {
  green: '#2EE59D',
  red: '#FF4D5E',
  gold: '#F5C451',
  white: '#FFFFFF',
  ink: '#070B10',
};

export type Shot = {
  id: string;
  src: string; // file in public/media ('' = graphic scene)
  from: number;
  to: number;
  startFrom: number; // seconds into the source clip
  kind: 'aroll' | 'broll' | 'graphic';
  zoom?: [number, number];
  punch?: number[];
  rate?: number;
  filter?: string;
  origin?: string;
};

// Lip-sync offsets (clip-local = t - offset): W1 1.895, W4 14.285, W3 22.415, W5 24.545
export const SHOTS: Shot[] = [
  {id: 'casino', src: 'casino.mp4', from: 0, to: 2.23, startFrom: 0.0, kind: 'broll', zoom: [1.07, 1.0], filter: 'brightness(0.8) saturate(0.62) contrast(1.06)'},
  {id: 'flash', src: '', from: 2.23, to: 3.03, startFrom: 0, kind: 'graphic'},
  {id: 'a1', src: 'W1.mp4', from: 3.03, to: 3.955, startFrom: 1.135, kind: 'aroll', zoom: [1.0, 1.02]},
  {id: 'buy', src: 'buyscreen.mp4', from: 3.955, to: 4.95, startFrom: 1.75, kind: 'broll', zoom: [1.0, 1.08]},
  {id: 'a2', src: 'W1.mp4', from: 4.95, to: 7.75, startFrom: 3.055, kind: 'aroll', zoom: [1.03, 1.07]},
  {id: 'green', src: 'chart.mp4', from: 7.75, to: 9.115, startFrom: 0.8, kind: 'broll', zoom: [1.1, 1.02], filter: 'brightness(0.72) saturate(1.05)'},
  {id: 'chart', src: '', from: 9.115, to: 14.285, startFrom: 0, kind: 'graphic'},
  {id: 'rules', src: 'W4.mp4', from: 14.285, to: 22.525, startFrom: 0.0, kind: 'aroll', zoom: [1.0, 1.04], punch: [14.385, 16.005, 17.805, 20.145]},
  {id: 'decision', src: 'W3.mp4', from: 22.525, to: 24.665, startFrom: 0.11, kind: 'aroll', zoom: [1.12, 1.15], punch: [23.705]},
  {id: 'cta', src: 'W5.mp4', from: 24.665, to: VO_END, startFrom: 0.12, kind: 'aroll', zoom: [1.0, 1.04]},
  {id: 'loop', src: 'hook.mp4', from: VO_END, to: TOTAL_SEC, startFrom: 1.65, kind: 'broll'},
];

export type Word = {t: number; w: string; c?: string};
export type Chunk = {from: number; to: number; words: Word[]};
const g = C.green, r = C.red, au = C.gold;
export const CHUNKS: Chunk[] = [
  {from: 3.06, to: 3.955, words: [{t: 3.06, w: 'נכנסים'}, {t: 3.555, w: 'לעסקה'}]},
  {from: 3.955, to: 4.995, words: [{t: 3.955, w: 'בשביל'}, {t: 4.295, w: 'הריגוש,', c: au}]},
  {from: 4.995, to: 6.235, words: [{t: 4.995, w: 'ומשכנעים'}, {t: 5.775, w: 'את'}, {t: 5.875, w: 'עצמנו'}]},
  {from: 6.235, to: 7.75, words: [{t: 6.235, w: 'שהכל'}, {t: 6.775, w: 'הולך'}, {t: 7.055, w: 'לפי'}, {t: 7.335, w: 'התוכנית,', c: g}]},
  {from: 9.345, to: 11.195, words: [{t: 9.345, w: 'ואז'}, {t: 9.835, w: 'מרחיקים'}, {t: 10.475, w: 'את'}, {t: 10.595, w: 'הסטופ,', c: r}]},
  {from: 11.195, to: 12.595, words: [{t: 11.195, w: 'מוסיפים'}, {t: 11.915, w: 'עוד'}, {t: 12.095, w: 'חוזה,', c: r}]},
  {from: 12.595, to: 14.285, words: [{t: 12.595, w: 'ונכנסים'}, {t: 13.395, w: 'לעוד'}, {t: 13.695, w: 'עסקה.', c: r}]},
];
// captions are shown only inside these windows (everything else carries its own on-screen text)
export const CAPTION_WINDOWS: [number, number][] = [[3.03, 3.955], [4.95, 7.75], [9.115, 14.285]];

// chart scene: price in NQ points relative to the first entry, $20 per point per contract
export const PRICE_KEYS: [number, number][] = [
  [9.115, 0], [9.35, 5], [9.6, -5], [9.85, -12], [10.05, -14], [10.3, -20], [10.55, -28], [10.65, -30],
  [11.0, -24], [11.3, -31], [11.7, -36], [12.095, -40], [12.4, -46], [12.8, -54], [13.05, -57],
  [13.4, -52], [13.7, -60], [14.0, -72], [14.285, -80],
];
export const STOP_KEYS: [number, number][] = [[9.9, -15], [10.25, -32], [10.6, -32], [10.95, -60], [13.0, -60], [13.3, -95]];
export const ENTRIES: {t: number; px: number}[] = [{t: 9.115, px: 0}, {t: 12.095, px: -40}, {t: 13.55, px: -52}];
