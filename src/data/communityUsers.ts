// Split out of contentEngine.ts so routes that only need this (like
// community.tsx) don't pull in the ~1.9MB masterContent.json bundle just to
// render a leaderboard/user list.
export const SIMULATED_USERS = [
  { id: 1, name: 'Ana Silva', avatar: '👩', level: 42, xp: 12580, country: '🇧🇷', streak: 156 },
  { id: 2, name: 'Mike Chen', avatar: '👨', level: 38, xp: 10240, country: '🇺🇸', streak: 89 },
  { id: 3, name: 'Sophie Martin', avatar: '👩', level: 51, xp: 18760, country: '🇫🇷', streak: 234 },
  { id: 4, name: 'Carlos Méndez', avatar: '👨', level: 29, xp: 7120, country: '🇲🇽', streak: 67 },
  { id: 5, name: 'Yuki Tanaka', avatar: '👩', level: 46, xp: 15340, country: '🇯🇵', streak: 178 },
];
