import { motion } from "framer-motion";

/**
 * Ilustrações inline SVG para evitar carregamento de imagens externas
 * Otimizado para performance e carregamento instantâneo
 */

export function IllustrationABC({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="abc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2D4A3E" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#abc-grad)" opacity="0.1" />
      <text x="60" y="75" fontSize="48" fontWeight="800" fill="url(#abc-grad)" textAnchor="middle">
        ABC
      </text>
    </motion.svg>
  );
}

export function IllustrationHeart({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#C44569" />
        </linearGradient>
      </defs>
      <motion.path
        d="M60 95 C 30 75, 20 55, 20 40 C 20 25, 30 15, 45 15 C 52 15, 57 18, 60 23 C 63 18, 68 15, 75 15 C 90 15, 100 25, 100 40 C 100 55, 90 75, 60 95 Z"
        fill="url(#heart-grad)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function IllustrationBrain({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C5CE7" />
          <stop offset="100%" stopColor="#A29BFE" />
        </linearGradient>
      </defs>
      <circle cx="45" cy="50" r="20" fill="url(#brain-grad)" opacity="0.3" />
      <circle cx="75" cy="50" r="20" fill="url(#brain-grad)" opacity="0.3" />
      <path
        d="M 40 35 Q 60 25 80 35 M 40 50 Q 60 40 80 50 M 40 65 Q 60 55 80 65"
        stroke="url(#brain-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function IllustrationGlobe({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="globe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B894" />
          <stop offset="100%" stopColor="#00CEC9" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill="url(#globe-grad)" opacity="0.2" />
      <circle cx="60" cy="60" r="40" stroke="url(#globe-grad)" strokeWidth="2" fill="none" />
      <ellipse cx="60" cy="60" rx="40" ry="15" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none" />
      <ellipse cx="60" cy="60" rx="15" ry="40" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none" />
      <line x1="20" y1="60" x2="100" y2="60" stroke="url(#globe-grad)" strokeWidth="1.5" />
    </motion.svg>
  );
}

export function IllustrationChat({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="chat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FD79A8" />
          <stop offset="100%" stopColor="#FDCB6E" />
        </linearGradient>
      </defs>
      <rect x="25" y="30" width="60" height="45" rx="12" fill="url(#chat-grad)" opacity="0.3" />
      <rect x="25" y="30" width="60" height="45" rx="12" stroke="url(#chat-grad)" strokeWidth="2" fill="none" />
      <path d="M 45 75 L 50 85 L 55 75" fill="url(#chat-grad)" />
      <line x1="35" y1="45" x2="75" y2="45" stroke="url(#chat-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="55" x2="65" y2="55" stroke="url(#chat-grad)" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

export function IllustrationStar({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 60 20 L 70 50 L 100 55 L 75 75 L 82 105 L 60 88 L 38 105 L 45 75 L 20 55 L 50 50 Z"
        fill="url(#star-grad)"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "60px 60px" }}
      />
    </motion.svg>
  );
}

export function IllustrationTrophy({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <linearGradient id="trophy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F39C12" />
          <stop offset="100%" stopColor="#E67E22" />
        </linearGradient>
      </defs>
      <path
        d="M 40 30 L 40 50 Q 40 70 60 70 Q 80 70 80 50 L 80 30 Z"
        fill="url(#trophy-grad)"
        opacity="0.3"
      />
      <path
        d="M 40 30 L 40 50 Q 40 70 60 70 Q 80 70 80 50 L 80 30"
        stroke="url(#trophy-grad)"
        strokeWidth="3"
        fill="none"
      />
      <rect x="50" y="70" width="20" height="15" fill="url(#trophy-grad)" />
      <rect x="40" y="85" width="40" height="5" rx="2" fill="url(#trophy-grad)" />
      <path d="M 35 30 Q 25 35 25 45 Q 25 50 30 50" stroke="url(#trophy-grad)" strokeWidth="2" fill="none" />
      <path d="M 85 30 Q 95 35 95 45 Q 95 50 90 50" stroke="url(#trophy-grad)" strokeWidth="2" fill="none" />
    </motion.svg>
  );
}

export function IllustrationRocket({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="rocket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
      </defs>
      <path d="M 50 20 L 60 50 L 70 20 Q 60 10 50 20 Z" fill="url(#rocket-grad)" />
      <rect x="50" y="50" width="20" height="30" rx="3" fill="url(#rocket-grad)" opacity="0.8" />
      <circle cx="60" cy="60" r="5" fill="white" opacity="0.5" />
      <path d="M 45 70 L 50 80 L 50 70 Z" fill="url(#rocket-grad)" opacity="0.6" />
      <path d="M 75 70 L 70 80 L 70 70 Z" fill="url(#rocket-grad)" opacity="0.6" />
      <motion.path
        d="M 55 85 Q 60 95 65 85"
        stroke="#FFA500"
        strokeWidth="3"
        fill="none"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function IllustrationBook({ size = 120 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="100%" stopColor="#2980B9" />
        </linearGradient>
      </defs>
      <rect x="30" y="25" width="60" height="70" rx="4" fill="url(#book-grad)" opacity="0.3" />
      <rect x="30" y="25" width="60" height="70" rx="4" stroke="url(#book-grad)" strokeWidth="2" fill="none" />
      <line x1="60" y1="25" x2="60" y2="95" stroke="url(#book-grad)" strokeWidth="1.5" />
      <line x1="40" y1="40" x2="55" y2="40" stroke="url(#book-grad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="50" x2="55" y2="50" stroke="url(#book-grad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="60" x2="50" y2="60" stroke="url(#book-grad)" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}

// Componente wrapper para facilitar o uso
export function InlineIllustration({
  type,
  size = 120,
}: {
  type: "abc" | "heart" | "brain" | "globe" | "chat" | "star" | "trophy" | "rocket" | "book";
  size?: number;
}) {
  const illustrations = {
    abc: IllustrationABC,
    heart: IllustrationHeart,
    brain: IllustrationBrain,
    globe: IllustrationGlobe,
    chat: IllustrationChat,
    star: IllustrationStar,
    trophy: IllustrationTrophy,
    rocket: IllustrationRocket,
    book: IllustrationBook,
  };

  const Component = illustrations[type];
  return <Component size={size} />;
}
