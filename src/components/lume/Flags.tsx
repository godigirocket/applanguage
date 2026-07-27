import React from "react";

export function FlagBR({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#4CAF50" />
      <path d="M32 14L52 32L32 50L12 32L32 14Z" fill="#FFEB3B" />
      <circle cx="32" cy="32" r="10" fill="#2196F3" />
      <path d="M24 32C28 28 36 28 40 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FlagUS({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#F44336" />
      <path d="M0 24H64M0 32H64M0 40H64" stroke="white" strokeWidth="4" />
      <rect x="0" y="0" width="32" height="32" rx="0" fill="#3F51B5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M32 0H0V32H32V0Z" fill="#3F51B5" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <circle cx="16" cy="8" r="1.5" fill="white" />
      <circle cx="24" cy="8" r="1.5" fill="white" />
      <circle cx="8" cy="16" r="1.5" fill="white" />
      <circle cx="16" cy="16" r="1.5" fill="white" />
      <circle cx="24" cy="16" r="1.5" fill="white" />
      <circle cx="8" cy="24" r="1.5" fill="white" />
      <circle cx="16" cy="24" r="1.5" fill="white" />
      <circle cx="24" cy="24" r="1.5" fill="white" />
    </svg>
  );
}

export function FlagES({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#F44336" />
      <rect x="0" y="16" width="64" height="32" fill="#FFEB3B" />
      <rect x="18" y="24" width="12" height="16" rx="2" fill="#F44336" />
      <rect x="20" y="26" width="8" height="12" fill="#FFEB3B" />
    </svg>
  );
}

export function FlagGB({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="gb-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#gb-clip)">
        <rect width="64" height="64" fill="#0A2472" />
        <path d="M0 0L64 64M64 0L0 64" stroke="white" strokeWidth="10" />
        <path d="M0 0L64 64M64 0L0 64" stroke="#D32F2F" strokeWidth="4" />
        <path d="M32 0V64M0 32H64" stroke="white" strokeWidth="16" />
        <path d="M32 0V64M0 32H64" stroke="#D32F2F" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function FlagAU({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="au-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#au-clip)">
        <rect width="64" height="64" fill="#0A2472" />
        <g fill="white">
          <circle cx="18" cy="46" r="2.4" />
          <circle cx="22" cy="36" r="2" />
          <circle cx="32" cy="32" r="2.4" />
          <circle cx="26" cy="48" r="1.6" />
          <circle cx="36" cy="44" r="1.8" />
        </g>
        <rect x="0" y="0" width="26" height="18" fill="#0A2472" />
        <path d="M0 0L26 18M26 0L0 18" stroke="white" strokeWidth="3" />
        <path d="M13 0V18M0 9H26" stroke="white" strokeWidth="5" />
        <path d="M13 0V18M0 9H26" stroke="#D32F2F" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function FlagCA({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="ca-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#ca-clip)">
        <rect x="0" y="0" width="16" height="64" fill="#F44336" />
        <rect x="16" y="0" width="32" height="64" fill="white" />
        <rect x="48" y="0" width="16" height="64" fill="#F44336" />
        <path
          d="M32 16L35 24L42 21L38 29L46 30L39 35L43 42L35 39L34 47L32 41L30 47L29 39L21 42L25 35L18 30L26 29L22 21L29 24Z"
          fill="#F44336"
        />
      </g>
    </svg>
  );
}

export function FlagIE({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="ie-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#ie-clip)">
        <rect x="0" y="0" width="22" height="64" fill="#2FBB52" />
        <rect x="22" y="0" width="20" height="64" fill="white" />
        <rect x="42" y="0" width="22" height="64" fill="#FF9600" />
      </g>
    </svg>
  );
}

export function FlagMX({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="mx-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#mx-clip)">
        <rect x="0" y="0" width="22" height="64" fill="#2FBB52" />
        <rect x="22" y="0" width="20" height="64" fill="white" />
        <rect x="42" y="0" width="22" height="64" fill="#F44336" />
        <circle cx="32" cy="32" r="7" fill="#8B4513" />
      </g>
    </svg>
  );
}

// Emoji flags render as bare "GB"/"US"-style letter codes on platforms
// without color-emoji font support (older Windows in particular), which is
// why every flag in the app is a real SVG instead. This maps the flag emoji
// already stored in content data (culturalContent.ts) to the matching SVG.
const EMOJI_TO_FLAG: Record<string, React.FC<{ size?: number }>> = {
  "🇬🇧": FlagGB,
  "🇺🇸": FlagUS,
  "🇦🇺": FlagAU,
  "🇨🇦": FlagCA,
  "🇮🇪": FlagIE,
  "🇪🇸": FlagES,
  "🇲🇽": FlagMX,
  "🇧🇷": FlagBR,
};

export function FlagByEmoji({ emoji, size = 24 }: { emoji: string; size?: number }) {
  const Flag = EMOJI_TO_FLAG[emoji];
  if (!Flag) return <span style={{ fontSize: size * 0.7 }}>{emoji}</span>;
  return <Flag size={size} />;
}
