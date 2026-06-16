import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScrollScrub } from '../../hooks/useScrollScrub';
import type { EngineMode } from '../../hooks/useEngineMode';
import type { Clip, SceneTint } from '../../scenes/clips';

interface VideoBackdropProps {
  clip: Clip;
  mode: EngineMode;
  /** Scroll progress (0→1) for the parent scene; drives currentTime in scrub mode. */
  progress: MotionValue<number>;
  /** Whether the scene is near the viewport — gates real video decode. */
  active: boolean;
}

/** Radial tint per scene, layered over the footage to hold the palette. */
const TINTS: Record<SceneTint, string> = {
  indigo:
    'radial-gradient(60% 55% at 70% 25%, rgb(var(--accent) / 0.18), transparent 70%)',
  teal: 'radial-gradient(60% 55% at 30% 30%, rgb(var(--signal) / 0.14), transparent 70%)',
  duo: 'radial-gradient(50% 50% at 25% 30%, rgb(var(--signal) / 0.14), transparent 70%), radial-gradient(55% 50% at 78% 28%, rgb(var(--accent) / 0.16), transparent 70%)',
};

/**
 * Full-bleed scene backdrop. Layers, back to front:
 *   1. an on-brand CSS placeholder (always present — the deepest fallback);
 *   2. the poster still (hidden if it fails to load);
 *   3. the <video> (scrub or loop; only when the scene is active; hidden on error);
 *   4. the Terminal Ink scrim (darkening + tint + dotted grid + vignette) so any
 *      footage reads on-brand and overlaid text stays legible.
 * Always decorative: pointer-events-none + aria-hidden on the parent.
 */
export default function VideoBackdrop({ clip, mode, progress, active }: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const showVideo = active && mode !== 'poster' && !videoFailed;
  const isScrub = mode === 'scrub';

  useScrollScrub(videoRef, progress, showVideo && isScrub && videoReady, clip.durationHint);

  // Reset readiness when the video unmounts (scene leaves the viewport) so it
  // fades in cleanly next time and the decoder is released in between.
  useEffect(() => {
    if (!showVideo) setVideoReady(false);
  }, [showVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 1 — CSS placeholder (drifting accent gradient + grid) */}
      <div className={`absolute inset-0 scene-placeholder scene-placeholder--${clip.tint}`} />

      {/* 2 — poster still */}
      {!posterFailed && (
        <img
          src={clip.poster}
          alt=""
          decoding="async"
          onError={() => setPosterFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* 3 — video (scrub or loop) */}
      {showVideo && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload={isScrub ? 'auto' : 'metadata'}
          autoPlay={!isScrub}
          loop={!isScrub}
          poster={posterFailed ? undefined : clip.poster}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
          className={`scene-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      )}

      {/* 4 — Terminal Ink scrim */}
      <div className="absolute inset-0 bg-canvas/55" />
      <div className="absolute inset-0" style={{ backgroundImage: TINTS[clip.tint] }} />
      <div
        className="grid-bg absolute inset-0 opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 45%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 45%, black, transparent)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgb(var(--canvas) / 0.85) 100%)',
        }}
      />
    </div>
  );
}
