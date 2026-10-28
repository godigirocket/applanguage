import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useClientReady } from "@/hooks/useClientReady";

/** Fixed chrome must not inherit a page animation's containing block. */
export function ViewportLayer({ children }: { children: ReactNode }) {
  const ready = useClientReady();
  return ready ? createPortal(children, document.body) : children;
}
