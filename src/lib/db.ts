import { supabase } from "./supabase";

const db = supabase as any;

// Get current user's profile, create if missing
export async function getOrCreateProfile(userId: string, email: string) {
  // Try to get existing profile
  const { data, error } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error?.code === "42P01") {
    return null;
  }

  if (data) return data;

  // Profile missing — create it
  const { data: created } = await db
    .from("profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: email.split("@")[0],
      },
      { onConflict: "id" },
    )
    .select()
    .maybeSingle();

  return created;
}

// Just the profile row — for callers (like the home page) that don't need
// the conversations/expressions getUserStats() also fetches. Those extra
// queries were pure waste for them and ate into the same timeout budget.
export async function getProfile(userId: string) {
  const { data, error } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error?.code === "42P01") return null;
  return data ?? null;
}

// Get all stats for home/progress pages
export async function getUserStats(userId: string) {
  try {
    const [convResult, exprResult, profileResult] = await Promise.all([
      // Every caller (home, progress) only reads duration/xp/topic/date —
      // `messages` (the full conversation transcript) was being fetched on
      // every load and thrown away unused. For a student with a long chat
      // history that's a lot of unnecessary JSON over the wire, and was the
      // likely cause of "[Home] Failed to load profile: Profile load
      // timeout" — this single query, not the profile row itself, is what
      // blew the 8s budget.
      db
        .from("conversations")
        .select("id, duration_seconds, xp_earned, created_at, topic_slug, topic_title")
        .eq("student_id", userId)
        .order("created_at", { ascending: false }),
      db
        .from("saved_expressions")
        .select("*")
        .eq("student_id", userId)
        .order("created_at", { ascending: false }),
      db.from("profiles").select("*").eq("id", userId).maybeSingle(),
    ]);

    // Check if table missing error (42P01) occurred in any query
    if (
      convResult.error?.code === "42P01" ||
      exprResult.error?.code === "42P01" ||
      profileResult.error?.code === "42P01"
    ) {
      return {
        conversations: [],
        expressions: [],
        profile: null,
        stats: {
          conversationCount: 0,
          expressionCount: 0,
          totalMinutes: 0,
          streak: 0,
          xp: 0,
          level: "beginner",
        },
      };
    }

    const conversations = convResult.data || [];
    const expressions = exprResult.data || [];
    const profile = profileResult.data;

    const totalMinutes = Math.round(
      conversations.reduce((sum: number, c: any) => sum + (c.duration_seconds || 0), 0) / 60,
    );

    return {
      conversations,
      expressions,
      profile,
      stats: {
        conversationCount: conversations.length,
        expressionCount: expressions.length,
        totalMinutes,
        streak: profile?.streak || 0,
        xp: profile?.xp || 0,
        level: profile?.level || "beginner",
      },
    };
  } catch (e) {
    console.error("Stats fetch error:", e);
    return {
      conversations: [],
      expressions: [],
      profile: null,
      stats: {
        conversationCount: 0,
        expressionCount: 0,
        totalMinutes: 0,
        streak: 0,
        xp: 0,
        level: "beginner",
      },
    };
  }
}

// Award XP and check for level up
export async function awardXP(userId: string, amount: number, currentXP: number) {
  const newXP = currentXP + amount;

  await db
    .from("profiles")
    .update({ xp: newXP, updated_at: new Date().toISOString() })
    .eq("id", userId);

  return newXP;
}

// Update streak after completing a session
export async function updateStreak(userId: string, lastSessionDate: string | null) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = 1;

  if (lastSessionDate === today) {
    // Already practiced today — don't increment
    return null;
  } else if (lastSessionDate === yesterday) {
    // Practiced yesterday — increment streak
    const { data } = await db.from("profiles").select("streak").eq("id", userId).maybeSingle();
    newStreak = (data?.streak || 0) + 1;
  }
  // else streak resets to 1

  await db
    .from("profiles")
    .update({
      streak: newStreak,
      last_session_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  return newStreak;
}

// Save a completed conversation
export async function saveConversation(
  userId: string,
  data: {
    topic_slug: string;
    topic_title: string;
    language: string;
    mood: string;
    messages: any[];
    duration_seconds: number;
    xp_earned: number;
  },
) {
  const { data: conv, error } = await db
    .from("conversations")
    .insert({ student_id: userId, title: data.topic_title, ...data })
    .select()
    .maybeSingle();

  if (error) console.error("Save conversation error:", error);
  return conv;
}

// Save an expression
export async function saveExpression(
  userId: string,
  expression: string,
  context: string,
  topicSlug: string,
) {
  const { data, error } = await db
    .from("saved_expressions")
    .insert({ student_id: userId, expression, context, topic_slug: topicSlug })
    .select()
    .maybeSingle();

  if (error) console.error("Save expression error:", error);
  return data;
}

// Save progress snapshot
export async function saveProgressSnapshot(userId: string, xpTotal: number) {
  const today = new Date().toISOString().split("T")[0];
  const confidence = Math.min(100, Math.round(xpTotal / 10));

  await db.from("progress_snapshots").upsert(
    {
      student_id: userId,
      date: today,
      speaking_confidence: confidence,
      xp_total: xpTotal,
    },
    { onConflict: "student_id,date" },
  );
}

// Check which badges are unlocked
export function checkBadges(stats: {
  conversationCount: number;
  expressionCount: number;
  totalMinutes: number;
  streak: number;
  completedTopics: string[];
  quizzesCompleted: number;
  bestQuizStreak: number;
}) {
  return {
    firstSpark: stats.conversationCount >= 1,
    chatterbox: stats.conversationCount >= 10,
    cultureLover: stats.completedTopics.includes("art-culture"),
    worldTraveler: stats.completedTopics.includes("travel"),
    professional: stats.completedTopics.includes("professional"),
    confidenceBuilder: stats.completedTopics.filter((t) => t === "speaking-confidence").length >= 3,
    expressionCollector: stats.expressionCount >= 20,
    dedicated: stats.totalMinutes >= 60,
    onFire: stats.streak >= 7,
    quizMaster: stats.quizzesCompleted >= 50,
    speedDemon: stats.bestQuizStreak >= 10,
  };
}

// Universal safe profile writes with localStorage fallback
export async function safeUpsertProfile(userId: string, updates: Record<string, any>) {
  try {
    const { error } = await db
      .from("profiles")
      .upsert(
        { id: userId, ...updates, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );

    if (error?.code === "42P01") {
      // Table doesn't exist — store in localStorage as fallback
      const existing =
        typeof localStorage !== "undefined"
          ? JSON.parse(localStorage.getItem("lume_profile") || "{}")
          : {};
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("lume_profile", JSON.stringify({ ...existing, ...updates }));
      }
      return { success: true, fallback: true };
    }

    return { success: !error };
  } catch {
    // Fallback to localStorage
    const existing =
      typeof localStorage !== "undefined"
        ? JSON.parse(localStorage.getItem("lume_profile") || "{}")
        : {};
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("lume_profile", JSON.stringify({ ...existing, ...updates }));
    }
    return { success: true, fallback: true };
  }
}

export async function safeGetProfile(userId: string) {
  try {
    const { data, error } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();

    if (error?.code === "42P01" || error?.message?.includes("404")) {
      // Use localStorage fallback
      const stored =
        typeof localStorage !== "undefined" ? localStorage.getItem("lume_profile") : null;
      return stored ? JSON.parse(stored) : null;
    }

    return data;
  } catch {
    const stored =
      typeof localStorage !== "undefined" ? localStorage.getItem("lume_profile") : null;
    return stored ? JSON.parse(stored) : null;
  }
}

// XP stored locally when DB unavailable
export function getLocalXP(): number {
  if (typeof localStorage === "undefined") return 0;
  return parseInt(localStorage.getItem("lume_xp") || "0");
}

export function addLocalXP(amount: number): number {
  if (typeof localStorage === "undefined") return amount;
  const current = getLocalXP();
  const newVal = current + amount;
  localStorage.setItem("lume_xp", String(newVal));
  return newVal;
}

export function getLocalStreak(): number {
  if (typeof localStorage === "undefined") return 0;
  const today = new Date().toISOString().split("T")[0];
  const lastDay = localStorage.getItem("lume_last_day");
  const streak = parseInt(localStorage.getItem("lume_streak") || "0");

  if (lastDay === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (lastDay === yesterday) {
    const newStreak = streak + 1;
    localStorage.setItem("lume_streak", String(newStreak));
    localStorage.setItem("lume_last_day", today);
    return newStreak;
  }
  localStorage.setItem("lume_streak", "1");
  localStorage.setItem("lume_last_day", today);
  return 1;
}
