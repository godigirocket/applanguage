export function LumeLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Luz radiante */}
      <g opacity="0.6">
        <path d="M32 8 L35 14 L32 8 L29 14 Z" fill="#FFD700" />
        <path d="M44 12 L42 18 L44 12 L46 18 Z" fill="#FFD700" />
        <path d="M20 12 L18 18 L20 12 L22 18 Z" fill="#FFD700" />
        <path d="M50 20 L46 24 L50 20 L52 26 Z" fill="#FFD700" />
        <path d="M14 20 L12 26 L14 20 L18 24 Z" fill="#FFD700" />
      </g>
      
      {/* Bulbo da lâmpada */}
      <path 
        d="M32 16 C25 16 20 21 20 28 C20 32 22 35 24 38 C25 39.5 26 41 26 43 L38 43 C38 41 39 39.5 40 38 C42 35 44 32 44 28 C44 21 39 16 32 16 Z" 
        fill="url(#bulbGradient)"
        stroke="#FFF"
        strokeWidth="1.5"
      />
      
      {/* Brilho interno */}
      <ellipse cx="28" cy="24" rx="4" ry="6" fill="rgba(255,255,255,0.4)" />
      
      {/* Base da lâmpada */}
      <rect x="27" y="43" width="10" height="3" rx="1" fill="#E0E0E0" />
      <rect x="26" y="46" width="12" height="2" rx="1" fill="#BDBDBD" />
      <rect x="27" y="48" width="10" height="4" rx="1" fill="#9E9E9E" />
      
      {/* Detalhe rosca */}
      <line x1="26" y1="47" x2="38" y2="47" stroke="#757575" strokeWidth="0.5" />
      <line x1="27" y1="49" x2="37" y2="49" stroke="#757575" strokeWidth="0.5" />
      <line x1="27" y1="51" x2="37" y2="51" stroke="#757575" strokeWidth="0.5" />
      
      {/* Gradientes */}
      <defs>
        <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E6" />
          <stop offset="50%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
