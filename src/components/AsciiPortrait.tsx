import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const base = import.meta.env.BASE_URL;
const COLS = 64;
const CELL_W = 7.2;
const CELL_H = 13;
// Sparse → dense; index by luminance (inverted for the light theme).
const RAMP = ' .:-=+*#%@';

/**
 * Renders the profile photo as ASCII characters on a canvas; hovering,
 * focusing or tapping crossfades to the real photo underneath.
 */
export default function AsciiPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    const img = new Image();
    img.src = `${base}images/aslam.jpg`;

    const draw = () => {
      if (cancelled) return;
      const rows = Math.round((COLS * CELL_W * (5 / 4)) / CELL_H); // match 4:5 frame

      // Downsample the photo to one pixel per character cell.
      const off = document.createElement('canvas');
      off.width = COLS;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;
      const scale = Math.max(COLS / img.width, rows / img.height); // cover fit
      const dw = img.width * scale;
      const dh = img.height * scale;
      octx.drawImage(img, (COLS - dw) / 2, (rows - dh) / 2, dw, dh);
      const data = octx.getImageData(0, 0, COLS, rows).data;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(COLS * CELL_W * dpr);
      canvas.height = Math.round(rows * CELL_H * dpr);
      ctx.scale(dpr, dpr);

      const css = getComputedStyle(document.documentElement);
      const surface = `rgb(${css.getPropertyValue('--surface').trim()})`;
      const muted = `rgb(${css.getPropertyValue('--muted').trim()})`;
      const accent = `rgb(${css.getPropertyValue('--accent').trim()})`;

      ctx.fillStyle = surface;
      ctx.fillRect(0, 0, COLS * CELL_W, rows * CELL_H);
      ctx.font = `${CELL_H - 1}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';

      const invert = theme === 'light';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = (y * COLS + x) * 4;
          let lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          if (invert) lum = 1 - lum;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length))];
          if (ch === ' ') continue;
          ctx.fillStyle = lum > 0.82 ? accent : muted;
          ctx.fillText(ch, x * CELL_W, y * CELL_H);
        }
      }
    };

    // Wait for the mono font so the glyph grid lines up.
    img.onload = () => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(draw).catch(draw);
      } else {
        draw();
      }
    };

    return () => {
      cancelled = true;
    };
  }, [theme]);

  const toggle = () => setRevealed((v) => !v);

  return (
    <div
      className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-xl bg-surface"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      role="img"
      aria-label="Portrait of Aslam Muhammed, rendered as ASCII art — activate to reveal the photo"
      tabIndex={0}
    >
      <img
        src={`${base}images/aslam.jpg`}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          revealed ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span className="absolute bottom-2 right-2 rounded bg-canvas/70 px-2 py-0.5 font-mono text-[10px] text-faint backdrop-blur-sm">
        {revealed ? 'jpg' : 'ascii · hover'}
      </span>
    </div>
  );
}
