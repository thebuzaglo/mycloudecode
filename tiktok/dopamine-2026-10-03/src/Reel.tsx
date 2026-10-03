import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {C, CHUNKS, FPS, HOOK_SEC, SHOTS, Shot, TOTAL_FRAMES, VO_END, f} from './timeline';

const FONT = "'Heebo', sans-serif";
const SHADOW = '0 4px 22px rgba(0,0,0,0.85), 0 2px 5px rgba(0,0,0,0.95)';
const CLIP_DUR: Record<string, number> = {
  'W1.mp4': 8.0, 'W2.mp4': 8.0, 'W3.mp4': 7.0, 'chart.mp4': 5.03, 'buy.mp4': 3.03,
  'casino.mp4': 4.03, 'stepaway.mp4': 5.03,
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

// ---------- small helpers ----------
const pop = (frame: number, at: number, damping = 13) =>
  spring({frame: frame - at, fps: FPS, config: {damping, stiffness: 210, mass: 0.6}});

const Icon: React.FC<{d: string[]; size: number; color: string; stroke?: number}> = ({d, size, color, stroke = 2.4}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.8))'}}>
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const IC = {
  check: ['M20 6 9 17l-5-5'],
  zap: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
  msg: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  plus: ['M5 12h14', 'M12 5v14'],
  rewind: ['M11 19 2 12l9-7v14z', 'M22 19l-9-7 9-7v14z'],
};

// ---------- video shots ----------
const VideoShot: React.FC<{s: Shot}> = ({s}) => {
  const frame = useCurrentFrame(); // local to sequence
  const len = f(s.to) - f(s.from);
  const rate = s.rate ?? 1;
  const [z0, z1] = s.zoom ?? [1, 1];
  let scale = interpolate(frame, [0, len], [z0, z1], {extrapolateRight: 'clamp'});
  // entry punch on every cut
  scale += 0.05 * Math.exp(-frame / 3.2) * (s.kind === 'broll' ? 1 : 0.6);
  for (const p of s.punch ?? []) {
    const pf = f(p) - f(s.from);
    if (frame >= pf) scale += 0.035 * Math.exp(-(frame - pf) / 4) + 0.02 * Math.min(1, (frame - pf) / 6);
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

// ---------- hook (clip from the previous dopamine video) ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const len = Math.round(HOOK_SEC * FPS);
  const freezeAt = 67; // the source clip freezes on its last frame from here
  const glitchIn = frame < 5;
  const glitchOut = frame >= len - 4;
  const zoom = frame >= freezeAt ? interpolate(frame, [freezeAt, len], [1.0, 1.07]) : 1;
  const sat = frame >= freezeAt ? interpolate(frame, [freezeAt, len], [1, 0.35]) : 1;
  const shift = glitchIn ? (5 - frame) * 9 : glitchOut ? (frame - (len - 4)) * 12 : 0;
  const chip = pop(frame, 2, 16);
  const vid = (style: React.CSSProperties = {}) => (
    <OffthreadVideo src={staticFile('media/hook.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
  );
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: `saturate(${sat})`}}>{vid()}</AbsoluteFill>
      {shift > 0 && (
        <>
          <AbsoluteFill style={{transform: `translateX(${shift}px)`, mixBlendMode: 'screen', opacity: 0.55, filter: 'sepia(1) hue-rotate(-50deg) saturate(6)'}}>{vid()}</AbsoluteFill>
          <AbsoluteFill style={{transform: `translateX(${-shift}px)`, mixBlendMode: 'screen', opacity: 0.55, filter: 'sepia(1) hue-rotate(150deg) saturate(6)'}}>{vid()}</AbsoluteFill>
        </>
      )}
      {/* scanlines for the "replay" feel */}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)'}} />
      <div style={{position: 'absolute', top: 252, left: 0, width: 960, display: 'flex', justifyContent: 'center'}}>
        <div style={{
          direction: 'rtl', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px',
          borderRadius: 60, background: 'rgba(0,0,0,0.42)', border: '2px solid rgba(255,255,255,0.35)',
          transform: `scale(${0.7 + 0.3 * chip})`, opacity: chip, fontFamily: FONT, fontWeight: 700,
          fontSize: 44, color: '#fff', textShadow: SHADOW,
        }}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.red, opacity: frame % 20 < 12 ? 1 : 0.3}} />
          <span>מהסרטון הקודם שלי</span>
          <Icon d={IC.rewind} size={40} color="#fff" stroke={2.2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- big kinetic text blocks ----------
type Line = {text: string; pre?: string; at: number; size: number; color: string; weight?: number; strikeAt?: number; slam?: boolean; icon?: string[]};
const BigText: React.FC<{lines: Line[]; top: number; from: number; gap?: number}> = ({lines, top, from, gap = 6}) => {
  const frame = useCurrentFrame() + f(from); // absolute frame
  return (
    <div style={{position: 'absolute', top, left: 70, width: 870, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
      {lines.map((l, i) => {
        const at = f(l.at);
        const p = pop(frame, at, l.slam ? 9 : 13);
        const shake = l.slam && frame >= at && frame < at + 8 ? Math.sin((frame - at) * 2.3) * (8 - (frame - at)) * 1.6 : 0;
        const strike = l.strikeAt !== undefined ? interpolate(frame, [f(l.strikeAt), f(l.strikeAt) + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 0;
        return (
          <div key={i} style={{
            direction: 'rtl', display: 'flex', alignItems: 'center', gap: 18, position: 'relative',
            fontFamily: FONT, fontWeight: l.weight ?? 900, fontSize: l.size, lineHeight: 1.08, color: l.color,
            textShadow: SHADOW, letterSpacing: -1,
            opacity: frame < at ? 0 : Math.min(1, p * 1.4),
            transform: `translateX(${shake}px) scale(${frame < at ? 0.5 : (l.slam ? 1.25 - 0.25 * p : 0.7 + 0.3 * p)})`,
          }}>
            {l.icon && <Icon d={l.icon} size={l.size * 0.72} color={l.color} stroke={3} />}
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

// ---------- chart panel (stop-loss drift, adding contracts, more entries) ----------
const lerpKeys = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      const k = (t - t0) / (t1 - t0);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      return v0 + (v1 - v0) * e;
    }
  }
  return keys[keys.length - 1][1];
};
const fmtUsd = (v: number) => {
  const n = Math.round(Math.abs(v) / 10) * 10;
  return (v >= 0 ? '+' : '-') + '$' + n.toLocaleString('en-US');
};

const ChartPanel: React.FC = () => {
  const local = useCurrentFrame();
  const t = 8.45 + local / FPS; // vo time
  const T0 = 8.45, T1 = 13.55;
  const X0 = 250, X1 = 900;
  const ENTRY = 720, TP = 560, STOP0 = 840;
  const priceAt = (x: number) => {
    const k = (x - X0) / (X1 - X0);
    const trend = k < 0.12 ? ENTRY - 260 * k : ENTRY - 31 + (k - 0.12) * 340;
    const noise = Math.sin(x * 0.11) * 9 + Math.sin(x * 0.037 + 1.3) * 14 + Math.sin(x * 0.23) * 4;
    return trend + noise;
  };
  const head = X0 + (X1 - X0) * Math.min(1, Math.max(0, (t - T0) / (T1 - T0)));
  const pts: string[] = [];
  for (let x = X0; x <= head; x += 6) pts.push(`${x.toFixed(1)},${priceAt(x).toFixed(1)}`);
  const stopY = lerpKeys(t, [[9.4, STOP0], [9.95, 960], [10.05, 960], [10.5, 1045]]);
  const moved = t > 9.4;
  const pnl = lerpKeys(t, [[8.45, 420], [9.2, 160], [10.0, -310], [10.7, -420], [11.6, -840], [12.05, -1240], [12.9, -2050], [13.6, -2980]]);
  const contracts = t < 11.42 ? 1 : t < 11.62 ? 2 : 4;
  const cPop = pop(local, f(t < 11.62 ? 11.42 : 11.62) - f(8.45), 9);
  const pnlColor = pnl >= 0 ? C.green : C.red;
  const panelIn = interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  const entries = [12.9, 13.2].filter((e) => t >= e).map((e) => {
    const x = X0 + (X1 - X0) * ((e - T0) / (T1 - T0));
    return {x, y: priceAt(x), a: pop(local, f(e) - f(8.45), 10)};
  });
  const pill = pop(local, f(9.45) - f(8.45), 12);
  const pill2 = pop(local, f(12.9) - f(8.45), 12);
  const mono: React.CSSProperties = {fontFamily: FONT, fontVariantNumeric: 'tabular-nums', direction: 'ltr', unicodeBidi: 'isolate'};
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 70% at 50% 40%, #0F1820 0%, #070B10 70%)', opacity: panelIn}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 9}).map((_, i) => (
          <line key={'h' + i} x1={90} x2={990} y1={480 + i * 75} y2={480 + i * 75} stroke="rgba(255,255,255,0.05)" />
        ))}
        {Array.from({length: 8}).map((_, i) => (
          <line key={'v' + i} y1={460} y2={1100} x1={110 + i * 112} x2={110 + i * 112} stroke="rgba(255,255,255,0.04)" />
        ))}
        <line x1={90} x2={990} y1={TP} y2={TP} stroke={C.green} strokeDasharray="14 10" strokeWidth={3} opacity={0.8} />
        <line x1={90} x2={990} y1={ENTRY} y2={ENTRY} stroke="#cfd8e3" strokeDasharray="4 9" strokeWidth={3} opacity={0.7} />
        {moved && <line x1={90} x2={990} y1={STOP0} y2={STOP0} stroke={C.red} strokeDasharray="10 12" strokeWidth={3} opacity={0.28} />}
        <line x1={90} x2={990} y1={stopY} y2={stopY} stroke={C.red} strokeDasharray="14 10" strokeWidth={4} />
        <polyline points={pts.join(' ')} fill="none" stroke={pnl >= 0 ? C.green : C.red} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round"
          style={{filter: `drop-shadow(0 0 12px ${pnl >= 0 ? 'rgba(46,229,157,0.6)' : 'rgba(255,77,94,0.6)'})`}} />
        <circle cx={head} cy={priceAt(head)} r={11} fill="#fff" />
        <polygon points={`${X0 + 20},${ENTRY + 36} ${X0 + 36},${ENTRY + 10} ${X0 + 52},${ENTRY + 36}`} fill={C.green} />
        {entries.map((e, i) => (
          <polygon key={i} transform={`translate(${e.x} ${e.y + 30}) scale(${e.a})`} points="-18,26 0,-6 18,26" fill={C.gold} />
        ))}
        {moved && t < 10.6 && (
          <path d={`M 860 ${STOP0 + 18} L 860 ${stopY - 22}`} stroke={C.red} strokeWidth={5} markerEnd="url(#arr)" opacity={0.9} />
        )}
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={C.red} />
          </marker>
        </defs>
      </svg>
      {/* line labels (small, LTR, left side) */}
      <div style={{position: 'absolute', left: 104, top: TP - 46, color: C.green, fontSize: 30, fontWeight: 800, ...mono}}>TP</div>
      <div style={{position: 'absolute', left: 104, top: ENTRY - 46, color: '#cfd8e3', fontSize: 30, fontWeight: 800, ...mono}}>ENTRY</div>
      <div style={{position: 'absolute', left: 104, top: stopY - 46, color: C.red, fontSize: 30, fontWeight: 800, ...mono}}>STOP</div>
      {/* P&L */}
      <div style={{position: 'absolute', top: 300, width: 960, textAlign: 'center', fontSize: 128, fontWeight: 900, color: pnlColor, textShadow: `0 0 30px ${pnl >= 0 ? 'rgba(46,229,157,0.35)' : 'rgba(255,77,94,0.4)'}`, ...mono}}>
        {fmtUsd(pnl)}
      </div>
      {/* contracts badge */}
      <div style={{position: 'absolute', top: 592, right: 150, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 24px', borderRadius: 18, border: `3px solid ${contracts > 1 ? C.red : 'rgba(255,255,255,0.35)'}`,
        background: 'rgba(7,11,16,0.85)', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#fff',
        transform: `scale(${contracts > 1 ? 1 + 0.25 * (1 - cPop) : 1})`}}>
        <span>חוזים</span>
        <span style={{...mono, color: contracts > 1 ? C.red : '#fff', fontSize: 52}}>{'x' + contracts}</span>
      </div>
      {/* "moving the stop" pill */}
      {moved && (
        <div style={{position: 'absolute', top: stopY + 18, right: 160, direction: 'rtl', padding: '8px 22px', borderRadius: 40,
          background: C.red, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 38, transform: `scale(${pill})`, transformOrigin: 'right center'}}>
          מזיז סטופ
        </div>
      )}
      {t >= 12.9 && (
        <div style={{position: 'absolute', top: 862, right: 210, direction: 'rtl', padding: '8px 22px', borderRadius: 40,
          background: C.gold, color: C.ink, fontFamily: FONT, fontWeight: 900, fontSize: 38, transform: `scale(${pill2})`, transformOrigin: 'center bottom'}}>
          עוד עסקה
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- captions (word-by-word reveal) ----------
const HIDE: [number, number][] = [[-99, 1.4], [13.7, 16.1], [18.45, 21.6], [25.25, 99]];
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS - HOOK_SEC;
  if (HIDE.some(([a, b]) => t >= a && t < b)) return null;
  const chunk = CHUNKS.find((c) => t >= c.from && t < c.to);
  if (!chunk) return null;
  return (
    <div style={{position: 'absolute', top: 1190, left: 90, width: 850, display: 'flex', justifyContent: 'center'}}>
      <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 22, rowGap: 0, maxWidth: 850}}>
        {chunk.words.map((w, i) => {
          const at = f(w.t);
          if (frame < at) return <span key={i} style={{visibility: 'hidden', fontFamily: FONT, fontWeight: 800, fontSize: 82}}>{w.w}</span>;
          const p = pop(frame, at, 12);
          const next = chunk.words[i + 1];
          const active = !next || frame < f(next.t);
          return (
            <span key={i} style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.15, color: w.c ?? C.white,
              textShadow: SHADOW, display: 'inline-block',
              transform: `scale(${(0.75 + 0.25 * p) * (active ? 1.06 : 1)}) translateY(${(1 - p) * 18}px)`,
            }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- CTA ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame() + f(27.3);
  const a = pop(frame, f(27.45), 12);
  const b = pop(frame, f(28.66), 12);
  const c = pop(frame, f(29.72), 11);
  const press = frame >= f(30.35) && frame < f(30.35) + 8 ? 1 - 0.07 * Math.sin(((frame - f(30.35)) / 8) * Math.PI) : 1;
  return (
    <div style={{position: 'absolute', top: 1135, left: 70, width: 870, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
      <div style={{direction: 'rtl', fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: '#fff', textShadow: SHADOW,
        opacity: frame < f(27.45) ? 0 : a, transform: `scale(${0.7 + 0.3 * a})`}}>
        מכירים את <span style={{color: C.gold}}>ההרגשה?</span>
      </div>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 34px', borderRadius: 60,
        border: `3px solid ${C.gold}`, background: 'rgba(7,11,16,0.55)', fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.15, color: '#fff',
        opacity: frame < f(28.66) ? 0 : b, transform: `scale(${0.6 + 0.4 * b})`}}>
        <Icon d={IC.msg} size={52} color={C.gold} />
        <span>ספרו בתגובות</span>
      </div>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 36px', borderRadius: 60,
        background: '#FE2C55', fontFamily: FONT, fontWeight: 800, fontSize: 50, lineHeight: 1.15, color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        opacity: frame < f(29.72) ? 0 : c, transform: `scale(${(0.6 + 0.4 * c) * press})`}}>
        <Icon d={IC.plus} size={46} color="#fff" stroke={3.2} />
        <span>עקבו לעוד פסיכולוגיית מסחר</span>
      </div>
    </div>
  );
};

// ---------- root reel ----------
export const Reel: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const hookLen = Math.round(HOOK_SEC * FPS);
  const flash = frame >= hookLen && frame < hookLen + 3 ? interpolate(frame, [hookLen, hookLen + 3], [0.55, 0]) : 0;
  return (
    <AbsoluteFill style={{backgroundColor: C.ink}}>
      <Sequence from={0} durationInFrames={hookLen}><Hook /></Sequence>
      {SHOTS.map((s) => (
        <Sequence key={s.id} from={f(s.from)} durationInFrames={f(s.to) - f(s.from)}>
          {s.id === 'S5' ? <ChartPanel /> : <VideoShot s={s} />}
        </Sequence>
      ))}
      {/* vignette + grain over picture, under graphics */}
      <AbsoluteFill style={{background: 'radial-gradient(130% 90% at 50% 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '540px 960px',
        backgroundPosition: `${(frame * 37) % 540}px ${(frame * 53) % 960}px`, opacity: 0.5, mixBlendMode: 'overlay'}} />
      {/* readability gradient behind the caption band */}
      {frame >= hookLen && (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 66%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 86%)'}} />
      )}
      {/* S1: hook question */}
      <Sequence from={f(0)} durationInFrames={f(1.35) - f(0)}>
        <BigText from={0} top={1060} lines={[
          {text: 'מכורים', at: 0.04, size: 150, color: C.white},
          {text: 'לגרף?', at: 0.5, size: 178, color: C.green, slam: true},
        ]} />
      </Sequence>
      {/* S6: trader -> gambler */}
      <Sequence from={f(13.7)} durationInFrames={f(15.98) - f(13.7)}>
        <BigText from={13.7} top={1110} gap={14} lines={[
          {pre: 'באנו', text: 'לסחור,', at: 13.85, size: 112, color: C.white, strikeAt: 14.66},
          {text: 'התחלנו להמר.', at: 15.0, size: 138, color: C.red, slam: true},
        ]} />
      </Sequence>
      {/* S7: plan or thrill */}
      <Sequence from={f(18.5)} durationInFrames={f(21.45) - f(18.5)}>
        <BigText from={18.5} top={1160} gap={0} lines={[
          {text: 'אני פועל לפי', at: 18.56, size: 54, color: C.white, weight: 800},
          {text: 'התוכנית', at: 19.28, size: 96, color: C.green, icon: IC.check},
          {text: 'או רק מחפש', at: 19.82, size: 54, color: C.white, weight: 800},
          {text: 'ריגוש?', at: 20.6, size: 102, color: C.gold, icon: IC.zap, slam: true},
        ]} />
      </Sequence>
      {/* S10: doing nothing is a decision */}
      <Sequence from={f(25.25)} durationInFrames={f(27.3) - f(25.25)}>
        <BigText from={25.25} top={1175} gap={8} lines={[
          {text: 'גם לא לעשות כלום', at: 25.48, size: 96, color: C.white},
          {text: 'זאת החלטה.', at: 26.44, size: 136, color: C.gold, slam: true},
        ]} />
      </Sequence>
      {/* S11: CTA */}
      <Sequence from={f(27.3)} durationInFrames={TOTAL_FRAMES - f(27.3)}><Cta /></Sequence>
      <Captions />
      {flash > 0 && <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />}
    </AbsoluteFill>
  );
};

export {VO_END};
