import { useEffect, useRef, useState } from 'react';
import { asset, coreStack, now, profile } from '../content';

/**
 * The two terminal outputs that are not plain text: `neofetch` (a portrait drawn
 * on a canvas next to real facts) and `fonts` (a live width-axis sample of the name).
 */

const COLS = 44;
const ROWS = 56;
/** The face, cropped out of the 128 x 171 photo (same proportions as the grid). */
const CROP = { x: 14, y: 6, w: 100, h: 127 };
const CELL = 3;
/** 4x4 ordered-dither thresholds, so a few tones still carry the face. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** The real photo, redrawn as chunky square cells in the page's own ink (Cascadia has no half-block glyphs). */
function PixelPortrait() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const small = document.createElement('canvas');
      small.width = COLS;
      small.height = ROWS;
      const sctx = small.getContext('2d', { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(img, (CROP.x / 128) * img.naturalWidth, (CROP.y / 171) * img.naturalHeight, (CROP.w / 128) * img.naturalWidth, (CROP.h / 171) * img.naturalHeight, 0, 0, COLS, ROWS);
      const { data } = sctx.getImageData(0, 0, COLS, ROWS);
      const lum: number[] = [];
      for (let i = 0; i < data.length; i += 4) lum.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
      // Stretch the tones so the face uses the whole range.
      const sorted = [...lum].sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.04)];
      const hi = sorted[Math.floor(sorted.length * 0.97)];
      const style = getComputedStyle(document.documentElement);
      const channels = (name: string) => style.getPropertyValue(name).trim().split(/\s+/).map(Number);
      const bg = channels('--surface');
      const fg = channels('--ink');
      ctx.fillStyle = `rgb(${bg.join(',')})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const LEVELS = 5;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const t = Math.pow(Math.min(1, Math.max(0, (lum[y * COLS + x] - lo) / (hi - lo || 1))), 1.35);
          // Half-strength dither: enough to break up bands, not enough to turn the wall into noise.
          const threshold = 0.25 + ((BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16) * 0.5;
          const level = Math.min(LEVELS - 1, Math.floor(t * (LEVELS - 1) + threshold));
          if (level === 0) continue;
          const a = (level / (LEVELS - 1)) * 0.95;
          ctx.fillStyle = `rgba(${fg.join(',')},${a.toFixed(2)})`;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    };
    img.src = asset('images/aslam-128.webp');
    return () => {
      cancelled = true;
    };
  }, []);

  return <canvas ref={ref} className="t-portrait" width={COLS * CELL} height={ROWS * CELL} role="img" aria-label="A pixelated portrait of Aslam" />;
}

export function Neofetch() {
  const facts: [string, string][] = [
    ['Role', profile.title],
    ['Now', now.short],
    ['Where', `${profile.location.short} (${profile.residency})`],
    ['Years', profile.experienceSummary.long],
    ['Core', coreStack.map((s) => s.label).join(' · ')],
    ['Site', window.location.host],
    ['Email', profile.email],
  ];
  return (
    <div className="t-fetch">
      <PixelPortrait />
      <dl className="t-facts">
        <div className="t-facts-head">
          <dt className="sr-only">User</dt>
          <dd>aslam@auh</dd>
        </div>
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The name in AM Display, with its width axis under the visitor's hand (weight follows, as in the lock-in). */
export function FontsSample() {
  const [wdth, setWdth] = useState(100);
  const wght = Math.round(300 + ((wdth - 75) / 50) * 560);
  return (
    <div className="t-font">
      <p className="t-font-sample" style={{ fontStretch: `${wdth}%`, fontWeight: wght }} lang="en">
        {profile.name}
      </p>
      <label className="t-font-axis">
        <span>width</span>
        <input type="range" min={75} max={125} step={1} value={wdth} onChange={(e) => setWdth(Number(e.target.value))} />
        <output>
          wdth {wdth} · wght {wght}
        </output>
      </label>
    </div>
  );
}
