import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll direction so a fixed header can hide on scroll-down and
 * reappear on scroll-up, Duolingo/Babbel-style — instead of staying pinned
 * on screen the whole time. Always visible near the top of the page
 * (within `minScroll`) so it never disappears mid-read on a short page.
 */
export function useHideOnScroll({ threshold = 12, minScroll = 80, resetKey = "" } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    setHidden(false);
    let frame = 0;
    let distance = 0;
    let direction = 0;

    function handleScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.max(0, window.scrollY);
        const diff = y - lastY.current;
        const nextDirection = Math.sign(diff);
        if (nextDirection !== direction) distance = 0;
        distance += diff;
        direction = nextDirection;

        if (y <= minScroll) {
          setHidden(false);
          distance = 0;
        } else if (distance > threshold) {
          setHidden(true);
          distance = 0;
        } else if (distance < -threshold) {
          setHidden(false);
          distance = 0;
        }

        lastY.current = y;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold, minScroll, resetKey]);

  return hidden;
}
