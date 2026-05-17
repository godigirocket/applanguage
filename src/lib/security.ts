
export function sanitizeMessage(text: string): string {
  return text
    .trim()
    .slice(0, 2000) 
    .replace(/<[^>]*>/g, ''); 
}

export function validateLevel(level: string): boolean {
  return ['beginner', 'intermediate', 'advanced'].includes(level.toLowerCase());
}

export function validateLanguage(lang: string): boolean {
  return ['en', 'pt'].includes(lang.toLowerCase());
}

export function validateMood(mood: string): boolean {
  return ['calm', 'intensive', 'cultural', 'confidence'].includes(mood.toLowerCase());
}

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = userId;
  const current = rateLimits.get(key);
  
  if (!current || now > current.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count++;
  return true;
}
