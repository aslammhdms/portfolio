import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * How a scene's video backdrop should behave:
 *  - 'scrub'  — desktop, fine pointer: frames advance/reverse with scroll position.
 *  - 'loop'   — touch / coarse pointer / iOS: autoplay-muted-looping ambient video
 *               (scrubbing on touch is poor, so we play it instead).
 *  - 'poster' — reduced motion / reduced data / slow link / no codec: a still image only.
 */
export type EngineMode = 'scrub' | 'loop' | 'poster';

function mql(query: string): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches;
}

function detectMode(reduce: boolean | null): EngineMode {
  if (typeof window === 'undefined') return 'poster';

  // Respect explicit user preferences first — these always win.
  if (reduce) return 'poster';
  if (mql('(prefers-reduced-data: reduce)')) return 'poster';

  // Metered / very slow connections: never pull multi-MB video.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn && (conn.saveData || /(^|[^4])2g/.test(conn.effectiveType ?? ''))) return 'poster';

  // No codec support at all → fall back to the still poster.
  const probe = document.createElement('video');
  const canMp4 = probe.canPlayType('video/mp4; codecs="avc1.42E01E"');
  const canWebm = probe.canPlayType('video/webm; codecs="vp9"');
  if (!canMp4 && !canWebm) return 'poster';

  // Touch / coarse pointer / iOS: loop instead of scrub.
  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.userAgent) && 'ontouchend' in document); // iPadOS masquerades as Mac
  if (mql('(pointer: coarse)') || isIOS) return 'loop';

  return 'scrub';
}

/**
 * Single source of truth for video backdrop behaviour. Starts at 'poster'
 * (the safe, light default) and resolves to the real mode after mount, so the
 * first paint never blocks on heavy video. Re-evaluates when the reduced-motion
 * preference changes or the viewport is resized (e.g. a 2-in-1 toggling pointer).
 */
export function useEngineMode(): EngineMode {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<EngineMode>('poster');

  useEffect(() => {
    const update = () => setMode(detectMode(reduce));
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [reduce]);

  return mode;
}
