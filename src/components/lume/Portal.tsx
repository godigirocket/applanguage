import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body instead of wherever the component is
 * mounted in the tree. Modals need this: a `position: fixed` element only
 * behaves relative to the true viewport when none of its ancestors set a
 * transform/filter/contain (any of those makes that ancestor the containing
 * block instead) — a portal sidesteps the question entirely.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
