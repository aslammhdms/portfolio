import { useEffect, useRef } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

const LERP = 0.12; // easing toward the target time — lower = smoother/laggier
const EPSILON = 1 / 50; // skip seeks smaller than this (seconds) to avoid decoder thrash

/**
 * Drives `video.currentTime` from a scroll progress MotionValue (0→1).
 *
 * A single requestAnimationFrame loop lerps a "current" cursor toward the latest
 * scroll target and writes `currentTime` only when the delta is meaningful — at
 * most one seek per frame. This is the classic Apple-style scroll-scrub; smooth
 * playback depends on the clip being encoded with frequent keyframes (see the
 * ffmpeg pipeline). No-ops cleanly when disabled or before metadata loads.
 */
export function useScrollScrub(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  progress: MotionValue<number>,
  enabled: boolean,
  durationHint = 0,
) {
  const target = useRef(0);
  const current = useRef(0);

  useMotionValueEvent(progress, 'change', (v) => {
    target.current = Math.min(1, Math.max(0, v));
  });

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 1 /* HAVE_METADATA */) {
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : durationHint;
        if (duration > 0) {
          current.current += (target.current - current.current) * LERP;
          const t = current.current * duration;
          if (Math.abs(t - video.currentTime) > EPSILON) {
            try {
              video.currentTime = t;
            } catch {
              /* seeking can throw mid-load on some browsers — ignore and retry next frame */
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, videoRef, durationHint]);
}
