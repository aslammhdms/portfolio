import { useCallback, useRef } from 'react';
import { useScroll } from 'framer-motion';
import { useInViewport } from '../../hooks/useInViewport';
import VideoBackdrop from './VideoBackdrop';
import type { Clip } from '../../scenes/clips';
import type { EngineMode } from '../../hooks/useEngineMode';

interface ScrollSceneProps {
  clip: Clip;
  mode: EngineMode;
  /** Add extra scroll length so the video gets a longer cinematic scrub. */
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
 * for the section's full scroll range with no negative-margin hacks. The section
 * markup, its `id`, and every interactive widget inside it are untouched and sit
 * above the decorative, pointer-events-none backdrop — so useActiveSection,
 * hash-anchor nav, Navbar and StatusBar keep working exactly as before.
 */
export default function ScrollScene({ clip, mode, pin = false, children }: ScrollSceneProps) {
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
      <div className={`relative z-10 [grid-area:1/1] ${pin ? 'min-h-[170vh]' : ''}`}>{children}</div>
    </div>
  );
}
