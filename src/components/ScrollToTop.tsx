/**
 * SCROLL TO TOP COMPONENT
 * Automatically scrolls to top when route changes
 * Critical for mobile UX - ensures lesson pages always open at the top
 */

import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}
