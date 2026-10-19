import { useEffect } from 'react';

/**
 * Fades in elements marked with `data-reveal` as they enter the viewport.
 * The hidden starting state is only applied (via the `has-reveal` class) once
 * IntersectionObserver is confirmed, and the CSS skips it entirely under
 * prefers-reduced-motion, so content is never left invisible.
 */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    elements.forEach((el) => observer.observe(el));
    root.classList.add('has-reveal');

    return () => {
      observer.disconnect();
      root.classList.remove('has-reveal');
    };
  }, []);
}
