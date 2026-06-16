import { useInView } from 'react-intersection-observer';

/**
 * Thin wrapper over react-intersection-observer used to gate heavy work to the
 * scenes near the viewport. The generous default rootMargin mounts/decodes a
 * scene's `<video>` just before it scrolls in (and the immediately-next one),
 * so only one or two videos ever decode at once. Returns a callback ref to
 * attach to the scene element plus its current in-view state.
 */
export function useInViewport(rootMargin = '60% 0px 60% 0px') {
  const { ref, inView } = useInView({ rootMargin, threshold: 0 });
  return { ref, inView };
}
