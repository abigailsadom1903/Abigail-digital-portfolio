import { useEffect, useState } from 'react';

interface ScrollState {
  /** True once the page has scrolled away from the very top. */
  scrolled: boolean;
  /** True while the user is scrolling down past the threshold. */
  hidden: boolean;
}

/**
 * Hides the header while reading downwards and brings it back on any upward scroll.
 */
export function useHideOnScroll(threshold = 160): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      // Ignore tiny movements so the header doesn't flicker.
      if (Math.abs(delta) < 6 && y > 0) return;
      setState({ scrolled: y > 8, hidden: delta > 0 && y > threshold });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
