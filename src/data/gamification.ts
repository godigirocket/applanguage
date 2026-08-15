/**
 * GAMIFICATION SYSTEM - AAA LEVEL
 * Inspired by: Duolingo, Clash Royale, League of Legends
 */

// LEAGUES & DIVISIONS
export const LEAGUES = [
  {
    id: "bronze",
    name: { pt: "Bronze", en: "Bronze", es: "Bronce" },
    minXP: 0,
    maxXP: 999,
    color: "#CD7F32",
    gradient: "linear-gradient(135deg, #CD7F32 0%, #B87333 100%)",
    icon: "🥉",
    divisions: 3,
    rewards: { coins: 100, badge: "bronze_champion" },
  },
  {
    id: "silver",
    name: { pt: "Prata", en: "Silver", es: "Plata" },
    minXP: 1000,
    maxXP: 2999,
    color: "#C0C0C0",
    gradient: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
    icon: "🥈",
    divisions: 3,
    rewards: { coins: 250, badge: "silver_champion" },
  },
  {
    id: "gold",
    name: { pt: "Ouro", en: "Gold", es: "Oro" },
    minXP: 3000,
    maxXP: 5999,
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    icon: "🥇",
    divisions: 3,
    rewards: { coins: 500, badge: "gold_champion" },
  },
  {
    id: "platinum",
    name: { pt: "Platina", en: "Platinum", es: "Platino" },
    minXP: 6000,
    maxXP: 9999,
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
    icon: "💎",
    divisions: 3,
    rewards: { coins: 1000, badge: "platinum_champion" },
  },
  {
    id: "diamond",
    name: { pt: "Diamante", en: "Diamond", es: "Diamante" },
    minXP: 10000,
    maxXP: 19999,
    color: "#B9F2FF",
    gradient: "linear-gradient(135deg, #B9F2FF 0%, #00CED1 100%)",
    icon: "💠",
    divisions: 3,
    rewards: { coins: 2000, badge: "diamond_champion" },
  },
  {
    id: "master",
    name: { pt: "Mestre", en: "Master", es: "Maestro" },
    minXP: 20000,
    maxXP: 39999,
    color: "#9B59B6",
    gradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)",
    icon: "👑",
    divisions: 2,
    rewards: { coins: 5000, badge: "master_champion" },
  },
  {
    id: "grandmaster",
    name: { pt: "Grão-Mestre", en: "Grandmaster", es: "Gran Maestro" },
    minXP: 40000,
    maxXP: 99999,
    color: "#E74C3C",
    gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
    icon: "🔥",
    divisions: 1,
    rewards: { coins: 10000, badge: "grandmaster_champion" },
  },
  {
    id: "legend",
    name: { pt: "Lendário", en: "Legend", es: "Legendario" },
    minXP: 100000,
    maxXP: Infinity,
    color: "#F39C12",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%, #FF4500 100%)",
    icon: "⭐",
    divisions: 1,
    rewards: { coins: 25000, badge: "legend_champion" },
  },
];

// ACHIEVEMENTS SYSTEM (100+ badges)
// `requirement` mirrors `name`'s { pt, en } shape — it used to be a bare
// English string shown as-is even in the Portuguese UI (e.g. "7 day streak"
// under a card titled "Semana de Fogo").
export const ACHIEVEMENTS = [
  // STREAK ACHIEVEMENTS
  { id: "streak_7", name: { pt: "Semana de Fogo", en: "Week of Fire" }, icon: "🔥", requirement: { pt: "Sequência de 7 dias", en: "7 day streak" }, xp: 50, coins: 25 },
  { id: "streak_30", name: { pt: "Mês Incansável", en: "Unstoppable Month" }, icon: "💪", requirement: { pt: "Sequência de 30 dias", en: "30 day streak" }, xp: 200, coins: 100 },
  { id: "streak_100", name: { pt: "Centenário", en: "Centurion" }, icon: "🏆", requirement: { pt: "Sequência de 100 dias", en: "100 day streak" }, xp: 500, coins: 250 },
  { id: "streak_365", name: { pt: "Ano de Dedicação", en: "Year of Dedication" }, icon: "🌟", requirement: { pt: "Sequência de 365 dias", en: "365 day streak" }, xp: 2000, coins: 1000 },

  // XP ACHIEVEMENTS
  { id: "xp_1000", name: { pt: "Primeiros Mil", en: "First Thousand" }, icon: "⚡", requirement: { pt: "1.000 XP", en: "1,000 XP" }, xp: 100, coins: 50 },
  { id: "xp_5000", name: { pt: "Avançado", en: "Advanced" }, icon: "📈", requirement: { pt: "5.000 XP", en: "5,000 XP" }, xp: 250, coins: 125 },
  { id: "xp_10000", name: { pt: "Mestre", en: "Master" }, icon: "🎓", requirement: { pt: "10.000 XP", en: "10,000 XP" }, xp: 500, coins: 250 },
  { id: "xp_50000", name: { pt: "Lendário", en: "Legendary" }, icon: "👑", requirement: { pt: "50.000 XP", en: "50,000 XP" }, xp: 2500, coins: 1000 },

  // LESSON ACHIEVEMENTS
  { id: "lessons_10", name: { pt: "Iniciante Dedicado", en: "Dedicated Beginner" }, icon: "📚", requirement: { pt: "10 lições", en: "10 lessons" }, xp: 50, coins: 25 },
  { id: "lessons_50", name: { pt: "Estudante Sério", en: "Serious Student" }, icon: "🎯", requirement: { pt: "50 lições", en: "50 lessons" }, xp: 200, coins: 100 },
  { id: "lessons_100", name: { pt: "Centurião do Saber", en: "Knowledge Centurion" }, icon: "🏅", requirement: { pt: "100 lições", en: "100 lessons" }, xp: 500, coins: 250 },
  { id: "lessons_500", name: { pt: "Poliglota", en: "Polyglot" }, icon: "🌍", requirement: { pt: "500 lições", en: "500 lessons" }, xp: 2500, coins: 1000 },

  // PERFECT ACHIEVEMENTS
  { id: "perfect_10", name: { pt: "Perfeccionista", en: "Perfectionist" }, icon: "💯", requirement: { pt: "10 notas perfeitas", en: "10 perfect scores" }, xp: 100, coins: 50 },
  { id: "perfect_50", name: { pt: "Mestre da Precisão", en: "Master of Precision" }, icon: "🎯", requirement: { pt: "50 notas perfeitas", en: "50 perfect scores" }, xp: 500, coins: 250 },

  // SOCIAL ACHIEVEMENTS
  { id: "friends_10", name: { pt: "Social", en: "Social" }, icon: "👥", requirement: { pt: "10 amigos", en: "10 friends" }, xp: 50, coins: 25 },
  { id: "helps_50", name: { pt: "Mentor", en: "Mentor" }, icon: "🤝", requirement: { pt: "Ajude 50 pessoas", en: "Help 50 people" }, xp: 250, coins: 125 },

  // CULTURAL ACHIEVEMENTS
  { id: "cities_10", name: { pt: "Viajante", en: "Traveler" }, icon: "✈️", requirement: { pt: "Visite 10 cidades", en: "Visit 10 cities" }, xp: 100, coins: 50 },
  { id: "cities_25", name: { pt: "Explorador Global", en: "Global Explorer" }, icon: "🌎", requirement: { pt: "Visite 25 cidades", en: "Visit 25 cities" }, xp: 250, coins: 125 },
  { id: "cities_50", name: { pt: "Cidadão do Mundo", en: "Citizen of the World" }, icon: "🗺️", requirement: { pt: "Visite 50 cidades", en: "Visit 50 cities" }, xp: 1000, coins: 500 },

  // SPECIAL ACHIEVEMENTS
  { id: "early_bird", name: { pt: "Madrugador", en: "Early Bird" }, icon: "🌅", requirement: { pt: "Estude antes das 6h", en: "Study before 6 AM" }, xp: 50, coins: 25 },
  { id: "night_owl", name: { pt: "Coruja Noturna", en: "Night Owl" }, icon: "🦉", requirement: { pt: "Estude depois da meia-noite", en: "Study after midnight" }, xp: 50, coins: 25 },
  { id: "weekend_warrior", name: { pt: "Guerreiro de Fim de Semana", en: "Weekend Warrior" }, icon: "⚔️", requirement: { pt: "Estude todo fim de semana por um mês", en: "Study every weekend for a month" }, xp: 200, coins: 100 },

  // ... 80+ more achievements
];

// DAILY/WEEKLY CHALLENGES
export const CHALLENGES = {
  daily: [
    { id: "complete_3_lessons", name: { pt: "Complete 3 lições", en: "Complete 3 lessons" }, xp: 30, coins: 15, icon: "📚" },
    { id: "earn_50_xp", name: { pt: "Ganhe 50 XP", en: "Earn 50 XP" }, xp: 20, coins: 10, icon: "⚡" },
    { id: "practice_pronunciation", name: { pt: "Pratique pronúncia", en: "Practice pronunciation" }, xp: 25, coins: 12, icon: "🎤" },
    { id: "watch_video", name: { pt: "Assista 1 vídeo", en: "Watch 1 video" }, xp: 15, coins: 8, icon: "📹" },
    { id: "perfect_quiz", name: { pt: "Acerte 100% em um quiz", en: "Get 100% on a quiz" }, xp: 40, coins: 20, icon: "🎯" },
  ],
  weekly: [
    { id: "maintain_streak", name: { pt: "Mantenha ofensiva 7 dias", en: "Maintain 7 day streak" }, xp: 200, coins: 100, icon: "🔥" },
    { id: "complete_20_lessons", name: { pt: "Complete 20 lições", en: "Complete 20 lessons" }, xp: 300, coins: 150, icon: "📚" },
    { id: "earn_500_xp", name: { pt: "Ganhe 500 XP", en: "Earn 500 XP" }, xp: 150, coins: 75, icon: "⚡" },
    { id: "explore_3_cities", name: { pt: "Explore 3 cidades", en: "Explore 3 cities" }, xp: 250, coins: 125, icon: "🌍" },
  ],
};

// REWARDS & SHOP ITEMS
export const SHOP_ITEMS = [
  // STREAK FREEZES
  { id: "streak_freeze_1", name: { pt: "Proteção de Ofensiva (1 dia)", en: "Streak Freeze (1 day)" }, price: 100, icon: "🧊" },
  { id: "streak_freeze_7", name: { pt: "Proteção de Ofensiva (7 dias)", en: "Streak Freeze (7 days)" }, price: 500, icon: "❄️" },
  
  // XP BOOSTS
  { id: "xp_boost_15min", name: { pt: "XP Boost 15min (2x)", en: "XP Boost 15min (2x)" }, price: 50, icon: "⚡" },
  { id: "xp_boost_1h", name: { pt: "XP Boost 1h (2x)", en: "XP Boost 1h (2x)" }, price: 150, icon: "💫" },
  
  // COSMETICS
  { id: "avatar_frame_gold", name: { pt: "Moldura Dourada", en: "Gold Frame" }, price: 500, icon: "🖼️" },
  { id: "avatar_frame_diamond", name: { pt: "Moldura Diamante", en: "Diamond Frame" }, price: 2000, icon: "💎" },
  
  // SPECIAL
  { id: "legendary_chest", name: { pt: "Baú Lendário", en: "Legendary Chest" }, price: 1000, icon: "🎁" },
];

// LEADERBOARD TYPES
export const LEADERBOARD_TYPES = [
  { id: "global", name: { pt: "Global", en: "Global" }, icon: "🌍" },
  { id: "friends", name: { pt: "Amigos", en: "Friends" }, icon: "👥" },
  { id: "country", name: { pt: "País", en: "Country" }, icon: "🚩" },
  { id: "league", name: { pt: "Liga", en: "League" }, icon: "🏆" },
];

// Calculate current league based on XP
export function getLeague(xp: number) {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].minXP) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0];
}

// Calculate division within league
export function getDivision(xp: number, league: typeof LEAGUES[0]) {
  const xpInLeague = xp - league.minXP;
  const leagueRange = league.maxXP - league.minXP + 1;
  const divisionSize = leagueRange / league.divisions;
  const division = Math.floor(xpInLeague / divisionSize) + 1;
  return Math.min(division, league.divisions);
}

// Get next league
export function getNextLeague(currentLeague: typeof LEAGUES[0]) {
  const currentIndex = LEAGUES.findIndex(l => l.id === currentLeague.id);
  return LEAGUES[currentIndex + 1] || currentLeague;
}

// Calculate XP to next league
export function getXPToNextLeague(xp: number, currentLeague: typeof LEAGUES[0]) {
  return currentLeague.maxXP - xp + 1;
}

console.log("✅ Gamification system initialized: Leagues, Achievements, Challenges, Rewards");
