import { FPS } from "./theme";

const s = (seconds: number) => Math.round(seconds * FPS);

// A caption phrase shown inside a scene. Times are in SECONDS relative to the
// scene start. `from` defaults to 0. These are tuned to the voiceover once the
// audio exists (see scripts/map-timings — values below are the authored draft).
export type Phrase = {
  text: string;
  from?: number; // seconds, relative to scene start
  dur?: number; // seconds visible
  gold?: boolean; // render in gold accent
  big?: boolean; // extra large
  ltr?: boolean; // wrap as LTR (for English / numbers)
  sub?: boolean; // smaller secondary line
};

export type SceneDef = {
  id: string;
  durSec: number;
  phrases: Phrase[];
};

// Authored scene durations (~52s). Adjust `durSec` to match the generated VO.
export const SCENES: SceneDef[] = [
  {
    id: "hook",
    durSec: 5,
    phrases: [
      { text: "רוב הסוחרים", from: 0.2, dur: 1.6, sub: true },
      { text: "לא נשרפים מהפסד גדול", from: 1.0, dur: 2.4 },
      { text: "אלא מסטופ אחד —", from: 2.8, dur: 2.2, big: true },
      { text: "שזז לבד.", from: 3.6, dur: 1.6, big: true, gold: true },
    ],
  },
  {
    id: "what",
    durSec: 9,
    phrases: [
      { text: "Intraday Trailing Stop", from: 0.2, dur: 4.0, big: true, ltr: true, gold: true },
      { text: "מגבלת סיכון שנמדדת בזמן אמת", from: 3.2, dur: 3.0 },
      { text: "כל שנייה של יום המסחר", from: 5.2, dur: 3.4, gold: true },
    ],
  },
  {
    id: "floor",
    durSec: 12,
    phrases: [
      { text: "כל שיא חדש —", from: 0.3, dur: 2.6, big: true },
      { text: "הרצפה עולה איתך ↑", from: 2.4, dur: 3.0, gold: true },
      { text: "גם רווח לא ממומש מזיז אותה", from: 5.4, dur: 3.4 },
      { text: "אבל למטה — לעולם לא חוזרת", from: 8.6, dur: 3.0, big: true, gold: true },
    ],
  },
  {
    id: "trap",
    durSec: 12,
    phrases: [
      { text: "עסקה עלתה, נגעת בשיא...", from: 0.3, dur: 3.2 },
      { text: "וחזרת לאזור הכניסה", from: 3.2, dur: 2.8, sub: true },
      { text: "אתה בקושי ברווח", from: 5.6, dur: 2.6 },
      { text: "נגיעה אחת = חשבון שרוף", from: 8.4, dur: 3.4, big: true, gold: true },
    ],
  },
  {
    id: "example",
    durSec: 10,
    phrases: [
      { text: "MFFU Rapid · $50K", from: 0.3, dur: 3.0, big: true, ltr: true },
      { text: "הסטופ נגרר $2,000 מהשיא היומי", from: 2.8, dur: 3.6 },
      { text: "נעילה ב-+$100 — ואז לא זז", from: 6.2, dur: 3.4, gold: true },
    ],
  },
  {
    id: "cta",
    durSec: 8,
    phrases: [
      { text: "כל שיא מצמצם את מרחב הטעות", from: 0.2, dur: 2.6, sub: true },
      { text: "משמעת בכל שנייה", from: 2.6, dur: 2.0, big: true, gold: true },
    ],
  },
];

// Absolute scene boundaries in frames.
export const sceneRanges = (() => {
  let acc = 0;
  return SCENES.map((sc) => {
    const from = acc;
    const durationInFrames = s(sc.durSec);
    acc += durationInFrames;
    return { ...sc, from, durationInFrames };
  });
})();

export const TOTAL_FRAMES = sceneRanges.reduce(
  (sum, sc) => sum + sc.durationInFrames,
  0,
);

export const secToFrames = s;
