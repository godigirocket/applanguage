
export function getGreeting(name: string, timezone: string) {
  const hour = new Date().toLocaleString('en-US', { 
    timeZone: timezone, 
    hour: 'numeric', 
    hour12: false 
  });
  const h = parseInt(hour);
  
  if (h >= 5 && h < 12) return { 
    text: `Good morning, ${name}.`, 
    sub: "A fresh start. Perfect time to practice.",
    emoji: "🌤️",
    gradient: "from-amber-100 to-orange-50"
  };
  if (h >= 12 && h < 17) return { 
    text: `Good afternoon, ${name}.`, 
    sub: "Ready for a conversation?",
    emoji: "☀️",
    gradient: "from-yellow-50 to-amber-50"
  };
  if (h >= 17 && h < 21) return { 
    text: `Good evening, ${name}.`, 
    sub: "Wind down with some practice.",
    emoji: "🌇",
    gradient: "from-orange-100 to-rose-50"
  };
  return { 
    text: `Late night, ${name}.`, 
    sub: "Night owls learn too. 🦉",
    emoji: "🌙",
    gradient: "from-indigo-100 to-slate-50"
  };
}

export function getLocationFlair(timezone: string) {
  if (timezone.includes('Sao_Paulo') || timezone.includes('America/Fortaleza')) 
    return "Olá do Brasil 🇧🇷";
  if (timezone.includes('America/New_York') || timezone.includes('America/Chicago'))
    return "Hello from the US 🇺🇸";
  if (timezone.includes('Europe/London'))
    return "Hello from the UK 🇬🇧";
  if (timezone.includes('Europe'))
    return "Hello from Europe 🌍";
  return null;
}
