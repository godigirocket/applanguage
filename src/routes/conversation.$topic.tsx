import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { safeQuery, supabase } from "@/lib/supabase";
import { saveConversation, awardXP, updateStreak, saveProgressSnapshot } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/hooks/useStore";
import { TOPIC_BY_SLUG, MOODS } from "@/lib/topics";
import { lumeChat } from "@/lib/lume-ai.functions";
import { getGoogleTTS } from "@/lib/tts.functions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Volume2, VolumeX, Save, Play,
  Clock, Sparkles, Trophy, Mic, Send
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/conversation/$topic")({
  head: ({ params }) => ({
    meta: [{ title: `${TOPIC_BY_SLUG[params.topic]?.title || "Conversation"} — Lume` }],
  }),
  component: ConversationPage,
});

const ENCOURAGEMENTS = [
  "You're doing great!",
  "Every sentence counts.",
  "Mistakes are how we learn.",
  "Keep going.",
  "You're braver than you think."
];

function ConversationPage() {
  const { topic: topicSlug } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const t = TOPIC_BY_SLUG[topicSlug];

  const chatFn = useServerFn(lumeChat);
  const ttsFn = useServerFn(getGoogleTTS);

  const {
    messages, addMessage, clearMessages,
    addXP, language
  } = useStore();

  const [profile, setProfile] = useState<any>(null);
  const [activeMood, setActiveMood] = useState<any>("calm");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionExpressions, setSessionExpressions] = useState(0);
  const [sessionSavedList, setSessionSavedList] = useState<string[]>([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  
  const [vocabulary, setVocabulary] = useState<{ word: string; translation: string }[]>([]);
  const [culturalTip, setCulturalTip] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  useEffect(() => {
    if (!authLoading && !user) { nav({ to: "/login" }); return; }
    if (user) {
      safeQuery(() => supabase.from("profiles").select("*").eq("id", user.id).maybeSingle())
        .then((data) => {
          setProfile(data);
          if (data?.preferred_mood) setActiveMood(data.preferred_mood);
        });
    }
    clearMessages();
    
    // Fetch initial vocabulary and tip
    if (t) {
      chatFn({
        data: {
          topic: t.title,
          language: language as any,
          level: "beginner",
          studentName: "Student",
          mood: "cultural",
          messages: [{ role: "user", content: `(System: Generate 5 key vocabulary words with translations and 1 cultural tip for "${t.title}". Format JSON: { "vocab": [{"word": "word", "translation": "trad"}], "tip": "one sentence" })` }],
        }
      }).then(res => {
        try {
          const parsed = JSON.parse(res.reply);
          setVocabulary(parsed.vocab || []);
          setCulturalTip(parsed.tip || "");
        } catch (e) { console.error(e); }
      });
    }

    timerRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [user, authLoading, nav, topicSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 1. AUTO-GENERATED FIRST MESSAGE on mount
  useEffect(() => {
    if (profile && messages.length === 0 && !isTyping) {
      generateFirstMessage();
    }
  }, [profile]);

  async function playTTS(text: string) {
    if (typeof window === "undefined" || isMuted) return;
    try {
      const code = language === "pt" ? "pt-BR" : "en-US";
      const { audioContent } = await ttsFn({ data: { text, languageCode: code as any } });
      if (audioContent) {
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audioRef.current = audio;
        await audio.play();
      }
    } catch (e) { console.error("TTS failed", e); }
  }

  async function generateFirstMessage() {
    setIsTyping(true);
    try {
      const res = await chatFn({
        data: {
          topic: t?.title || "Free Talk",
          language: language as any,
          mood: activeMood,
          level: profile?.level || "beginner",
          studentName: profile?.full_name || "Friend",
          messages: [{ role: "user", content: `(Greeting: Invite student to talk about ${t?.title || "anything"})` }],
        },
      });
      setIsTyping(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);
    } catch (e) {
      setIsTyping(false);
      toast.error("Failed to start conversation.");
    }
  }

  // 2. SEND MESSAGE function
  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;
    
    const userMsg = { role: "user" as const, content };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);
    
    try {
      const res = await chatFn({
        data: {
          topic: t?.title || "Free Talk",
          language: language as any,
          mood: activeMood,
          level: profile?.level || "beginner",
          studentName: profile?.full_name || "Friend",
          messages: [...messages, userMsg],
        },
      });
      setIsLoading(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);
      
      // Award XP
      const earned = 2;
      setSessionXP(prev => prev + earned);
      addXP(earned);
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to get response.");
    }
  }

  // 3. WEB SPEECH API for voice input
  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice not supported in this browser. Try Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'pt' ? 'pt-BR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
      if (event.results[0].isFinal) {
        sendMessage(transcript);
      }
    };
    recognition.start();
  }

  // 4. SAVE EXPRESSION on long press / button click
  async function saveExpression(messageContent: string) {
    if (!user) return;
    const trimmed = messageContent.slice(0, 200);
    const { error } = await supabase.from('saved_expressions').insert({
      student_id: user.id,
      expression: trimmed,
      context: t?.title || "Free Talk",
      topic_slug: topicSlug
    });
    
    if (!error) {
      const earned = 2;
      setSessionXP(prev => prev + earned);
      addXP(earned);
      toast.success('Expression saved! +2 XP 📚');
      setSessionExpressions(prev => prev + 1);
      setSessionSavedList(prev => [...prev, messageContent]);
    } else {
      toast.error("Failed to save expression.");
    }
  }

  // 5. END SESSION — saves to DB, awards XP, shows modal
  async function endSession() {
    if (!user) return;
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const userMessages = messages.filter(m => m.role === 'user').length;
    const xpEarned = Math.max(5, userMessages * 3 + sessionExpressions * 2);
    
    setSessionSummary({ duration, messages: messages.length, xp: xpEarned, expressions: sessionExpressions });
    setShowEndModal(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    
    // Save to DB in background
    try {
      // Save conversation
      await saveConversation(user.id, {
        topic_slug: topicSlug,
        topic_title: topicTitle,
        language: profile?.language || language || 'en',
        mood: activeMood,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        duration_seconds: duration,
        xp_earned: xpEarned
      });
      
      // Award XP
      const newXP = await awardXP(user.id, xpEarned, profile?.xp || 0);
      
      // Update streak
      await updateStreak(user.id, profile?.last_session_date);
      
      // Save progress snapshot
      await saveProgressSnapshot(user.id, newXP);
      
    } catch (e) {
      console.error('End session save failed:', e);
      // Don't crash — session still happened
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, "0")}`;
  };

  if (!t && topicSlug !== "free-talk") return null;

  const topicEmoji = t?.icon || "🗣️";
  const topicTitle = t?.title || "Free Talk";
  const topicDescription = t?.description || "A relaxed space to talk about anything.";

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 220px',
        height: 'calc(100vh - 64px)',
        gap: '0',
        overflow: 'hidden'
      }}>

        {/* LEFT PANEL */}
        <div style={{
          borderRight: '1px solid #E0DDD6',
          padding: '24px 20px',
          overflowY: 'auto',
          background: '#FAFAF8',
          display: isMobile ? 'none' : 'block'
        }}>
          <div style={{marginBottom:'24px'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>{topicEmoji}</div>
            <h2 style={{fontFamily:'Nunito, sans-serif',fontSize:'20px',marginBottom:'4px'}}>{topicTitle}</h2>
            <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.5}}>{topicDescription}</p>
          </div>
          
          {/* Mood selector */}
          <div style={{marginBottom:'24px'}}>
            <p style={{fontSize:'11px',fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-secondary)',marginBottom:'10px'}}>Mood</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {MOODS.map(mood => (
                <button key={mood.slug} onClick={() => setActiveMood(mood.slug)} style={{
                  padding:'10px 8px', borderRadius:'12px',
                  background: activeMood === mood.slug ? (mood as any).color || 'var(--accent-green)' : 'white',
                  color: activeMood === mood.slug ? 'white' : 'var(--text-primary)',
                  cursor:'pointer', textAlign:'center',
                  boxShadow: activeMood === mood.slug ? `0 4px 16px ${ (mood as any).color || 'var(--accent-green)'}40` : '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  border: activeMood === mood.slug ? `2px solid ${ (mood as any).color || 'var(--accent-green)'}` : '2px solid #E0DDD6'
                }}>
                  <div style={{fontSize:'18px',marginBottom:'3px'}}>{mood.icon}</div>
                  <div style={{fontSize:'11px',fontWeight:700}}>{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Vocabulary */}
          {vocabulary.length > 0 && (
            <div style={{marginBottom:'24px'}}>
              <p style={{fontSize:'11px',fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-secondary)',marginBottom:'10px'}}>Key Vocabulary</p>
              {vocabulary.map((v,i) => (
                <div key={i} style={{marginBottom:'8px',padding:'10px 12px',background: 'var(--surface-raised)',borderRadius:'10px',border:'1px solid #E0DDD6'}}>
                  <div style={{fontWeight:700,fontSize:'14px',color:'var(--text-primary)'}}>{v.word}</div>
                  <div style={{fontSize:'12px',color:'var(--text-secondary)',fontStyle:'italic'}}>{v.translation}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Cultural tip */}
          {culturalTip && (
            <div style={{padding:'12px',background:'rgba(196,113,74,0.08)',borderRadius:'12px',border:'1px solid rgba(196,113,74,0.2)'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'var(--accent-terra)',marginBottom:'4px'}}>🌎 Cultural tip</div>
              <div style={{fontSize:'12px',color:'var(--text-primary)',lineHeight:1.5}}>{culturalTip}</div>
            </div>
          )}
        </div>

        {/* CENTER — CHAT */}
        <div style={{display:'flex',flexDirection:'column',overflow:'hidden', background: 'var(--surface-raised)'}}>
          
          {/* Chat header */}
          <div style={{
            padding:'12px 20px',
            borderBottom:'1px solid #E0DDD6',
            display:'flex',alignItems:'center',
            justifyContent:'space-between',
            background: 'var(--surface-raised)'
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <Link to="/home" style={{
                width:'36px',height:'36px',borderRadius:'50%',
                background:'#F0EEE9',border:'none',cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                textDecoration:'none',color:'var(--text-primary)',fontSize:'16px'
              }}>←</Link>
              <div>
                <div style={{fontWeight:700,fontSize:'15px'}}>{topicEmoji} {topicTitle}</div>
                <div style={{fontSize:'12px',color:'var(--text-secondary)'}}>
                  {formatTime(sessionDuration)} · {messages.filter(m=>m.role==='user').length} messages
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <button 
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  background: isVoiceMode ? 'var(--accent-terra)' : '#F0EEE9',
                  color: isVoiceMode ? 'white' : 'var(--accent-terra)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isVoiceMode ? '0 4px 12px rgba(196,113,74,0.25)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isVoiceMode ? "💬 Chat Mode" : "🎙️ Immersive Voice"}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} style={{
                width:'36px',height:'36px',borderRadius:'50%',
                background:'#F0EEE9',border:'none',cursor:'pointer',fontSize:'16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
              {messages.length >= 6 && (
                <button onClick={endSession} style={{
                  padding:'8px 16px',borderRadius:'99px',
                  background:'var(--accent-green)',color:'white',
                  border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700
                }}>End session</button>
              )}
            </div>
          </div>

          {/* Messages or Immersive Voice UI */}
          {isVoiceMode ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, #1B3A4B 0%, #0F202B 100%)',
              color: 'white',
              padding: '40px 24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Grid Background */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div style={{ position: 'relative', zIndex: 10, maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '11px', fontWeight: 800, color: '#C9A84C', 
                  textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px'
                }}>
                  {isListening ? '● Listening' : isLoading ? '● Thinking' : '🎙️ Hands-Free Call'}
                </span>
                
                <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', marginBottom: '16px', fontWeight: 700 }}>
                  {isListening ? 'Fale naturalmente' : isLoading ? 'Lume está elaborando...' : 'Pronto para Conversar'}
                </h2>
                
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.6, marginBottom: '48px' }}>
                  {language === 'pt' 
                    ? 'Feche os olhos e fale. O Lume vai te escutar e responder por voz automaticamente, como um telefonema real!' 
                    : 'Close your eyes and speak. Lume will listen and talk back to you automatically, just like a real phone call!'}
                </p>

                {/* breathing Glowing Orb */}
                <div style={{ position: 'relative', marginBottom: '48px', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(196,113,74,0.3)', border: '1.5px solid #C4714A' }}
                        />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 2.3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.7, ease: "easeOut" }}
                          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(196,113,74,0.15)', border: '1px solid #C4714A' }}
                        />
                      </>
                    )}
                    {isLoading && (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        style={{ position: 'absolute', width: '110%', height: '110%', borderRadius: '50%', border: '2.5px dashed rgba(201, 168, 76, 0.4)' }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div 
                    animate={isListening ? { scale: [1, 1.1, 1] } : isLoading ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    onClick={isListening ? () => {} : startListening}
                    style={{
                      width: '180px', height: '180px',
                      borderRadius: '50%',
                      background: isListening 
                        ? 'radial-gradient(circle, #D4834A 0%, #C4714A 100%)' 
                        : isLoading 
                        ? 'radial-gradient(circle, #E5C365 0%, #C9A84C 100%)' 
                        : 'radial-gradient(circle, #4A7A5A 0%, #2D4A3E 100%)',
                      boxShadow: isListening 
                        ? '0 12px 48px rgba(196,113,74,0.45)' 
                        : isLoading 
                        ? '0 12px 48px rgba(201,168,76,0.35)' 
                        : '0 12px 48px rgba(45,74,62,0.35)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', zIndex: 12,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Mic size={40} color="white" />
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '10px', color: 'white' }}>
                      {isListening ? 'Escutando...' : isLoading ? 'Processando...' : 'Toque p/ Falar'}
                    </span>
                  </motion.div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setIsVoiceMode(false)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '99px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.25s'
                    }}
                    className="hover:bg-white/20 active:scale-95"
                  >
                    💬 Ver Transcrição / Escrever
                  </button>
                  
                  {messages.length > 0 && (
                    <button 
                      onClick={() => {
                        const lastMsg = messages[messages.length - 1];
                        if (lastMsg) playTTS(lastMsg.content);
                      }}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '99px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.25s'
                      }}
                      className="hover:bg-white/20 active:scale-95"
                    >
                      🔊 Repetir Áudio
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div style={{
                flex:1, overflowY:'auto', padding:'24px 20px',
                display:'flex',flexDirection:'column',gap:'16px'
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display:'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems:'flex-end',
                    gap:'10px',
                    animation:'messageIn 0.3s ease both'
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        width:'32px',height:'32px',borderRadius:'50%',flexShrink:0,
                        background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'14px'
                      }}>✨</div>
                    )}
                    <div style={{maxWidth:'72%'}}>
                      <div style={{
                        padding:'14px 18px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg,#2D4A3E,#1B3A4B)'
                          : 'var(--bg)',
                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px',
                        boxShadow: msg.role === 'user'
                          ? '0 4px 16px rgba(45,74,62,0.25)'
                          : '0 2px 12px rgba(0,0,0,0.07)',
                        border: msg.role === 'assistant' ? '1px solid rgba(224,221,214,0.5)' : 'none',
                        fontSize:'15px', lineHeight:1.7
                      }}>
                        {msg.content}
                      </div>
                      {msg.role === 'assistant' && (
                        <div style={{display:'flex',gap:'6px',marginTop:'6px'}}>
                          <button onClick={() => playTTS(msg.content)} style={{
                            padding:'3px 10px',borderRadius:'99px',
                            background:'rgba(45,74,62,0.08)',border:'none',cursor:'pointer',
                            fontSize:'11px',fontWeight:700,color:'var(--accent-green)'
                          }}>🔊</button>
                          <button onClick={() => saveExpression(msg.content)} style={{
                            padding:'3px 10px',borderRadius:'99px',
                            background:'rgba(201,168,76,0.1)',border:'none',cursor:'pointer',
                            fontSize:'11px',fontWeight:700,color:'#B8962A'
                          }}>💾 Save</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div style={{display:'flex',alignItems:'flex-end',gap:'10px'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>✨</div>
                    <div style={{padding:'14px 18px',background:'var(--bg)',borderRadius:'4px 20px 20px 20px',boxShadow:'0 2px 12px rgba(0,0,0,0.07)',border:'1px solid rgba(224,221,214,0.5)'}}>
                      <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: 'var(--accent-green)',
                            animation: `typingDot 1.4s ease ${i * 0.2}s infinite`
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* Input area */}
              <div style={{
                padding:'16px 20px',background: 'var(--surface-raised)',
                borderTop:'1px solid #E0DDD6',
                boxShadow:'0 -4px 24px rgba(0,0,0,0.06)'
              }}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
                  {/* Mic button */}
                  <button onClick={isListening ? () => {} : startListening} style={{
                    width:'72px',height:'72px',borderRadius:'50%',border:'none',
                    background: isListening
                      ? 'linear-gradient(135deg,#C4714A,#D4834A)'
                      : isLoading
                      ? 'var(--border)'
                      : 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize:'28px',
                    boxShadow: isListening
                      ? '0 0 0 8px rgba(196,113,74,0.15), 0 8px 24px rgba(196,113,74,0.35)'
                      : '0 8px 24px rgba(45,74,62,0.3)',
                    animation: isListening ? 'micPulse 1s ease-out infinite' : 'none',
                    transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: isListening ? 'scale(1.1)' : 'scale(1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                  }}>
                    {isListening ? <Mic size={28} /> : isLoading ? <Clock size={28} /> : <Mic size={28} />}
                  </button>
                  <span style={{fontSize:'11px',color:'var(--text-secondary)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em'}}>
                    {isListening ? '● Recording' : isLoading ? 'Thinking...' : 'Tap to speak'}
                  </span>
                  
                  {/* Text input */}
                  <div style={{display:'flex',gap:'10px',width:'100%'}}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                      placeholder="Or type here..."
                      disabled={isLoading}
                      style={{
                        flex:1, padding:'12px 18px', borderRadius:'99px',
                        border:'1.5px solid #E0DDD6', background:'var(--bg)',
                        fontSize:'15px', outline:'none',
                        fontFamily:'"DM Sans", sans-serif',
                        transition:'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor='var(--accent-green)'}
                      onBlur={e => e.target.style.borderColor='var(--border)'}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      style={{
                        width:'44px',height:'44px',borderRadius:'50%',
                        background: input.trim() ? 'var(--accent-green)' : 'var(--border)',
                        color:'white',border:'none',cursor: input.trim() ? 'pointer' : 'not-allowed',
                        fontSize:'18px',flexShrink:0,
                        transition:'background 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    ><Send size={18} /></button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          borderLeft:'1px solid #E0DDD6',
          padding:'24px 16px',
          background:'#FAFAF8',
          overflowY:'auto',
          display: isMobile ? 'none' : 'block'
        }}>
          <p style={{fontSize:'11px',fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-secondary)',marginBottom:'16px'}}>This session</p>
          
          {/* Session timer */}
          <div style={{
            padding:'14px',background: 'var(--surface-raised)',borderRadius:'14px',
            border:'1px solid #E0DDD6',marginBottom:'16px',textAlign:'center'
          }}>
            <div style={{fontSize:'28px',fontFamily:'Nunito, sans-serif',fontWeight:700,color:'var(--accent-green)'}}>
              {formatTime(sessionDuration)}
            </div>
            <div style={{fontSize:'11px',color:'var(--text-secondary)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Practice time</div>
          </div>
          
          {/* XP this session */}
          <div style={{
            padding:'14px',background:'rgba(201,168,76,0.08)',borderRadius:'14px',
            border:'1px solid rgba(201,168,76,0.2)',marginBottom:'16px',textAlign:'center'
          }}>
            <div style={{fontSize:'22px',fontFamily:'Nunito, sans-serif',fontWeight:700,color:'#C9A84C'}}>
              +{sessionXP} XP
            </div>
            <div style={{fontSize:'11px',color:'var(--text-secondary)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Earned so far</div>
          </div>
          
          {/* Saved expressions this session */}
          <div style={{marginBottom:'16px'}}>
            <p style={{fontSize:'11px',fontWeight:700,color:'var(--text-secondary)',marginBottom:'8px'}}>💾 Saved ({sessionExpressions})</p>
            {sessionSavedList.length === 0 ? (
              <p style={{fontSize:'12px',color:'var(--text-secondary)',fontStyle:'italic',padding:'8px'}}>Tap "Save" on any AI message</p>
            ) : (
              sessionSavedList.slice(-3).map((exp,i) => (
                <div key={i} style={{padding:'8px 10px',background: 'var(--surface-raised)',borderRadius:'8px',border:'1px solid #E0DDD6',marginBottom:'6px',fontSize:'12px',color:'var(--text-primary)'}}>
                  {exp.slice(0,60)}...
                </div>
              ))
            )}
          </div>
          
          {/* Encouragement */}
          <div style={{
            padding:'12px',background:'rgba(45,74,62,0.06)',borderRadius:'14px',
            border:'1px solid rgba(45,74,62,0.1)'
          }}>
            <p style={{fontSize:'13px',color:'var(--accent-green)',fontStyle:'italic',lineHeight:1.6,textAlign:'center'}}>
              {ENCOURAGEMENTS[Math.floor(sessionDuration/60) % ENCOURAGEMENTS.length]}
            </p>
          </div>
        </div>
      </div>

      {/* END SESSION MODAL */}
      <AnimatePresence>
        {showEndModal && sessionSummary && (
          <div style={{
            position:'fixed',inset:0,zIndex:9999,
            background:'rgba(0,0,0,0.7)',backdropFilter:'blur(16px)',
            display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{
                background: 'var(--surface-raised)',borderRadius:'28px',
                padding:'40px 36px',textAlign:'center',
                maxWidth:'400px',width:'100%',
                boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{fontSize:'64px',marginBottom:'12px',lineHeight:1}}>
                {sessionSummary.xp >= 30 ? '🏆' : sessionSummary.xp >= 15 ? '🥇' : '🎉'}
              </div>
              <h2 style={{fontFamily:'Nunito, sans-serif',fontSize:'28px',marginBottom:'8px'}}>
                Great session!
              </h2>
              <p style={{color:'var(--text-secondary)',fontSize:'15px',marginBottom:'28px',fontStyle:'italic'}}>
                Every conversation makes you better.
              </p>
              
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
                {[
                  { emoji:'⏱️', value:formatTime(sessionSummary.duration), label:'Duration' },
                  { emoji:'💬', value:sessionSummary.messages, label:'Messages' },
                  { emoji:'⭐', value:`+${sessionSummary.xp}`, label:'XP Earned' },
                ].map((stat,i) => (
                  <div key={i} style={{padding:'14px 8px',background:'var(--bg)',borderRadius:'14px'}}>
                    <div style={{fontSize:'22px',marginBottom:'4px'}}>{stat.emoji}</div>
                    <div style={{fontFamily:'Nunito, sans-serif',fontSize:'20px',fontWeight:700,color:'var(--text-primary)'}}>{stat.value}</div>
                    <div style={{fontSize:'11px',color:'var(--text-secondary)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {sessionSummary.expressions > 0 && (
                <div style={{
                  padding:'12px',background:'rgba(201,168,76,0.1)',borderRadius:'12px',
                  border:'1px solid rgba(201,168,76,0.2)',marginBottom:'20px',
                  fontSize:'14px',color:'#8B6914',fontWeight:600
                }}>
                  📚 You saved {sessionSummary.expressions} expression{sessionSummary.expressions>1?'s':''}!
                </div>
              )}
              
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <button onClick={() => { setShowEndModal(false); nav({ to: '/home' }) }} style={{
                  width:'100%',padding:'16px',borderRadius:'16px',
                  background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                  color:'white',border:'none',cursor:'pointer',
                  fontSize:'16px',fontWeight:700,
                  boxShadow:'0 4px 20px rgba(45,74,62,0.35)'
                }}>Back to Home 🏠</button>
                <button onClick={() => { setShowEndModal(false); clearMessages(); generateFirstMessage() }} style={{
                  width:'100%',padding:'14px',borderRadius:'16px',
                  background: 'var(--surface-raised)',color:'var(--text-primary)',
                  border:'2px solid #E0DDD6',cursor:'pointer',
                  fontSize:'15px',fontWeight:700
                }}>Keep Practicing 🔄</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}