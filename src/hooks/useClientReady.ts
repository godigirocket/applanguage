import { useEffect, useState } from "react";

/** Keep SSR forms from submitting natively before React attaches handlers. */
export function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
