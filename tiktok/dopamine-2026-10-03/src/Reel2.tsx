import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  C, CAPTION_WINDOWS, CHUNKS, ENTRIES, F, FPS, PRICE_KEYS, SHOTS, STOP_KEYS, Shot, TOTAL_FRAMES,
} from './timeline2';

const FONT = "'Heebo', sans-serif";
const SHADOW = '0 4px 22px rgba(0,0,0,0.85), 0 2px 5px rgba(0,0,0,0.95)';
const CLIP_DUR: Record<string, number> = {
  'W1.mp4': 8.0, 'W3.mp4': 7.0, 'W4.mp4': 9.0, 'W5.mp4': 5.0, 'chart.mp4': 5.03, 'buyscreen.mp4': 3.03,
  'casino.mp4': 4.03, 'hook.mp4': 2.63,
};

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = [
      new FontFace('Heebo', `url(${staticFile('fonts/heebo-hebrew.woff2')}) format('woff2')`, {
        weight: '100 900', unicodeRange: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F',
      }),
      new FontFace('Heebo', `url(${staticFile('fonts/heebo-latin.woff2')}) format('woff2')`, {
        weight: '100 900', unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212',
      }),
    ];
    Promise.all(faces.map((ff) => ff.load())).then((loaded) => {
      loaded.forEach((ff) => document.fonts.add(ff));
      return document.fonts.ready;
    }).then(() => continueRender(handle));
  }, [handle]);
};

const pop = (frame: number, at: number, damping = 13) =>
  spring({frame: frame - at, fps: FPS, config: {damping, stiffness: 210, mass: 0.6}});

const Icon: React.FC<{d: string[]; size: number; color: string; stroke?: number}> = ({d, size, color, stroke = 2.4}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.8))', flexShrink: 0}}>
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const IC = {
  msg: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  plus: ['M5 12h14', 'M12 5v14'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  up: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
  ban: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M5.7 5.7l12.6 12.6'],
  power: ['M12 2v10', 'M18.4 6.6a9 9 0 1 1-12.77.04'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'],
};

// ---------- video shots ----------
const VideoShot: React.FC<{s: Shot}> = ({s}) => {
  const frame = useCurrentFrame();
  const len = F(s.to) - F(s.from);
  const rate = s.rate ?? 1;
  const [z0, z1] = s.zoom ?? [1, 1];
  let scale = interpolate(frame, [0, len], [z0, z1], {extrapolateRight: 'clamp'});
  scale += 0.05 * Math.exp(-frame / 3.2) * (s.kind === 'broll' ? 1 : 0.6);
  for (const p of s.punch ?? []) {
    const pf = F(p) - F(s.from);
    if (frame >= pf) scale += 0.03 * Math.exp(-(frame - pf) / 4) + 0.012 * Math.min(1, (frame - pf) / 6);
  }
  const avail = Math.floor(((CLIP_DUR[s.src] - s.startFrom) / rate) * FPS) - 1;
  const video = (
    <OffthreadVideo src={staticFile('media/' + s.src)} muted startFrom={Math.round(s.startFrom * FPS)}
      playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.filter}} />
  );
  return (
    <AbsoluteFill style={{backgroundColor: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: s.origin ?? '50% 32%'}}>
        {frame > avail ? <Freeze frame={avail}>{video}</Freeze> : video}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- big kinetic text ----------
type Line = {text: string; pre?: string; at: number; size: number; color: string; weight?: number; strikeAt?: number; slam?: boolean};
const BigText: React.FC<{lines: Line[]; top: number; from: number; gap?: number}> = ({lines, top, from, gap = 6}) => {
  const frame = useCurrentFrame() + F(from);
  return (
    <div style={{position: 'absolute', top, left: 70, width: 870, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
      {lines.map((l, i) => {
        const at = F(l.at);
        const p = pop(frame, at, l.slam ? 9 : 13);
        const shake = l.slam && frame >= at && frame < at + 8 ? Math.sin((frame - at) * 2.3) * (8 - (frame - at)) * 1.6 : 0;
        const strike = l.strikeAt !== undefined ? interpolate(frame, [F(l.strikeAt), F(l.strikeAt) + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 0;
        return (
          <div key={i} style={{
            direction: 'rtl', display: 'flex', alignItems: 'center', gap: 22, position: 'relative',
            fontFamily: FONT, fontWeight: l.weight ?? 900, fontSize: l.size, lineHeight: 1.08, color: l.color,
            textShadow: SHADOW, letterSpacing: -1,
            opacity: frame < at ? 0 : Math.min(1, p * 1.4),
            transform: `translateX(${shake}px) scale(${frame < at ? 0.5 : (l.slam ? 1.25 - 0.25 * p : 0.7 + 0.3 * p)})`,
          }}>
            {l.pre && <span>{l.pre}</span>}
            <span style={{position: 'relative'}}>
              {l.text}
              {strike > 0 && (
                <span style={{position: 'absolute', right: -8, top: '54%', height: l.size * 0.11, width: `calc(${strike * 100}% + 16px)`, background: C.red, borderRadius: 6, boxShadow: '0 2px 10px rgba(0,0,0,0.6)'}} />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- chart (price-driven P&L) ----------
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const lerpKeys = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
    }
  }
  return keys[keys.length - 1][1];
};
const T0 = 9.115, T1 = 14.285;
const priceAt = (t: number) => lerpKeys(t, PRICE_KEYS) + Math.sin(t * 37) * 1.2 + Math.sin(t * 91 + 1.3) * 0.8;
const pnlAt = (t: number) => {
  const p = lerpKeys(t, PRICE_KEYS);
  return ENTRIES.filter((e) => t >= e.t).reduce((s, e) => s + (p - e.px) * 20, 0);
};
const usd = (v: number) => (v >= 0 ? '+' : '-') + '$' + (Math.round(Math.abs(v) / 10) * 10).toLocaleString('en-US');

const ChartPanel: React.FC<{mode: 'full' | 'flash'}> = ({mode}) => {
  const local = useCurrentFrame();
  const t = mode === 'full' ? T0 + local / FPS : 13.0 + (local / F(0.8)) * (T1 - 13.0);
  const X0 = 250, X1 = 900;
  const Y = (pts: number) => 650 - pts * 4.4;
  const X = (tt: number) => X0 + (X1 - X0) * ((tt - T0) / (T1 - T0));
  const pts: string[] = [];
  for (let tt = T0; tt <= t; tt += 0.02) pts.push(`${X(tt).toFixed(1)},${Y(priceAt(tt)).toFixed(1)}`);
  const head = {x: X(Math.min(t, T1)), y: Y(priceAt(Math.min(t, T1)))};
  const stopPts = lerpKeys(t, STOP_KEYS);
  const stopY = Y(stopPts);
  const moved = t > 9.9;
  const pnl = pnlAt(t);
  const n = ENTRIES.filter((e) => t >= e.t).length;
  const lastEntry = ENTRIES.filter((e) => t >= e.t).slice(-1)[0];
  const cPop = n > 1 ? pop(Math.round((t - lastEntry.t) * FPS), 0, 9) : 1;
  const col = pnl >= 0 ? C.green : C.red;
  const fadeIn = mode === 'full' ? interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const zoom = mode === 'flash' ? interpolate(local, [0, F(0.8)], [1.0, 1.12]) : 1;
  const pill = pop(Math.round((t - 9.9) * FPS), 0, 12);
  const failAt = 13.95;
  const fail = pop(Math.round((t - failAt) * FPS), 0, 9);
  const mono: React.CSSProperties = {fontFamily: FONT, fontVariantNumeric: 'tabular-nums', direction: 'ltr', unicodeBidi: 'isolate'};
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 70% at 50% 40%, #0F1820 0%, #070B10 70%)', opacity: fadeIn, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 22%'}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 9}).map((_, i) => (
            <line key={'h' + i} x1={90} x2={990} y1={530 + i * 70} y2={530 + i * 70} stroke="rgba(255,255,255,0.05)" />
          ))}
          {Array.from({length: 7}).map((_, i) => (
            <line key={'v' + i} y1={510} y2={1110} x1={250 + i * 108} x2={250 + i * 108} stroke="rgba(255,255,255,0.04)" />
          ))}
          <line x1={90} x2={990} y1={Y(20)} y2={Y(20)} stroke={C.green} strokeDasharray="14 10" strokeWidth={3} opacity={0.8} />
          <line x1={90} x2={990} y1={Y(0)} y2={Y(0)} stroke="#cfd8e3" strokeDasharray="4 9" strokeWidth={3} opacity={0.7} />
          {moved && <line x1={90} x2={990} y1={Y(-15)} y2={Y(-15)} stroke={C.red} strokeDasharray="10 12" strokeWidth={3} opacity={0.32} />}
          <line x1={90} x2={990} y1={stopY} y2={stopY} stroke={C.red} strokeDasharray="14 10" strokeWidth={4} />
          <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round"
            style={{filter: `drop-shadow(0 0 12px ${pnl >= 0 ? 'rgba(46,229,157,0.6)' : 'rgba(255,77,94,0.6)'})`}} />
          <circle cx={head.x} cy={head.y} r={11} fill="#fff" />
          {ENTRIES.filter((e) => t >= e.t).map((e, i) => {
            const a = i === 0 ? 1 : pop(Math.round((t - e.t) * FPS), 0, 10);
            return <polygon key={i} transform={`translate(${X(e.t)} ${Y(e.px) + 34}) scale(${a})`} points="-17,24 0,-6 17,24" fill={i === 0 ? C.green : C.gold} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 104, top: 462, color: 'rgba(255,255,255,0.55)', fontSize: 28, fontWeight: 700, ...mono}}>NQ · 1m</div>
        <div style={{position: 'absolute', left: 104, top: Y(20) - 44, color: C.green, fontSize: 30, fontWeight: 800, ...mono}}>TP</div>
        <div style={{position: 'absolute', left: 104, top: Y(0) - 44, color: '#cfd8e3', fontSize: 30, fontWeight: 800, ...mono}}>ENTRY</div>
        <div style={{position: 'absolute', left: 104, top: stopY - 44, color: C.red, fontSize: 30, fontWeight: 800, ...mono}}>STOP</div>
        {moved && (
          <div style={{position: 'absolute', right: 150, top: Y(-15) - 40, direction: 'rtl', color: 'rgba(255,255,255,0.62)', fontFamily: FONT, fontWeight: 700, fontSize: 28}}>
            {'התוכנית: '}<span style={mono}>-$300</span>
          </div>
        )}
        {/* P&L */}
        <div style={{position: 'absolute', top: 285, width: 1080, textAlign: 'center', fontSize: 132, fontWeight: 900, color: col, textShadow: `0 0 30px ${pnl >= 0 ? 'rgba(46,229,157,0.35)' : 'rgba(255,77,94,0.4)'}`, ...mono}}>
          {usd(pnl)}
        </div>
        {t >= failAt && (
          <div style={{position: 'absolute', top: 430, left: 0, width: 1080, display: 'flex', justifyContent: 'center'}}>
            <div style={{direction: 'rtl', padding: '6px 22px', borderRadius: 12, border: `3px solid ${C.red}`, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 40,
              transform: `rotate(-4deg) scale(${1.6 - 0.6 * fail})`, opacity: Math.min(1, fail * 1.5), background: 'rgba(7,11,16,0.8)'}}>
              נפלת במבחן
            </div>
          </div>
        )}
        {/* contracts badge */}
        <div style={{position: 'absolute', top: 452, right: 150, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 22px', borderRadius: 18, border: `3px solid ${n > 1 ? C.red : 'rgba(255,255,255,0.35)'}`,
          background: 'rgba(7,11,16,0.9)', fontFamily: FONT, fontWeight: 800, fontSize: 38, color: '#fff',
          transform: `scale(${n > 1 ? 1 + 0.25 * (1 - cPop) : 1})`}}>
          <span>{n > 1 ? 'חוזים' : 'חוזה'}</span>
          <span style={{...mono, color: n > 1 ? C.red : '#fff', fontSize: 48}}>{'x' + n}</span>
        </div>
        {/* moving-the-stop pill with the real reason */}
        {moved && (
          <div style={{position: 'absolute', top: stopY + 14, right: 150, direction: 'rtl', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
            transform: `scale(${pill})`, transformOrigin: 'right top'}}>
            <div style={{padding: '6px 20px', borderRadius: 40, background: C.red, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 36}}>מזיז סטופ</div>
            <div style={{color: '#ffd0d5', fontFamily: FONT, fontWeight: 700, fontSize: 30, textShadow: SHADOW}}>כי כואב לממש הפסד</div>
          </div>
        )}
        {t >= 13.55 && (
          <div style={{position: 'absolute', top: Y(-52) - 110, left: X(13.55) - 120, direction: 'rtl', padding: '6px 20px', borderRadius: 40,
            background: C.gold, color: C.ink, fontFamily: FONT, fontWeight: 900, fontSize: 34, transform: `scale(${pop(Math.round((t - 13.55) * FPS), 0, 12)})`}}>
            עוד עסקה
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- captions ----------
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const chunk = CHUNKS.find((c) => t >= c.from && t < c.to);
  if (!chunk) return null;
  return (
    <div style={{position: 'absolute', top: 1190, left: 90, width: 850, display: 'flex', justifyContent: 'center'}}>
      <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 26, rowGap: 0, maxWidth: 850}}>
        {chunk.words.map((w, i) => {
          const at = F(w.t);
          const base: React.CSSProperties = {fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.15, display: 'inline-block'};
          if (frame < at) return <span key={i} style={{...base, visibility: 'hidden'}}>{w.w}</span>;
          const p = pop(frame, at, 12);
          const next = chunk.words[i + 1];
          const active = !next || frame < F(next.t);
          return (
            <span key={i} style={{...base, color: w.c ?? C.white, textShadow: SHADOW, transformOrigin: '50% 60%',
              transform: `scale(${(0.8 + 0.2 * p) * (active ? 1.03 : 1)}) translateY(${(1 - p) * 16}px)`}}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- rules card ----------
const RULES = [
  {at: 14.385, icon: IC.lock, ic: C.green, text: 'סטופ קשיח בפלטפורמה'},
  {at: 16.005, icon: IC.up, ic: C.green, text: 'זז רק לכיוון הרווח'},
  {at: 17.805, icon: IC.ban, ic: C.red, text: 'לא מוסיפים להפסד'},
  {at: 20.145, icon: IC.power, ic: C.gold, text: 'מקס-לוס יומי? סוגרים להיום'},
];
const RulesCard: React.FC = () => {
  const frame = useCurrentFrame() + F(14.285);
  const title = pop(frame, F(14.3), 13);
  return (
    <div style={{position: 'absolute', top: 1108, right: 150, width: 850, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6}}>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.15,
        color: C.gold, textShadow: SHADOW, opacity: title, transform: `translateX(${(1 - title) * 40}px)`}}>
        <Icon d={IC.shield} size={48} color={C.gold} stroke={2.6} />
        <span>הכללים לפני כל עסקה</span>
      </div>
      {RULES.map((r, i) => {
        const at = F(r.at);
        if (frame < at) return <div key={i} style={{height: 70}} />;
        const p = pop(frame, at, 12);
        const next = RULES[i + 1];
        const active = !next || frame < F(next.at);
        return (
          <div key={i} style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 16, height: 70, fontFamily: FONT, fontWeight: 800, fontSize: 56,
            color: '#fff', textShadow: SHADOW, opacity: (active ? 1 : 0.78) * Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 60}px) scale(${active ? 1 : 0.97})`, transformOrigin: 'right center'}}>
            <Icon d={r.icon} size={50} color={r.ic} stroke={2.8} />
            <span>{r.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- CTA (numbered comment poll) ----------
const Badge: React.FC<{n: string; color: string}> = ({n, color}) => (
  <div style={{width: 64, height: 64, borderRadius: 32, background: color, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: FONT, fontWeight: 900, fontSize: 42, flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>{n}</div>
);
const Cta: React.FC = () => {
  const frame = useCurrentFrame() + F(24.665);
  const a = pop(frame, F(24.7), 12);
  const r1 = pop(frame, F(25.625), 12);
  const r2 = pop(frame, F(26.985), 12);
  const fl = pop(frame, F(28.3), 11);
  const pulse = (at: number) => (frame >= F(at) && frame < F(at) + 10 ? 1 + 0.08 * Math.sin(((frame - F(at)) / 10) * Math.PI) : 1);
  const row = (p: number, at: number, extra: number): React.CSSProperties => ({
    direction: 'rtl', display: 'flex', alignItems: 'center', gap: 18, padding: '8px 26px 8px 14px', borderRadius: 50,
    background: 'rgba(7,11,16,0.6)', border: '2px solid rgba(255,255,255,0.25)', fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.15, color: '#fff',
    opacity: frame < F(at) ? 0 : p, transform: `scale(${(0.7 + 0.3 * p) * extra})`,
  });
  return (
    <div style={{position: 'absolute', top: 1112, left: 70, width: 870, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 900, fontSize: 60, lineHeight: 1.1, color: '#fff', textShadow: SHADOW,
        opacity: frame < F(24.7) ? 0 : a, transform: `scale(${0.7 + 0.3 * a})`}}>
        <Icon d={IC.msg} size={54} color={C.gold} />
        <span>כתבו בתגובות:</span>
      </div>
      <div style={row(r1, 25.625, pulse(26.145))}><Badge n="1" color={C.gold} /><span>הזזתי סטופ השבוע</span></div>
      <div style={row(r2, 26.985, pulse(28.305))}><Badge n="2" color={C.green} /><span>הסטופ שלי קשיח</span></div>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 30px', borderRadius: 60, marginTop: 4,
        background: '#FE2C55', fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        opacity: frame < F(28.3) ? 0 : fl, transform: `scale(${0.6 + 0.4 * fl})`}}>
        <Icon d={IC.plus} size={38} color="#fff" stroke={3.2} />
        <span>עקבו לעוד פסיכולוגיית מסחר</span>
      </div>
    </div>
  );
};

// ---------- AI disclosure chip ----------
const AiChip: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, F(3.4) - 8, F(3.4)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 246, left: 0, width: 960, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{direction: 'rtl', padding: '8px 22px', borderRadius: 40, background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.3)',
        fontFamily: FONT, fontWeight: 700, fontSize: 32, color: 'rgba(255,255,255,0.92)'}}>
        {'קול ופנים: '}<span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>AI</span>
      </div>
    </div>
  );
};

// ---------- root ----------
export const Reel2: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const capBand = CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b) || (t >= 14.285 && t < 29.065);
  const flashAt = [F(2.23), F(9.115), F(29.065)];
  const flash = flashAt.reduce((m, at) => (frame >= at && frame < at + 3 ? Math.max(m, interpolate(frame, [at, at + 3], [0.5, 0])) : m), 0);
  return (
    <AbsoluteFill style={{backgroundColor: C.ink}}>
      {SHOTS.map((s) => (
        <Sequence key={s.id} from={F(s.from)} durationInFrames={F(s.to) - F(s.from)}>
          {s.id === 'chart' ? <ChartPanel mode="full" /> : s.id === 'flash' ? <ChartPanel mode="flash" /> : <VideoShot s={s} />}
        </Sequence>
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(130% 90% at 50% 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '540px 960px',
        backgroundPosition: `${(frame * 37) % 540}px ${(frame * 53) % 960}px`, opacity: 0.5, mixBlendMode: 'overlay'}} />
      {capBand && (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 54%, rgba(0,0,0,0.35) 64%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 86%)'}} />
      )}
      {/* hook: the punchline first */}
      <Sequence from={0} durationInFrames={F(2.23)}>
        <BigText from={0} top={1105} gap={14} lines={[
          {pre: 'באנו', text: 'לסחור,', at: 0.13, size: 116, color: C.white, strikeAt: 0.94},
          {text: 'התחלנו להמר.', at: 1.28, size: 142, color: C.red, slam: true},
        ]} />
      </Sequence>
      {/* "even when it isn't" over the green illusion */}
      <Sequence from={F(7.75)} durationInFrames={F(9.115) - F(7.75)}>
        <BigText from={7.75} top={1070} gap={0} lines={[
          {text: 'גם כשזה', at: 8.205, size: 120, color: C.white},
          {text: 'לא.', at: 8.775, size: 200, color: C.red, slam: true},
        ]} />
      </Sequence>
      <Sequence from={F(3.955)} durationInFrames={F(4.95) - F(3.955)}>
        <BigText from={3.955} top={470} gap={0} lines={[
          {text: 'בשביל', at: 3.955, size: 104, color: C.white},
          {text: 'הריגוש', at: 4.295, size: 150, color: C.gold, slam: true},
        ]} />
      </Sequence>
      <Sequence from={F(3.03)} durationInFrames={F(3.4)}><AiChip /></Sequence>
      <Sequence from={F(14.285)} durationInFrames={F(22.525) - F(14.285)}><RulesCard /></Sequence>
      <Sequence from={F(22.525)} durationInFrames={F(24.665) - F(22.525)}>
        <BigText from={22.525} top={1175} gap={8} lines={[
          {text: 'גם לא לעשות כלום', at: 22.745, size: 96, color: C.white},
          {text: 'זאת החלטה.', at: 23.705, size: 136, color: C.gold, slam: true},
        ]} />
      </Sequence>
      <Sequence from={F(24.665)} durationInFrames={F(29.065) - F(24.665)}><Cta /></Sequence>
      <Captions />
      {flash > 0 && <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />}
    </AbsoluteFill>
  );
};

export {TOTAL_FRAMES};
