import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { Mascot } from "@/components/lume/Mascot";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart,
  MessageCircle,
  Send,
  Trophy,
  Flame,
  Star,
  BookOpen,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  Crown,
  User,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

interface FeedPost {
  id: number | string;
  user: { id: number | string; name: string; avatar: string };
  type: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  tags: string[];
}

function formatRelativeTime(isoDate: string, isPT: boolean): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return isPT ? "agora" : "just now";
  if (mins < 60) return isPT ? `${mins}min atrás` : `${mins}min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isPT ? `${hours}h atrás` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isPT ? `${days}d atrás` : `${days}d ago`;
}

const POST_TYPES = [
  { id: "all", label: "Tudo", icon: Globe },
  { id: "achievements", label: "Conquistas", icon: Trophy },
  { id: "questions", label: "Perguntas", icon: MessageCircle },
  { id: "tips", label: "Dicas", icon: Star },
  { id: "memes", label: "Memes", icon: Sparkles },
];

const PRO_LEARNERS = [
  { name: "Maya", level: "C1", action: "Speaking Lab", color: "#1CB0F6" },
  { name: "Leo", level: "B2", action: "18 streak", color: "#FF4B4B" },
  { name: "Ana", level: "A2", action: "Quiz rapido", color: "#2FBB52" },
  { name: "Noah", level: "C2", action: "Cultura", color: "#AC5CF6" },
];

const SEED_POSTS: FeedPost[] = [
  { id: "seed-1", user: { id: "lume", name: "LumeLearn", avatar: "" }, content: "Parabéns a todos que completaram o Desafio Diário hoje! 12 pessoas bateram o recorde.", type: "achievement", image: null, likes: 34, comments: 8, shares: 3, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-2", user: { id: "maya", name: "Maya S.", avatar: "" }, content: "Finalmente cheguei no nível C1 depois de 3 meses! A dica: pelo menos 2 lições por dia.", type: "achievement", image: null, likes: 47, comments: 12, shares: 5, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-3", user: { id: "leo", name: "Leo M.", avatar: "" }, content: "Alguém mais acha o modo Sobrevivência viciante? 28 acertos seguidos hoje!", type: "question", image: null, likes: 21, comments: 6, shares: 1, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-4", user: { id: "ana", name: "Ana R.", avatar: "" }, content: "Dica: pratiquem listening com fone. A diferença é absurda na pronúncia.", type: "tip", image: null, likes: 53, comments: 15, shares: 9, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-5", user: { id: "lume", name: "LumeLearn", avatar: "" }, content: "710 lições disponíveis em cada idioma! Espanhol e Português completos.", type: "tip", image: null, likes: 89, comments: 23, shares: 14, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-6", user: { id: "noah", name: "Noah P.", avatar: "" }, content: "Streak de 30 dias! O segredo é lições curtas no ônibus.", type: "achievement", image: null, likes: 38, comments: 9, shares: 4, timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), tags: [] },
  { id: "seed-7", user: { id: "carol", name: "Carol V.", avatar: "" }, content: "O quiz de gramática me salvou na prova de inglês. Obrigada Lume!", type: "achievement", image: null, likes: 62, comments: 18, shares: 7, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), tags: [] },
];

function avatarInitials(name: string) {
  return (
    name
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "LU"
  );
}

function CommunityPage() {
  const { interfaceLanguage, isKidAccount } = useStore();
  const { user } = useAuth();
  const nav = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [postText, setPostText] = useState("");
  const [realPosts, setRealPosts] = useState<FeedPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    return new Set(JSON.parse(localStorage.getItem("lume_liked_posts") || "[]"));
  });
  const [commentingPostId, setCommentingPostId] = useState<string | number | null>(null);
  const [quickComment, setQuickComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<{ memberCount: number; postsToday: number; lessonsCompleted: number } | null>(
    null,
  );
  const isPT = interfaceLanguage === "pt";

  // Kid accounts don't get the unmoderated adult social feed — bounce them
  // back to Home rather than just hiding the nav link, since the route
  // itself is otherwise reachable by typing the URL directly.
  useEffect(() => {
    if (isKidAccount) {
      nav({ to: "/home" });
    }
  }, [isKidAccount, nav]);

  // Real, shared feed — previously this only wrote to local component state,
  // so a post vanished on refresh and no other user ever saw it despite the
  // UI looking like a live social feed.
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setRealPosts(
          data.map((row: any) => ({
            id: row.id,
            user: {
              id: row.user_id,
              name: row.author_name,
              avatar: "👤",
            },
            type: row.post_type,
            content: row.content,
            image: null,
            likes: row.likes,
            comments: row.comments,
            shares: row.shares,
            timestamp: formatRelativeTime(row.created_at, isPT),
            tags: row.tags || [],
          })),
        );
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real platform-wide stats via a SECURITY DEFINER RPC — profiles/
  // lesson_progress are locked to owner-only SELECT, so a plain client
  // query would only ever see the current user's own row/count.
  useEffect(() => {
    let cancelled = false;
    supabase
      .rpc("get_community_stats")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const row = Array.isArray(data) ? data[0] : data;
        if (!row) return;
        setStats({
          memberCount: Number(row.member_count) || 0,
          postsToday: Number(row.posts_today) || 0,
          lessonsCompleted: Number(row.lessons_completed) || 0,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmitPost() {
    const text = postText.trim();
    if (!text || !user || isSubmitting) return;

    // A simple client-side cooldown — this goes straight to Supabase from
    // the browser (no server function in front of it to rate-limit), so a
    // per-device cooldown is the only guard against rapid-fire spam posting.
    const lastPostKey = "lume_last_post_at";
    const lastPostAt = Number(localStorage.getItem(lastPostKey) || 0);
    if (Date.now() - lastPostAt < 10_000) {
      toast.info(
        isPT ? "Aguarde alguns segundos antes de postar de novo." : "Wait a few seconds before posting again.",
      );
      return;
    }

    setIsSubmitting(true);
    const authorName = user.email?.split("@")[0] || (isPT ? "Você" : "You");
    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: user.id,
        author_name: authorName,
        content: text,
        post_type: "tip",
        tags: [],
      })
      .select()
      .single();
    setIsSubmitting(false);

    if (error || !data) {
      toast.error(isPT ? "Não foi possível publicar. Tente novamente." : "Couldn't post. Please try again.");
      return;
    }

    localStorage.setItem(lastPostKey, String(Date.now()));
    setRealPosts((prev) => [
      {
        id: data.id,
        user: { id: user.id, name: authorName, avatar: "👤" },
        type: "tip",
        content: text,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: isPT ? "agora" : "just now",
        tags: [],
      },
      ...prev,
    ]);
    setPostText("");
    toast.success(isPT ? "Publicado!" : "Posted!");
  }

  const getPostIcon = (type: string) => {
    const icons: Record<string, any> = {
      achievement: Trophy,
      question: MessageCircle,
      streak: Flame,
      tip: Star,
      meme: Sparkles,
      challenge: TrendingUp,
      cultural: Globe,
      resource: BookOpen,
    };
    return icons[type] || MessageCircle;
  };

  const getPostColor = (type: string) => {
    const colors: Record<string, string> = {
      achievement: "#4CAF50",
      question: "#3498DB",
      streak: "#FF6B35",
      tip: "#F39C12",
      meme: "#9B59B6",
      challenge: "#E74C3C",
      cultural: "#1ABC9C",
      resource: "#34495E",
    };
    return colors[type] || "#95A5A6";
  };

  // Filter buttons previously updated activeFilter without ever being applied
  // to the feed — every filter showed the exact same posts as "Tudo".
  const FILTER_TO_POST_TYPES: Record<string, string[]> = {
    achievements: ["achievement", "streak"],
    questions: ["question"],
    tips: ["tip", "resource"],
    memes: ["meme"],
  };
  const allPosts = [...SEED_POSTS, ...realPosts];
  const visiblePosts =
    activeFilter === "all"
      ? allPosts
      : allPosts.filter((post) => FILTER_TO_POST_TYPES[activeFilter]?.includes(post.type));

  function updatePostCount(postId: string | number, field: "likes" | "comments" | "shares", delta = 1) {
    setRealPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, [field]: Math.max(0, post[field] + delta) } : post,
      ),
    );
  }

  function handleLike(postId: string | number) {
    const key = String(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      const liked = next.has(key);
      if (liked) next.delete(key);
      else next.add(key);
      localStorage.setItem("lume_liked_posts", JSON.stringify([...next]));
      updatePostCount(postId, "likes", liked ? -1 : 1);
      return next;
    });
  }

  function handleQuickComment(postId: string | number) {
    const text = quickComment.trim();
    if (!text) return;
    updatePostCount(postId, "comments", 1);
    setQuickComment("");
    setCommentingPostId(null);
    toast.success(isPT ? "Comentario adicionado nesta sessao." : "Comment added for this session.");
  }

  async function handleSharePost(post: FeedPost) {
    updatePostCount(post.id, "shares", 1);
    const text = `${post.user.name} no Lume: ${post.content}`;
    if (navigator.share) {
      await navigator.share({ title: "Lume", text, url: "https://langlume.vercel.app/community" }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text} https://langlume.vercel.app/community`);
      toast.success(isPT ? "Link copiado." : "Link copied.");
    }
  }

  // Placed after every hook above (never conditionally skip a hook) — the
  // effect on mount already redirects; this just avoids flashing the adult
  // feed for the one render before that redirect takes effect.
  if (isKidAccount) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
      }}
      className="lume-community-page"
    >
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HEADER */}
        <div
          className="lume-community-hero"
          style={{
            background: "var(--surface-raised)",
            borderBottom: "2px solid var(--border)",
            padding: "24px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              {isPT ? "Comunidade" : "Community"}
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
              {isPT
                ? "Conecte-se com milhares de estudantes ao redor do mundo"
                : "Connect with thousands of learners worldwide"}
            </p>

            {/* STATS BAR — real counts from get_community_stats(), not hardcoded */}
            <div style={{ display: "flex", gap: "32px", marginTop: "20px", flexWrap: "wrap" }}>
              {[
                {
                  icon: Users,
                  label: isPT ? "Membros" : "Members",
                  value: stats ? stats.memberCount.toLocaleString() : "—",
                },
                {
                  icon: MessageCircle,
                  label: isPT ? "Posts Hoje" : "Posts Today",
                  value: stats ? stats.postsToday.toLocaleString() : "—",
                },
                {
                  icon: Globe,
                  label: isPT ? "Lições Concluídas" : "Lessons Completed",
                  value: stats ? stats.lessonsCompleted.toLocaleString() : "—",
                },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--brand)15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon size={20} color="var(--brand)" />
                  </div>
                  <div>
                    <div
                      style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
          <section className="lume-live-strip" aria-label={isPT ? "Usuarios Pro ativos" : "Active Pro users"}>
            <div>
              <span className="lume-live-dot" />
              <strong>{isPT ? "Ao vivo agora" : "Live now"}</strong>
              <p>{isPT ? "Estudantes Pro treinando em tempo real" : "Pro learners practicing right now"}</p>
            </div>
            <div className="lume-pro-row">
              {PRO_LEARNERS.map((learner) => (
                <div
                  key={learner.name}
                  className="lume-pro-chip"
                  style={{ ["--chip-color" as any]: learner.color }}
                >
                  <span>{avatarInitials(learner.name)}</span>
                  <div>
                    <strong>{learner.name}</strong>
                    <small>
                      {learner.level} - {learner.action}
                    </small>
                  </div>
                  <Crown size={15} />
                </div>
              ))}
            </div>
          </section>

          <div className="community-grid">
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className="community-sidebar">
              <div
                className="lume-community-panel"
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "16px",
                  border: "2px solid var(--border)",
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "16px",
                  }}
                >
                  {isPT ? "Filtros" : "Filters"}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {POST_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className="lume-filter-button"
                      onClick={() => setActiveFilter(type.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "none",
                        background: activeFilter === type.id ? "var(--brand)15" : "transparent",
                        color: activeFilter === type.id ? "var(--brand)" : "var(--text-primary)",
                        fontWeight: activeFilter === type.id ? 700 : 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "left",
                      }}
                    >
                      <type.icon size={18} />
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* TRENDING TAGS */}
                <div style={{ marginTop: "32px" }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "16px",
                    }}
                  >
                    {isPT ? "Trending" : "Trending"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {["#milestone", "#grammar", "#streak", "#culture"].map((tag) => (
                      <div
                        key={tag}
                        onClick={() => {
                          setActiveFilter("all");
                          setPostText((current) => (current ? current : `${tag} `));
                        }}
                        style={{
                          padding: "8px 12px",
                          background: "var(--bg)",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--brand)",
                          cursor: "pointer",
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* FEED */}
            <main>
              {/* CREATE POST */}
              {user && (
                <div
                  className="lume-create-post"
                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: "20px",
                    border: "2px solid var(--border)",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div
                      className="lume-avatar-token"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(145deg, var(--brand), var(--brand-blue))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        flexShrink: 0,
                      }}
                    >
                      👤
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder={isPT ? "Compartilhe sua jornada..." : "Share your journey..."}
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "16px",
                          borderRadius: "12px",
                          border: "2px solid var(--border)",
                          background: "var(--bg)",
                          color: "var(--text-primary)",
                          fontSize: "15px",
                          resize: "none",
                          fontFamily: "inherit",
                          outline: "none",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "12px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() =>
                              toast.info(isPT ? "Upload de imagem entra na proxima versao." : "Image upload is coming next.")
                            }
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                              background: "var(--bg)",
                              color: "var(--text-secondary)",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <BookOpen size={16} />
                            {isPT ? "Imagem" : "Image"}
                          </button>
                          <button
                            onClick={() => setPostText((current) => `${current}${current ? " " : ""}#brilho`)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                              background: "var(--bg)",
                              color: "var(--text-secondary)",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Sparkles size={16} />
                            {isPT ? "Emoji" : "Emoji"}
                          </button>
                        </div>
                        <button
                          disabled={!postText.trim() || isSubmitting}
                          onClick={handleSubmitPost}
                          style={{
                            padding: "10px 24px",
                            borderRadius: "12px",
                            border: "none",
                            background: postText.trim() && !isSubmitting ? "var(--brand)" : "var(--border)",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: postText.trim() && !isSubmitting ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Send size={16} />
                          {isSubmitting ? (isPT ? "Publicando..." : "Posting...") : isPT ? "Publicar" : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* POSTS FEED */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {visiblePosts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      background: "var(--surface-raised)",
                      borderRadius: "20px",
                      border: `2px dashed var(--border)`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                      <Mascot state="happy" size={72} />
                    </div>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "6px",
                      }}
                    >
                      {activeFilter === "all"
                        ? isPT
                          ? "Ainda ninguém postou por aqui"
                          : "No one's posted here yet"
                        : isPT
                          ? "Nenhum post nessa categoria ainda"
                          : "No posts in this category yet"}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: 0 }}>
                      {activeFilter === "all"
                        ? isPT
                          ? "Seja o primeiro a compartilhar sua conquista ou fazer uma pergunta!"
                          : "Be the first to share a win or ask a question!"
                        : isPT
                          ? "Que tal escrever o primeiro?"
                          : "Why not write the first one?"}
                    </p>
                  </motion.div>
                )}
                {visiblePosts.map((post, i) => {
                  const PostIcon = getPostIcon(post.type);
                  const postColor = getPostColor(post.type);

                  return (
                    <motion.div
                      key={post.id}
                      className="lume-post-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        background: "var(--surface-raised)",
                        borderRadius: "20px",
                        border: "2px solid var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      {/* POST HEADER */}
                      <div
                        style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}
                      >
                        <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                          <div
                            className="lume-avatar-token"
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: `linear-gradient(145deg, ${postColor}, var(--brand-blue))`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                              flexShrink: 0,
                            }}
                          >
                            <User size={22} color="white" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 800,
                                  color: "var(--text-primary)",
                                }}
                              >
                                {post.user.name}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <PostIcon size={14} color={postColor} />
                              {post.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* POST CONTENT */}
                      <div style={{ padding: "20px 24px" }}>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "var(--text-primary)",
                            lineHeight: 1.6,
                            marginBottom: "16px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {post.content}
                        </p>

                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post"
                            style={{ width: "100%", borderRadius: "12px", marginBottom: "16px" }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}

                        {/* TAGS */}
                        {post.tags && (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "16px",
                              flexWrap: "wrap",
                            }}
                          >
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: "4px 10px",
                                  background: "var(--brand)10",
                                  color: "var(--brand)",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div
                          style={{
                            display: "flex",
                            gap: "24px",
                            paddingTop: "16px",
                            borderTop: "1px solid var(--border)",
                          }}
                        >
                          <button
                            onClick={() => handleLike(post.id)}
                            className={likedPosts.has(String(post.id)) ? "lume-social-action is-active" : "lume-social-action"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              color: likedPosts.has(String(post.id)) ? "#FF4B4B" : "var(--text-secondary)",
                              fontSize: "14px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "color 0.2s",
                            }}
                          >
                            <Heart size={18} fill={likedPosts.has(String(post.id)) ? "#FF4B4B" : "none"} />
                            {post.likes}
                          </button>
                          <button
                            onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                            className="lume-social-action"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              color: "var(--text-secondary)",
                              fontSize: "14px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "color 0.2s",
                            }}
                          >
                            <MessageCircle size={18} />
                            {post.comments}
                          </button>
                          <button
                            onClick={() => handleSharePost(post)}
                            className="lume-social-action"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              color: "var(--text-secondary)",
                              fontSize: "14px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "color 0.2s",
                            }}
                          >
                            <Send size={18} />
                            {post.shares}
                          </button>
                        </div>
                        {commentingPostId === post.id && (
                          <div className="lume-comment-box">
                            <input
                              value={quickComment}
                              onChange={(event) => setQuickComment(event.target.value)}
                              placeholder={isPT ? "Escreva uma resposta rapida..." : "Write a quick reply..."}
                            />
                            <button onClick={() => handleQuickComment(post.id)} className="btn-gold">
                              <Send size={15} />
                              {isPT ? "Enviar" : "Send"}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
