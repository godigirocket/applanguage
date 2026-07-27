import { useEffect } from "react";

/**
 * Locks background scroll while `active` is true, iOS-Safari-safe.
 * Plain `overflow: hidden` on body doesn't hold on iOS (the page still
 * scrolls under a fixed-position modal via touch), so this pins the body at
 * its current scroll offset with `position: fixed` and restores it on
 * cleanup — the standard workaround for that Safari behavior.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflowY = "scroll";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflowY = prev.overflowY;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
