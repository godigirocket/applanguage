import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getUserSubscription, type Subscription } from "@/lib/subscription";

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proteção SSR
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    if (!user) {
      setSubscription(null);
      setIsPremium(false);
      setDailyLimit(5);
      setLoading(false);
      return;
    }

    let active = true;
    setSubscription(null);
    setIsPremium(false);
    setDailyLimit(5);
    setLoading(true);
    async function loadSubscription() {
      try {
        const sub = await getUserSubscription(user!.id);
        if (!active) return;
        const premium = Boolean(sub);
        const limit = premium ? Infinity : 5;

        setSubscription(sub);
        setIsPremium(premium);
        setDailyLimit(limit);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSubscription();
    return () => {
      active = false;
    };
  }, [user?.id]);

  return {
    subscription,
    isPremium,
    dailyLimit,
    loading,
    isUnlimited: dailyLimit === Infinity,
  };
}
