import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll direction so a fixed header can hide on scroll-down and
 * reappear on scroll-up, Duolingo/Babbel-style — instead of staying pinned
 * on screen the whole time. Always visible near the top of the page
 * (within `minScroll`) so it never disappears mid-read on a short page.
 */
export function useHideOnScroll({ threshold = 12, minScroll = 80 } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastY.current;

        if (y <= minScroll) {
          setHidden(false);
        } else if (diff > threshold) {
          setHidden(true);
        } else if (diff < -threshold) {
          setHidden(false);
        }

        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, minScroll]);

  return hidden;
}
