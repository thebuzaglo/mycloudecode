// All "vo" times are seconds on the edited voiceover (vo_main.wav).
// The hook (clip from the previous dopamine video) occupies the first HOOK_SEC.
export const FPS = 30;
export const HOOK_SEC = 2.6;
export const VO_END = 31.95;
export const TAIL_SEC = 0.5;
export const TOTAL_SEC = HOOK_SEC + VO_END + TAIL_SEC;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

export const f = (voSec: number) => Math.round((HOOK_SEC + voSec) * FPS);

export const C = {
  green: '#2EE59D',
  red: '#FF4D5E',
  gold: '#F5C451',
  white: '#FFFFFF',
  ink: '#070B10',
};

export type Shot = {
  id: string;
  src: string; // file in public/media
  from: number; // vo sec
  to: number; // vo sec
  startFrom: number; // seconds into the source clip
  kind: 'aroll' | 'broll';
  zoom?: [number, number]; // slow zoom start/end
  punch?: number[]; // vo sec of punch-in hits inside the shot
  rate?: number;
  filter?: string;
  origin?: string;
};

// A-roll lip-sync clips: W1 audio starts at vo 1.20, W2 at 15.98, W3 at 25.15
export const SHOTS: Shot[] = [
  {id: 'S1', src: 'chart.mp4', from: 0, to: 1.35, startFrom: 0.6, kind: 'broll', zoom: [1.08, 1.0], filter: 'brightness(0.78) saturate(1.1)'},
  {id: 'S2', src: 'W1.mp4', from: 1.35, to: 2.95, startFrom: 0.15, kind: 'aroll', zoom: [1.0, 1.025]},
  {id: 'S3', src: 'buy.mp4', from: 2.95, to: 4.2, startFrom: 0.0, kind: 'broll', zoom: [1.0, 1.06]},
  {id: 'S4', src: 'W1.mp4', from: 4.2, to: 8.45, startFrom: 3.0, kind: 'aroll', zoom: [1.03, 1.075], punch: [7.51]},
  {id: 'S5', src: '', from: 8.45, to: 13.7, startFrom: 0, kind: 'broll'},
  {id: 'S6', src: 'casino.mp4', from: 13.7, to: 15.98, startFrom: 0.2, kind: 'broll', zoom: [1.0, 1.05], filter: 'brightness(1.05)'},
  {id: 'S7', src: 'W2.mp4', from: 15.98, to: 21.45, startFrom: 0.0, kind: 'aroll', zoom: [1.0, 1.04], punch: [18.56]},
  {id: 'S8', src: 'W2.mp4', from: 21.45, to: 23.45, startFrom: 5.47, kind: 'aroll', zoom: [1.16, 1.19]},
  {id: 'S9', src: 'stepaway.mp4', from: 23.45, to: 25.25, startFrom: 2.35, kind: 'broll', rate: 1.45, zoom: [1.12, 1.04], filter: 'brightness(2.2) contrast(1.12) saturate(1.15)', origin: '50% 40%'},
  {id: 'S10', src: 'W3.mp4', from: 25.25, to: 27.3, startFrom: 0.1, kind: 'aroll', zoom: [1.1, 1.13], punch: [26.5]},
  {id: 'S11', src: 'W3.mp4', from: 27.3, to: VO_END + TAIL_SEC, startFrom: 2.15, kind: 'aroll', zoom: [1.0, 1.04]},
];

export type Word = {t: number; w: string; c?: string};
export type Chunk = {from: number; to: number; words: Word[]};

const g = C.green, r = C.red, au = C.gold;
export const CHUNKS: Chunk[] = [
  {from: 1.43, to: 2.86, words: [{t: 1.43, w: 'לפעמים'}, {t: 1.96, w: 'אנחנו'}, {t: 2.36, w: 'נכנסים'}]},
  {from: 2.86, to: 4.22, words: [{t: 2.86, w: 'לעסקה'}, {t: 3.26, w: 'בשביל'}, {t: 3.6, w: 'הריגוש,', c: au}]},
  {from: 4.3, to: 5.54, words: [{t: 4.3, w: 'ומשכנעים'}, {t: 5.08, w: 'את'}, {t: 5.18, w: 'עצמנו'}]},
  {from: 5.54, to: 7.4, words: [{t: 5.54, w: 'שהכל'}, {t: 6.08, w: 'הולך'}, {t: 6.36, w: 'לפי'}, {t: 6.64, w: 'התוכנית,', c: g}]},
  {from: 7.51, to: 8.45, words: [{t: 7.51, w: 'גם', c: r}, {t: 7.72, w: 'כשזה', c: r}, {t: 8.08, w: 'לא.', c: r}]},
  {from: 8.85, to: 10.62, words: [{t: 8.85, w: 'ואז'}, {t: 9.34, w: 'מרחיקים'}, {t: 9.98, w: 'את'}, {t: 10.1, w: 'הסטופ,', c: r}]},
  {from: 10.7, to: 12.06, words: [{t: 10.7, w: 'מוסיפים'}, {t: 11.42, w: 'עוד'}, {t: 11.6, w: 'חוזה,', c: r}]},
  {from: 12.1, to: 13.7, words: [{t: 12.1, w: 'ונכנסים'}, {t: 12.9, w: 'לעוד'}, {t: 13.2, w: 'עסקה.', c: r}]},
  {from: 16.17, to: 17.18, words: [{t: 16.17, w: 'לפני'}, {t: 16.42, w: 'העסקה'}, {t: 16.82, w: 'הבאה'}]},
  {from: 17.18, to: 18.45, words: [{t: 17.18, w: 'תשאלו'}, {t: 17.52, w: 'את'}, {t: 17.6, w: 'עצמכם,', c: au}]},
  {from: 21.63, to: 22.26, words: [{t: 21.63, w: 'אם'}, {t: 21.74, w: 'אתם'}, {t: 21.9, w: 'מחפשים'}]},
  {from: 22.26, to: 23.45, words: [{t: 22.26, w: 'תירוץ', c: r}, {t: 22.76, w: 'להיכנס,'}]},
  {from: 23.76, to: 25.25, words: [{t: 23.76, w: 'תתרחקו'}, {t: 24.28, w: 'רגע'}, {t: 24.5, w: 'מהמסך.', c: g}]},
];
