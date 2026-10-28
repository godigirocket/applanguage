import { useStore } from "@/hooks/useStore";
import spanish from "./es-ui.json";

/** Compatibility for legacy PT/EN views; course content is left untouched. */
export function uiFallback(english: string): string {
  return useStore.getState().interfaceLanguage === "es"
    ? ((spanish as Record<string, string>)[english] ?? english)
    : english;
}
