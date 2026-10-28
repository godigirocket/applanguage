import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Share a profile request between the shell and page; never block content. */
export function profileQueryOptions(userId: string) {
  return {
    queryKey: ["profile", userId],
    staleTime: 30_000,
    retry: false,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) abort();
      const timer = setTimeout(abort, 6000);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId!)
          .abortSignal(controller.signal)
          .maybeSingle();
        if (error) throw error;
        return data;
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
      }
    },
  };
}
export function useProfile(userId?: string) {
  return useQuery({ ...profileQueryOptions(userId || ""), enabled: Boolean(userId) });
}
