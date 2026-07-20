import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getUserSubscription,
  isPremiumUser,
  getDailyLessonLimit,
  type Subscription,
} from "@/lib/subscription";

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
      setLoading(false);
      return;
    }

    async function loadSubscription() {
      try {
        const [sub, premium, limit] = await Promise.all([
          getUserSubscription(user!.id),
          isPremiumUser(user!.id),
          getDailyLessonLimit(user!.id),
        ]);

        setSubscription(sub);
        setIsPremium(premium);
        setDailyLimit(limit);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user]);

  return {
    subscription,
    isPremium,
    dailyLimit,
    loading,
    isUnlimited: dailyLimit === Infinity,
  };
}
