import { supabase } from './supabase'

// Get current user's profile, create if missing
export async function getOrCreateProfile(userId: string, email: string) {
  // Try to get existing profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  
  if (error?.code === '42P01') {
    // Table doesn't exist — redirect to setup
    if (typeof window !== 'undefined') {
      window.location.href = '/setup'
    }
    return null
  }
  
  if (data) return data
  
  // Profile missing — create it
  const { data: created } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      email,
      full_name: email.split('@')[0]
    }, { onConflict: 'id' })
    .select()
    .maybeSingle()
  
  return created
}

// Get all stats for home/progress pages
export async function getUserStats(userId: string) {
  try {
    const [convResult, exprResult, profileResult] = await Promise.all([
      supabase.from('conversations').select('id, duration_seconds, xp_earned, created_at, topic_slug, topic_title, messages').eq('student_id', userId).order('created_at', { ascending: false }),
      supabase.from('saved_expressions').select('*').eq('student_id', userId).order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    ])
    
    // Check if table missing error (42P01) occurred in any query
    if (convResult.error?.code === '42P01' || exprResult.error?.code === '42P01' || profileResult.error?.code === '42P01') {
      if (typeof window !== 'undefined') {
        window.location.href = '/setup'
      }
      return {
        conversations: [],
        expressions: [],
        profile: null,
        stats: { conversationCount: 0, expressionCount: 0, totalMinutes: 0, streak: 0, xp: 0, level: 'beginner' }
      }
    }

    const conversations = convResult.data || []
    const expressions = exprResult.data || []
    const profile = profileResult.data
    
    const totalMinutes = Math.round(
      conversations.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60
    )
    
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
        level: profile?.level || 'beginner'
      }
    }
  } catch (e) {
    console.error('Stats fetch error:', e)
    return {
      conversations: [],
      expressions: [],
      profile: null,
      stats: { conversationCount: 0, expressionCount: 0, totalMinutes: 0, streak: 0, xp: 0, level: 'beginner' }
    }
  }
}

// Award XP and check for level up
export async function awardXP(userId: string, amount: number, currentXP: number) {
  const newXP = currentXP + amount
  
  await supabase
    .from('profiles')
    .update({ xp: newXP, updated_at: new Date().toISOString() })
    .eq('id', userId)
  
  return newXP
}

// Update streak after completing a session
export async function updateStreak(userId: string, lastSessionDate: string | null) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  
  let newStreak = 1
  
  if (lastSessionDate === today) {
    // Already practiced today — don't increment
    return null
  } else if (lastSessionDate === yesterday) {
    // Practiced yesterday — increment streak
    const { data } = await supabase
      .from('profiles')
      .select('streak')
      .eq('id', userId)
      .maybeSingle()
    newStreak = (data?.streak || 0) + 1
  }
  // else streak resets to 1
  
  await supabase
    .from('profiles')
    .update({ 
      streak: newStreak, 
      last_session_date: today,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  return newStreak
}

// Save a completed conversation
export async function saveConversation(userId: string, data: {
  topic_slug: string
  topic_title: string
  language: string
  mood: string
  messages: any[]
  duration_seconds: number
  xp_earned: number
}) {
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ student_id: userId, ...data })
    .select()
    .maybeSingle()
  
  if (error) console.error('Save conversation error:', error)
  return conv
}

// Save an expression
export async function saveExpression(userId: string, expression: string, context: string, topicSlug: string) {
  const { data, error } = await supabase
    .from('saved_expressions')
    .insert({ student_id: userId, expression, context, topic_slug: topicSlug })
    .select()
    .maybeSingle()
  
  if (error) console.error('Save expression error:', error)
  return data
}

// Save progress snapshot
export async function saveProgressSnapshot(userId: string, xpTotal: number) {
  const today = new Date().toISOString().split('T')[0]
  const confidence = Math.min(100, Math.round(xpTotal / 10))
  
  await supabase
    .from('progress_snapshots')
    .upsert({
      student_id: userId,
      date: today,
      speaking_confidence: confidence,
      xp_total: xpTotal
    }, { onConflict: 'student_id,date' })
}

// Check which badges are unlocked
export function checkBadges(stats: {
  conversationCount: number
  expressionCount: number
  totalMinutes: number
  streak: number
  completedTopics: string[]
  quizzesCompleted: number
  bestQuizStreak: number
}) {
  return {
    firstSpark: stats.conversationCount >= 1,
    chatterbox: stats.conversationCount >= 10,
    cultureLover: stats.completedTopics.includes('art-culture'),
    worldTraveler: stats.completedTopics.includes('travel'),
    professional: stats.completedTopics.includes('professional'),
    confidenceBuilder: stats.completedTopics.filter(t => t === 'speaking-confidence').length >= 3,
    expressionCollector: stats.expressionCount >= 20,
    dedicated: stats.totalMinutes >= 60,
    onFire: stats.streak >= 7,
    quizMaster: stats.quizzesCompleted >= 50,
    speedDemon: stats.bestQuizStreak >= 10,
  }
}
