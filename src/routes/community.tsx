import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { TopicScenario } from "@/components/lume/TopicScenario";
import { pickRotatingTopic } from "@/lib/language-content/game-questions";
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
  Video,
  Music,
} from "@/components/lume/CustomIcons";
import { SIMULATED_USERS } from "@/data/communityUsers";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

// 100+ SIMULATED FEED POSTS
const FEED_POSTS = [
  {
    id: 1,
    user: SIMULATED_USERS[0],
    type: "achievement",
    content:
      "Acabei de completar minha 100ª lição! Quem diria que eu conseguiria chegar tão longe? #Milestone",
    image: null,
    likes: 234,
    comments: 18,
    shares: 5,
    timestamp: "2h atrás",
    tags: ["milestone", "achievement"],
  },
  {
    id: 2,
    user: SIMULATED_USERS[1],
    type: "question",
    content:
      "Alguém pode me explicar a diferença entre 'por' e 'para' em espanhol? Sempre me confundo com esses dois! 😅",
    image: null,
    likes: 89,
    comments: 34,
    shares: 2,
    timestamp: "3h atrás",
    tags: ["grammar", "help"],
  },
  {
    id: 3,
    user: SIMULATED_USERS[2],
    type: "streak",
    content: "200 DIAS DE OFENSIVA! A consistência é tudo. Quem mais está mantendo a chama acesa?",
    image: null,
    likes: 456,
    comments: 67,
    shares: 12,
    timestamp: "5h atrás",
    tags: ["streak", "motivation"],
  },
  {
    id: 4,
    user: SIMULATED_USERS[3],
    type: "tip",
    content:
      "DICA: Assistir séries com legendas no idioma que você está aprendendo (não na sua língua nativa) ajuda MUITO! Comecei fazendo isso e minha compreensão melhorou 3x",
    image: null,
    likes: 312,
    comments: 42,
    shares: 89,
    timestamp: "7h atrás",
    tags: ["tip", "listening"],
  },
  {
    id: 5,
    user: SIMULATED_USERS[4],
    type: "meme",
    content: "POV: Você tentando usar uma nova palavra que aprendeu em uma conversa real 😂",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
    likes: 567,
    comments: 93,
    shares: 234,
    timestamp: "10h atrás",
    tags: ["meme", "relatable"],
  },
  {
    id: 6,
    user: SIMULATED_USERS[0],
    type: "challenge",
    content:
      "DESAFIO: Tente ter uma conversa de 5 minutos hoje usando APENAS o idioma que está aprendendo. Quem aceita? 💪",
    image: null,
    likes: 178,
    comments: 56,
    shares: 23,
    timestamp: "12h atrás",
    tags: ["challenge", "speaking"],
  },
  {
    id: 7,
    user: SIMULATED_USERS[1],
    type: "cultural",
    content:
      "Acabei de visitar Tóquio e AMEI! A experiência de imersão cultural é incrível. Aprendi mais em 2 semanas do que em 6 meses estudando sozinho",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    likes: 423,
    comments: 78,
    shares: 45,
    timestamp: "1d atrás",
    tags: ["travel", "culture"],
  },
  {
    id: 8,
    user: SIMULATED_USERS[2],
    type: "resource",
    content:
      "Top 3 recursos gratuitos que estou usando:\n1. Podcasts nativos no Spotify\n2. Apps de troca de idiomas\n3. Canais do YouTube\n\nQuais vocês recomendam?",
    image: null,
    likes: 289,
    comments: 124,
    shares: 67,
    timestamp: "1d atrás",
    tags: ["resources", "tips"],
  },
];

interface FeedPost {
  id: number | string;
  user: { id: number | string; name: string; avatar: string; level: number; xp: number; country: string; streak: number };
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

function CommunityPage() {
  const { interfaceLanguage, isKidAccount } = useStore();
  const { user } = useAuth();
  const nav = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [postText, setPostText] = useState("");
  const [realPosts, setRealPosts] = useState<FeedPost[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
              level: 1,
              xp: 0,
              country: "🌍",
              streak: 0,
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
        user: { id: user.id, name: authorName, avatar: "👤", level: 1, xp: 0, country: "🌍", streak: 0 },
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
  const allPosts = [...realPosts, ...FEED_POSTS];
  const visiblePosts =
    activeFilter === "all"
      ? allPosts
      : allPosts.filter((post) => FILTER_TO_POST_TYPES[activeFilter]?.includes(post.type));

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
    >
      <TopicScenario topic={pickRotatingTopic("community")} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HEADER */}
        <div
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

            {/* STATS BAR */}
            <div style={{ display: "flex", gap: "32px", marginTop: "20px", flexWrap: "wrap" }}>
              {[
                { icon: Users, label: isPT ? "Membros Online" : "Members Online", value: "2,847" },
                { icon: MessageCircle, label: isPT ? "Posts Hoje" : "Posts Today", value: "156" },
                { icon: Globe, label: isPT ? "Países" : "Countries", value: "89" },
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
          <div className="community-grid">
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className="community-sidebar">
              <div
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
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "var(--brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        flexShrink: 0,
                      }}
                    >
                      👤
                    </div>
                    <div style={{ flex: 1 }}>
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
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      background: "var(--surface-raised)",
                      borderRadius: "20px",
                      border: "2px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <MessageCircle size={32} style={{ marginBottom: "12px", opacity: 0.6 }} />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>
                      {isPT
                        ? "Nenhum post nessa categoria ainda."
                        : "No posts in this category yet."}
                    </p>
                  </div>
                )}
                {visiblePosts.map((post, i) => {
                  const PostIcon = getPostIcon(post.type);
                  const postColor = getPostColor(post.type);

                  return (
                    <motion.div
                      key={post.id}
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
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: "var(--brand)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                              flexShrink: 0,
                            }}
                          >
                            {post.user.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
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
                              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                {post.user.country}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  padding: "2px 8px",
                                  background: postColor + "20",
                                  color: postColor,
                                  borderRadius: "6px",
                                  fontWeight: 700,
                                }}
                              >
                                Lvl {post.user.level}
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
                            <Heart size={18} />
                            {post.likes}
                          </button>
                          <button
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
