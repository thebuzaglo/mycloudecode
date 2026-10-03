import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const mode = process.argv[2] || 'stills';
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: 'Dopamine', browserExecutable});
if (mode === 'stills') {
  const frames = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
  for (const frame of frames) {
    await renderStill({serveUrl, composition, frame, output: `out/still_${String(frame).padStart(4, '0')}.png`, browserExecutable, imageFormat: 'png'});
    console.log('still', frame);
  }
} else {
  let last = -1;
  await renderMedia({serveUrl, composition, codec: 'h264', crf: 16, outputLocation: 'out/video_noaudio.mp4', browserExecutable,
    muted: true, concurrency: 4, imageFormat: 'jpeg', jpegQuality: 92, chromiumOptions: {gl: 'swangle'},
    onProgress: ({progress}) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; console.log('progress', (progress * 100).toFixed(0) + '%'); } }});
  console.log('done');
}
