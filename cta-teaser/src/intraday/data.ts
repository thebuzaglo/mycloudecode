import type { Candle } from "./components/CandlestickChart";

// Scene 2 — gentle rise, floor trails below.
export const candlesWhat: Candle[] = [
  { o: 100, h: 105, l: 99, c: 104 },
  { o: 104, h: 109, l: 103, c: 108 },
  { o: 108, h: 113, l: 107, c: 112 },
];

// Scene 3 — sustained uptrend, higher highs; floor ratchets up with each peak.
export const candlesFloor: Candle[] = [
  { o: 100, h: 106, l: 98, c: 104 },
  { o: 104, h: 110, l: 103, c: 108 },
  { o: 108, h: 113, l: 106, c: 110 },
  { o: 110, h: 118, l: 109, c: 116 },
  { o: 116, h: 121, l: 114, c: 119 },
  { o: 119, h: 127, l: 118, c: 125 },
  { o: 125, h: 131, l: 123, c: 129 },
  { o: 129, h: 136, l: 127, c: 134 },
  { o: 134, h: 141, l: 132, c: 139 },
];

// Scene 4 — rise to a peak, then a normal pullback that pierces the locked floor.
export const candlesTrap: Candle[] = [
  { o: 100, h: 106, l: 99, c: 105 },
  { o: 105, h: 112, l: 104, c: 110 },
  { o: 110, h: 119, l: 109, c: 117 },
  { o: 117, h: 126, l: 116, c: 124 },
  { o: 124, h: 133, l: 122, c: 131 },
  { o: 131, h: 135, l: 129, c: 132 }, // highest high → floor locks here
  { o: 132, h: 133, l: 126, c: 128 },
  { o: 128, h: 129, l: 122, c: 123 },
  { o: 123, h: 124, l: 118, c: 120 }, // breach: low pierces the floor
];
export const trapTrail = 12;
export const trapBreachIndex = 8;
