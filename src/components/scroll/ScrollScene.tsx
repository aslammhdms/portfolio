import { useCallback, useRef } from 'react';
import { useScroll } from 'framer-motion';
import { useInViewport } from '../../hooks/useInViewport';
import { useTheme } from '../../contexts/ThemeContext';
import VideoBackdrop from './VideoBackdrop';
import type { Clip } from '../../scenes/clips';
import type { EngineMode } from '../../hooks/useEngineMode';

interface ScrollSceneProps {
  clip: Clip;
  mode: EngineMode;
  /** Hold the section on screen with extra scroll length so the video scrubs through. */
  pin?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps a page section with a full-bleed video backdrop that sticks to the
 * viewport while the section scrolls past, scrubbing with scroll position.
 *
 * Layout: a single-cell CSS grid stacks the backdrop and the content in the
 * same area. The content (the real <section id> with its own padding) defines
 * the cell height; the backdrop is `sticky top-0 h-screen`, so it stays pinned
 * for the section's scroll range with no negative-margin hacks. Section markup,
 * its `id`, and every interactive widget inside it are untouched and sit above
 * the decorative, pointer-events-none backdrop — so useActiveSection, hash-anchor
 * nav, Navbar and StatusBar keep working exactly as before.
 *
 * `pin` (used by the hero) adds extra scroll length AND sticks the content too,
 * so the section holds on screen while the video scrubs behind it — instead of
 * scrolling away and leaving an empty gap. Pinning only applies in dark mode:
 * light mode has no video, so there's nothing to hold the scroll for.
 */
export default function ScrollScene({ clip, mode, pin = false, children }: ScrollSceneProps) {
  const { theme } = useTheme();
  const pinned = pin && theme === 'dark';

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInViewport();

  // Attach both the Framer Motion scroll target and the IntersectionObserver
  // callback ref to the same element.
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      sceneRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] });

  return (
    <div ref={setRefs} className="relative grid">
      <div
        className="scene-backdrop pointer-events-none sticky top-0 h-screen self-start overflow-hidden [grid-area:1/1]"
        aria-hidden="true"
      >
        <VideoBackdrop clip={clip} mode={mode} progress={scrollYProgress} active={inView} />
      </div>

      {pinned ? (
        <div className="relative z-10 min-h-[150vh] [grid-area:1/1]">
          <div className="sticky top-0">{children}</div>
        </div>
      ) : (
        <div className="relative z-10 [grid-area:1/1]">{children}</div>
      )}
    </div>
  );
}
