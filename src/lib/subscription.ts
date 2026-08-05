import { supabase } from "./supabase";

export type SubscriptionPlan = "free" | "premium_monthly" | "premium_quarterly" | "premium_annual" | "premium_lifetime";
export type SubscriptionStatus = "active" | "canceled" | "expired" | "trialing";

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  payment_provider: string;
  external_customer_id?: string;
  external_subscription_id?: string;
  current_period_start: string;
  current_period_end?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  namePT: string;
  nameES: string;
  price: number;
  priceFormatted: string;
  interval: "month" | "year";
  features: string[];
  featuresPT: string[];
  featuresES: string[];
  popular?: boolean;
  savings?: string;
  savingsPT?: string;
  savingsES?: string;
}

export const PLANS: PlanDetails[] = [
  {
    id: "free",
    name: "Free",
    namePT: "Gratuito",
    nameES: "Gratis",
    price: 0,
    priceFormatted: "R$ 0",
    interval: "month",
    features: [
      "10 lessons",
      "Basic games",
      "Community access",
    ],
    featuresPT: [
      "10 lições",
      "Jogos básicos",
      "Acesso à comunidade",
    ],
    featuresES: [
      "10 lecciones",
      "Juegos básicos",
      "Acceso a la comunidad",
    ],
  },
  {
    id: "premium_monthly",
    name: "Monthly",
    namePT: "Mensal",
    nameES: "Mensual",
    price: 9.9,
    priceFormatted: "R$ 9,90",
    interval: "month",
    features: [
      "Unlimited lessons",
      "All 6 game modes",
      "AI conversation",
      "Offline mode",
      "No ads",
    ],
    featuresPT: [
      "Lições ilimitadas",
      "Todos os 6 modos de jogo",
      "Conversação com IA",
      "Modo offline",
      "Sem anúncios",
    ],
    featuresES: [
      "Lecciones ilimitadas",
      "Los 6 modos de juego",
      "Conversación con IA",
      "Modo sin conexión",
      "Sin anuncios",
    ],
  },
  {
    id: "premium_quarterly",
    name: "Quarterly",
    namePT: "Trimestral",
    nameES: "Trimestral",
    price: 25.9,
    priceFormatted: "R$ 25,90",
    interval: "month",
    popular: true,
    savings: "Save 13%",
    savingsPT: "Economize 13%",
    savingsES: "Ahorra 13%",
    features: [
      "Everything in Monthly",
      "Priority support",
      "Exclusive content",
    ],
    featuresPT: [
      "Tudo do Mensal",
      "Suporte prioritário",
      "Conteúdo exclusivo",
    ],
    featuresES: [
      "Todo lo del Mensual",
      "Soporte prioritario",
      "Contenido exclusivo",
    ],
  },
  {
    id: "premium_annual",
    name: "Annual",
    namePT: "Anual",
    nameES: "Anual",
    price: 65.9,
    priceFormatted: "R$ 65,90",
    interval: "year",
    savings: "Save 44%",
    savingsPT: "Economize 44%",
    savingsES: "Ahorra 44%",
    features: [
      "Everything in Quarterly",
      "Certificate of completion",
      "Early access to features",
    ],
    featuresPT: [
      "Tudo do Trimestral",
      "Certificado de conclusão",
      "Acesso antecipado a novidades",
    ],
    featuresES: [
      "Todo lo del Trimestral",
      "Certificado de finalización",
      "Acceso anticipado a novedades",
    ],
  },
  {
    id: "premium_lifetime",
    name: "Lifetime",
    namePT: "Vitalício",
    nameES: "Vitalicio",
    price: 110,
    priceFormatted: "R$ 110,00",
    interval: "year",
    savings: "Pay once, forever",
    savingsPT: "Pague uma vez, acesse pra sempre",
    savingsES: "Paga una vez, accede para siempre",
    features: [
      "Everything forever",
      "All future updates",
      "VIP community",
      "Founding member badge",
    ],
    featuresPT: [
      "Tudo pra sempre",
      "Todas as atualizações futuras",
      "Comunidade VIP",
      "Badge de membro fundador",
    ],
    featuresES: [
      "Todo para siempre",
      "Todas las actualizaciones futuras",
      "Comunidad VIP",
      "Insignia de miembro fundador",
    ],
  },
];

/**
 * Get user's current subscription
 */
export async function getUserSubscription(
  userId: string
): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error("Error in getUserSubscription:", error);
    return null;
  }
}

/**
 * Check if user has active premium subscription
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  // Check if subscription is active and premium
  if (subscription.status !== "active" && subscription.status !== "trialing") {
    return false;
  }

  if (subscription.plan === "free") {
    return false;
  }

  // Check if subscription has expired
  if (subscription.current_period_end) {
    const endDate = new Date(subscription.current_period_end);
    if (endDate < new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Create or update subscription
 */
export async function upsertSubscription(
  userId: string,
  plan: SubscriptionPlan,
  status: SubscriptionStatus = "active",
  metadata?: {
    external_customer_id?: string;
    external_subscription_id?: string;
    current_period_end?: string;
    trial_end?: string;
  }
): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
  try {
    // Calculate period end based on plan
    const now = new Date();
    let periodEnd = new Date(now);

    if (plan === "premium_monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (plan === "premium_annual") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const subscriptionData = {
      user_id: userId,
      plan,
      status,
      payment_provider: "cakto",
      external_customer_id: metadata?.external_customer_id,
      external_subscription_id: metadata?.external_subscription_id,
      current_period_start: now.toISOString(),
      current_period_end: metadata?.current_period_end || periodEnd.toISOString(),
      trial_end: metadata?.trial_end,
      updated_at: now.toISOString(),
    };

    // Check if subscription exists
    const existing = await getUserSubscription(userId);

    let result;
    if (existing) {
      // Update existing subscription
      result = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      // Create new subscription
      result = await supabase
        .from("subscriptions")
        .insert(subscriptionData)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error upserting subscription:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, subscription: result.data as Subscription };
  } catch (error: any) {
    console.error("Error in upsertSubscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel subscription (mark for cancellation at period end)
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return { success: false, error: "No subscription found" };
    }

    const { error } = await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (error) {
      console.error("Error canceling subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in cancelSubscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return { success: false, error: "No subscription found" };
    }

    const { error } = await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (error) {
      console.error("Error reactivating subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in reactivateSubscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Record payment transaction
 */
export async function recordPaymentTransaction(
  userId: string,
  amount: number,
  status: "pending" | "completed" | "failed" | "refunded",
  metadata?: {
    subscription_id?: string;
    external_transaction_id?: string;
    payment_method?: string;
    currency?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("payment_transactions").insert({
      user_id: userId,
      subscription_id: metadata?.subscription_id,
      amount,
      currency: metadata?.currency || "BRL",
      status,
      payment_provider: "cakto",
      external_transaction_id: metadata?.external_transaction_id,
      payment_method: metadata?.payment_method,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error recording transaction:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in recordPaymentTransaction:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get plan details by ID
 */
export function getPlanDetails(planId: SubscriptionPlan): PlanDetails | undefined {
  return PLANS.find((p) => p.id === planId);
}

/**
 * Check if user can access premium content
 */
export async function canAccessPremiumContent(userId: string): Promise<boolean> {
  return await isPremiumUser(userId);
}

/**
 * Get daily lesson limit based on subscription
 */
export async function getDailyLessonLimit(userId: string): Promise<number> {
  const isPremium = await isPremiumUser(userId);
  return isPremium ? Infinity : 5;
}

/**
 * Check if user has reached daily lesson limit
 */
export async function hasReachedDailyLimit(
  userId: string,
  completedToday: number
): Promise<boolean> {
  const limit = await getDailyLessonLimit(userId);
  return completedToday >= limit;
}
