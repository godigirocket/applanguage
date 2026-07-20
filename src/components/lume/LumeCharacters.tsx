import { motion } from "framer-motion";
import React from "react";

/**
 * Friendly cartoon characters for lessons, celebrations, and onboarding.
 * Inspired by playful learning apps. All inline SVG, no external images.
 */

interface CharacterProps {
  size?: number;
  style?: React.CSSProperties;
  animated?: boolean;
}

// =====================================================
// 1. RUNNER — character mid-run with sweat drops
// =====================================================
export function CharacterRunner({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { y: [0, -8, 0] } : {}}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Sweat drops */}
      <motion.g
        animate={animated ? { y: [0, 8, 0], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      >
        <path d="M70 60 Q66 70 70 76 Q74 70 70 60" fill="#5BC0EB" />
        <path d="M55 75 Q52 82 55 87 Q58 82 55 75" fill="#5BC0EB" />
        <path d="M165 55 Q162 64 165 69 Q168 64 165 55" fill="#5BC0EB" />
      </motion.g>

      {/* Hair flowing back */}
      <path d="M150 75 Q175 65 180 80 Q175 95 160 95 Z" fill="#F4B845" />

      {/* Headband */}
      <path d="M85 80 Q120 72 155 80 L155 88 Q120 80 85 88 Z" fill="#FF6B6B" />
      <circle cx="148" cy="84" r="3" fill="#FFE5A0" />

      {/* Head */}
      <ellipse cx="120" cy="88" rx="32" ry="36" fill="#FFD9B8" />

      {/* Face shadow */}
      <path d="M88 100 Q120 110 152 100 L152 116 Q120 124 88 116 Z" fill="#FFD9B8" />

      {/* Eyes — wide, surprised */}
      <ellipse cx="105" cy="92" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx="135" cy="92" rx="6" ry="7" fill="#FFFFFF" />
      <circle cx="105" cy="93" r="3" fill="#1C1C1A" />
      <circle cx="135" cy="93" r="3" fill="#1C1C1A" />
      <circle cx="106" cy="91" r="1" fill="#FFFFFF" />
      <circle cx="136" cy="91" r="1" fill="#FFFFFF" />

      {/* Mouth — open in effort */}
      <ellipse cx="120" cy="108" rx="6" ry="5" fill="#1C1C1A" />
      <ellipse cx="120" cy="110" rx="3" ry="2" fill="#FF6B6B" />

      {/* Body — red shirt */}
      <motion.g
        animate={animated ? { rotate: [-2, 2, -2] } : {}}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 140px" }}
      >
        <path
          d="M85 130 Q120 122 155 130 L160 175 Q140 180 120 178 Q100 180 80 175 Z"
          fill="#FF5A5F"
        />

        {/* Right arm — pumping forward */}
        <path
          d="M155 132 Q175 138 178 158 Q175 165 168 162 Q160 158 152 145 Z"
          fill="#FF5A5F"
        />
        <circle cx="172" cy="160" r="9" fill="#FFD9B8" />

        {/* Left arm — pumping back */}
        <path
          d="M85 132 Q70 140 65 158 Q68 168 78 165 Q88 158 90 142 Z"
          fill="#FF5A5F"
        />
        <circle cx="72" cy="162" r="9" fill="#FFD9B8" />

        {/* Motion lines on arms */}
        <path d="M62 150 L52 152" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M62 158 L50 160" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </motion.g>

      {/* Shorts */}
      <path d="M88 175 Q120 178 152 175 L154 200 Q120 205 86 200 Z" fill="#C73E47" />

      {/* Legs running */}
      <motion.g
        animate={animated ? { rotate: [-15, 15, -15] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "108px 200px" }}
      >
        {/* Front leg */}
        <path d="M105 200 Q108 220 100 230 Q90 232 90 224 Q92 215 95 200 Z" fill="#FFD9B8" />
        {/* Front shoe */}
        <ellipse cx="93" cy="228" rx="13" ry="6" fill="#FF6B6B" />
      </motion.g>

      <motion.g
        animate={animated ? { rotate: [15, -15, 15] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "132px 200px" }}
      >
        {/* Back leg */}
        <path d="M135 200 Q138 215 145 222 Q155 222 152 214 Q148 208 145 200 Z" fill="#FFD9B8" />
        <ellipse cx="150" cy="220" rx="13" ry="6" fill="#FF6B6B" />
      </motion.g>

      {/* Motion dust */}
      {animated && (
        <motion.g
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <circle cx="60" cy="225" r="4" fill="#E0DDD6" />
          <circle cx="48" cy="218" r="3" fill="#E0DDD6" />
          <circle cx="42" cy="228" r="2" fill="#E0DDD6" />
        </motion.g>
      )}
    </motion.svg>
  );
}

// =====================================================
// 2. CELEBRATING — arms up, victory pose
// =====================================================
export function CharacterCelebrating({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { y: [0, -12, 0] } : {}}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Sparkles around */}
      {animated && (
        <>
          <motion.path
            d="M40 60 L44 70 L54 74 L44 78 L40 88 L36 78 L26 74 L36 70 Z"
            fill="#FFD93D"
            animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M195 50 L198 58 L206 61 L198 64 L195 72 L192 64 L184 61 L192 58 Z"
            fill="#FF6B35"
            animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle
            cx="55"
            cy="120"
            r="3"
            fill="#5BC0EB"
            animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle
            cx="190"
            cy="130"
            r="3"
            fill="#7CB342"
            animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
        </>
      )}

      {/* Hair flowing up */}
      <path d="M88 78 Q120 60 152 78 L150 90 Q120 75 90 90 Z" fill="#F4B845" />

      {/* Headband */}
      <path d="M85 84 Q120 76 155 84 L155 92 Q120 84 85 92 Z" fill="#FF6B6B" />

      {/* Head */}
      <ellipse cx="120" cy="92" rx="32" ry="36" fill="#FFD9B8" />

      {/* Eyes — wide with joy */}
      <ellipse cx="105" cy="96" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx="135" cy="96" rx="6" ry="7" fill="#FFFFFF" />
      <circle cx="106" cy="98" r="3" fill="#1C1C1A" />
      <circle cx="134" cy="98" r="3" fill="#1C1C1A" />
      <circle cx="107" cy="96" r="1.5" fill="#FFFFFF" />
      <circle cx="135" cy="96" r="1.5" fill="#FFFFFF" />

      {/* Big open mouth — yelling for joy */}
      <ellipse cx="120" cy="115" rx="9" ry="10" fill="#1C1C1A" />
      <ellipse cx="120" cy="118" rx="5" ry="5" fill="#FF6B6B" />

      {/* Sweat drop */}
      <motion.path
        d="M155 95 Q151 102 155 107 Q159 102 155 95"
        fill="#5BC0EB"
        animate={animated ? { y: [0, 5, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Body — red shirt */}
      <path
        d="M88 130 Q120 124 152 130 L154 178 Q120 184 86 178 Z"
        fill="#FF5A5F"
      />

      {/* Both arms raised up — victory! */}
      <motion.g
        animate={animated ? { rotate: [-3, 3, -3] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "85px 130px" }}
      >
        <path d="M85 130 Q70 100 75 70 Q85 60 92 70 Q95 95 100 130 Z" fill="#FF5A5F" />
        {/* Left fist */}
        <circle cx="83" cy="68" r="11" fill="#FFD9B8" />
        <path d="M76 60 L80 56 M86 56 L90 60 M82 54 L86 54" stroke="#1C1C1A" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      <motion.g
        animate={animated ? { rotate: [3, -3, 3] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "155px 130px" }}
      >
        <path d="M155 130 Q170 100 165 70 Q155 60 148 70 Q145 95 140 130 Z" fill="#FF5A5F" />
        {/* Right fist */}
        <circle cx="157" cy="68" r="11" fill="#FFD9B8" />
        <path d="M150 60 L154 56 M160 56 L164 60 M156 54 L160 54" stroke="#1C1C1A" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      {/* Shorts */}
      <path d="M90 178 Q120 182 150 178 L152 200 Q120 205 88 200 Z" fill="#C73E47" />

      {/* Legs spread in joy */}
      <path d="M95 200 Q90 220 80 225 Q72 222 75 213 Q82 205 92 200 Z" fill="#FFD9B8" />
      <path d="M145 200 Q150 220 160 225 Q168 222 165 213 Q158 205 148 200 Z" fill="#FFD9B8" />

      {/* Shoes */}
      <ellipse cx="78" cy="225" rx="12" ry="6" fill="#FF6B6B" />
      <ellipse cx="162" cy="225" rx="12" ry="6" fill="#FF6B6B" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="232" rx="50" ry="6" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// 3. THINKING — hand on chin, contemplative
// =====================================================
export function CharacterThinking({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { rotate: [-1, 1, -1] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Thought bubbles */}
      {animated && (
        <>
          <motion.circle
            cx="180"
            cy="60"
            r="14"
            fill="#FFFFFF"
            stroke="#E0DDD6"
            strokeWidth="2"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.circle
            cx="160"
            cy="80"
            r="6"
            fill="#FFFFFF"
            stroke="#E0DDD6"
            strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.text
            x="174"
            y="65"
            fontSize="16"
            fontWeight="900"
            fill="#2D4A3E"
            textAnchor="middle"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            ?
          </motion.text>
        </>
      )}

      {/* Hair */}
      <path d="M88 88 Q90 65 120 60 Q150 65 152 88 L150 100 Q120 88 90 100 Z" fill="#F4B845" />

      {/* Head */}
      <ellipse cx="120" cy="100" rx="32" ry="36" fill="#FFD9B8" />

      {/* Eyes — looking up thinking */}
      <ellipse cx="105" cy="100" rx="6" ry="6" fill="#FFFFFF" />
      <ellipse cx="135" cy="100" rx="6" ry="6" fill="#FFFFFF" />
      <circle cx="106" cy="98" r="3" fill="#1C1C1A" />
      <circle cx="136" cy="98" r="3" fill="#1C1C1A" />

      {/* Mouth — small thoughtful */}
      <path d="M114 120 Q120 122 126 120" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Body */}
      <path d="M88 138 Q120 132 152 138 L155 188 Q120 194 85 188 Z" fill="#7CB342" />

      {/* Right arm — bent up to chin */}
      <motion.g
        animate={animated ? { rotate: [-1, 1, -1] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "150px 145px" }}
      >
        <path d="M150 140 Q175 142 178 115 Q170 110 162 118 Q150 125 145 140 Z" fill="#7CB342" />
        {/* Hand on chin */}
        <circle cx="135" cy="125" r="11" fill="#FFD9B8" />
        <path d="M127 122 Q130 128 137 128" stroke="#1C1C1A" strokeWidth="1" fill="none" />
      </motion.g>

      {/* Left arm down */}
      <path d="M88 140 Q72 145 70 175 Q75 180 82 175 Q90 160 92 145 Z" fill="#7CB342" />
      <circle cx="74" cy="178" r="9" fill="#FFD9B8" />

      {/* Shorts */}
      <path d="M88 188 Q120 192 152 188 L154 210 Q120 214 88 210 Z" fill="#5A8A2C" />

      {/* Legs */}
      <path d="M100 210 Q98 225 102 232 Q108 232 108 225 L108 210 Z" fill="#FFD9B8" />
      <path d="M132 210 Q130 225 134 232 Q140 232 140 225 L140 210 Z" fill="#FFD9B8" />

      {/* Shoes */}
      <ellipse cx="105" cy="232" rx="11" ry="5" fill="#7CB342" />
      <ellipse cx="137" cy="232" rx="11" ry="5" fill="#7CB342" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="238" rx="42" ry="4" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// 4. READING — sitting with a book
// =====================================================
export function CharacterReading({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Hair */}
      <path d="M85 85 Q88 60 120 56 Q152 60 155 85 L150 100 Q120 88 90 100 Z" fill="#8B4513" />

      {/* Head */}
      <ellipse cx="120" cy="95" rx="30" ry="34" fill="#FFD9B8" />

      {/* Eyes — looking down at book */}
      <path d="M100 95 Q104 98 108 95" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M132 95 Q136 98 140 95" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Mouth — focused */}
      <path d="M114 115 Q120 118 126 115" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Body — blue shirt */}
      <path d="M85 130 Q120 124 155 130 L160 178 Q120 185 80 178 Z" fill="#5BC0EB" />

      {/* Arms holding book */}
      <path d="M85 140 Q70 155 75 180 L100 175 Q92 158 95 142 Z" fill="#5BC0EB" />
      <path d="M155 140 Q170 155 165 180 L140 175 Q148 158 145 142 Z" fill="#5BC0EB" />

      {/* Hands */}
      <circle cx="80" cy="178" r="9" fill="#FFD9B8" />
      <circle cx="160" cy="178" r="9" fill="#FFD9B8" />

      {/* BOOK */}
      <motion.g
        animate={animated ? { rotate: [-1, 1, -1] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "120px 175px" }}
      >
        <rect x="78" y="155" width="84" height="35" rx="3" fill="#C4714A" />
        <rect x="80" y="158" width="80" height="29" rx="2" fill="#FAFAF5" />
        {/* Pages divider */}
        <line x1="120" y1="158" x2="120" y2="187" stroke="#E0DDD6" strokeWidth="1.5" />
        {/* Text lines */}
        <line x1="86" y1="165" x2="115" y2="165" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="86" y1="172" x2="115" y2="172" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="86" y1="179" x2="110" y2="179" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="125" y1="165" x2="155" y2="165" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="125" y1="172" x2="155" y2="172" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="125" y1="179" x2="150" y2="179" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      {/* Floating letters */}
      {animated && (
        <>
          <motion.text
            x="55"
            y="80"
            fontSize="20"
            fontWeight="900"
            fill="#FF6B6B"
            animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            A
          </motion.text>
          <motion.text
            x="180"
            y="70"
            fontSize="18"
            fontWeight="900"
            fill="#7CB342"
            animate={{ y: [4, -4, 4], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            B
          </motion.text>
          <motion.text
            x="190"
            y="100"
            fontSize="16"
            fontWeight="900"
            fill="#FFD93D"
            animate={{ y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            C
          </motion.text>
        </>
      )}

      {/* Shorts/pants */}
      <path d="M85 188 Q120 192 155 188 L156 215 Q120 220 84 215 Z" fill="#1B3A4B" />

      {/* Legs */}
      <ellipse cx="105" cy="225" rx="13" ry="8" fill="#FF6B6B" />
      <ellipse cx="135" cy="225" rx="13" ry="8" fill="#FF6B6B" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="234" rx="48" ry="5" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// 5. SPEAKING — with megaphone
// =====================================================
export function CharacterSpeaking({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { rotate: [-2, 2, -2] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Sound waves */}
      {animated && (
        <>
          <motion.path
            d="M195 90 Q210 100 195 110"
            stroke="#FFD93D"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.path
            d="M205 80 Q225 100 205 120"
            stroke="#FFD93D"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}

      {/* Hair */}
      <path d="M85 85 Q90 60 120 56 Q150 60 152 85 L150 98 Q120 86 88 98 Z" fill="#1C1C1A" />

      {/* Head */}
      <ellipse cx="115" cy="95" rx="30" ry="34" fill="#FFD9B8" />

      {/* Eyes — confident */}
      <ellipse cx="103" cy="93" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="125" cy="93" rx="5" ry="6" fill="#FFFFFF" />
      <circle cx="104" cy="93" r="2.5" fill="#1C1C1A" />
      <circle cx="126" cy="93" r="2.5" fill="#1C1C1A" />

      {/* Big smile */}
      <path d="M100 112 Q115 122 130 112" stroke="#1C1C1A" strokeWidth="3" strokeLinecap="round" fill="#FF6B6B" />
      <path d="M100 112 Q115 118 130 112 L130 113 Q115 119 100 113 Z" fill="#FFFFFF" />

      {/* Body — purple shirt */}
      <path d="M80 130 Q115 124 148 130 L150 180 Q115 186 78 180 Z" fill="#9B59B6" />

      {/* Right arm holding megaphone */}
      <path d="M148 138 Q170 142 170 110 Q160 105 152 115 Q145 125 142 138 Z" fill="#9B59B6" />

      {/* MEGAPHONE */}
      <motion.g
        animate={animated ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: "180px 100px" }}
      >
        <path d="M165 90 L188 80 L192 120 L165 110 Z" fill="#FF6B6B" />
        <ellipse cx="190" cy="100" rx="3" ry="20" fill="#C73E47" />
        <rect x="160" y="95" width="8" height="10" rx="2" fill="#1C1C1A" />
      </motion.g>

      {/* Left arm down */}
      <path d="M82 140 Q70 150 75 175 Q82 178 88 175 Q92 160 92 145 Z" fill="#9B59B6" />
      <circle cx="80" cy="178" r="8" fill="#FFD9B8" />

      {/* Pants */}
      <path d="M82 180 Q115 184 148 180 L150 210 Q115 215 82 210 Z" fill="#5B2F7A" />

      {/* Legs */}
      <path d="M95 210 Q92 225 95 232 Q102 232 102 225 L100 210 Z" fill="#FFD9B8" />
      <path d="M130 210 Q128 225 132 232 Q140 232 140 225 L138 210 Z" fill="#FFD9B8" />

      {/* Shoes */}
      <ellipse cx="98" cy="232" rx="11" ry="5" fill="#1C1C1A" />
      <ellipse cx="135" cy="232" rx="11" ry="5" fill="#1C1C1A" />

      {/* Ground shadow */}
      <ellipse cx="115" cy="238" rx="44" ry="4" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// 6. WAVING — friendly greeting
// =====================================================
export function CharacterWaving({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
      animate={animated ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Hair */}
      <path d="M88 85 Q90 60 120 55 Q152 60 155 85 L155 100 Q120 88 88 100 Z" fill="#F4B845" />

      {/* Head */}
      <ellipse cx="120" cy="95" rx="32" ry="36" fill="#FFD9B8" />

      {/* Eyes — happy */}
      <path d="M102 92 Q108 88 112 92" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M128 92 Q132 88 138 92" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Big smile */}
      <path d="M106 112 Q120 124 134 112" stroke="#1C1C1A" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Cheek blush */}
      <ellipse cx="98" cy="108" rx="5" ry="3" fill="#FFB5B5" opacity="0.6" />
      <ellipse cx="142" cy="108" rx="5" ry="3" fill="#FFB5B5" opacity="0.6" />

      {/* Body — teal shirt */}
      <path d="M85 132 Q120 126 155 132 L158 182 Q120 188 82 182 Z" fill="#1B9AAA" />

      {/* Right arm waving */}
      <motion.g
        animate={animated ? { rotate: [-15, 15, -15] } : {}}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "155px 138px" }}
      >
        <path d="M152 138 Q175 130 180 95 Q170 88 162 95 Q150 110 145 138 Z" fill="#1B9AAA" />
        <circle cx="178" cy="92" r="11" fill="#FFD9B8" />
        {/* Fingers */}
        <path
          d="M170 84 L168 78 M175 81 L174 73 M181 80 L182 72 M186 83 L189 76"
          stroke="#1C1C1A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Left arm down */}
      <path d="M85 140 Q72 150 78 175 Q88 180 92 173 Q95 158 95 145 Z" fill="#1B9AAA" />
      <circle cx="84" cy="178" r="9" fill="#FFD9B8" />

      {/* Pants */}
      <path d="M85 185 Q120 190 155 185 L158 212 Q120 218 84 212 Z" fill="#0F6975" />

      {/* Legs */}
      <path d="M100 212 Q98 228 102 234 Q108 234 108 226 L108 212 Z" fill="#FFD9B8" />
      <path d="M132 212 Q130 228 134 234 Q140 234 140 226 L140 212 Z" fill="#FFD9B8" />

      {/* Shoes */}
      <ellipse cx="105" cy="234" rx="11" ry="5" fill="#FF6B6B" />
      <ellipse cx="137" cy="234" rx="11" ry="5" fill="#FF6B6B" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="240" rx="46" ry="4" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// 7. SLEEPING — head on hands, zzz
// =====================================================
export function CharacterSleeping({ size = 220, animated = true, style }: CharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={style}
    >
      {/* Z's floating up */}
      {animated && (
        <>
          <motion.text
            x="170"
            y="90"
            fontSize="22"
            fontWeight="900"
            fill="#5BC0EB"
            animate={{ y: [-5, -25, -5], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            z
          </motion.text>
          <motion.text
            x="185"
            y="65"
            fontSize="28"
            fontWeight="900"
            fill="#5BC0EB"
            animate={{ y: [-5, -25, -5], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            Z
          </motion.text>
        </>
      )}

      {/* Hair */}
      <path d="M88 100 Q92 80 120 78 Q150 80 152 100 L150 120 Q120 105 90 120 Z" fill="#8B4513" />

      {/* Head — tilted */}
      <ellipse cx="120" cy="115" rx="32" ry="34" fill="#FFD9B8" transform="rotate(-15 120 115)" />

      {/* Eyes — closed */}
      <path d="M100 110 Q105 113 110 110" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M128 110 Q133 113 138 110" stroke="#1C1C1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Peaceful mouth */}
      <path d="M114 132 Q120 135 126 132" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Body */}
      <path d="M85 145 Q120 140 155 145 L160 195 Q120 200 80 195 Z" fill="#9B59B6" />

      {/* Arms folded under head */}
      <path d="M85 150 Q70 130 90 122 Q110 125 105 145 Z" fill="#9B59B6" />
      <path d="M155 150 Q170 130 150 122 Q130 125 135 145 Z" fill="#9B59B6" />
      <ellipse cx="120" cy="125" rx="22" ry="8" fill="#FFD9B8" />

      {/* Pants */}
      <path d="M85 195 Q120 200 155 195 L156 220 Q120 225 84 220 Z" fill="#5B2F7A" />

      {/* Legs */}
      <path d="M100 220 L100 232 L110 232 L110 220 Z" fill="#FFD9B8" />
      <path d="M130 220 L130 232 L140 232 L140 220 Z" fill="#FFD9B8" />

      {/* Shoes */}
      <ellipse cx="105" cy="234" rx="10" ry="5" fill="#1C1C1A" />
      <ellipse cx="135" cy="234" rx="10" ry="5" fill="#1C1C1A" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="240" rx="48" ry="5" fill="#000" opacity="0.08" />
    </motion.svg>
  );
}

// =====================================================
// SPEECH BUBBLE — for character dialogue
// =====================================================
export function SpeechBubble({
  text,
  pointDirection = "down",
  background = "var(--surface-raised)",
  textColor = "var(--text-primary)",
  maxWidth = 320,
}: {
  text: string;
  pointDirection?: "up" | "down" | "left" | "right";
  background?: string;
  textColor?: string;
  maxWidth?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      style={{
        position: "relative",
        background,
        borderRadius: "20px",
        padding: "16px 20px",
        maxWidth,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1.5px solid var(--border)",
      }}
    >
      <span
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>

      {/* Pointer triangle */}
      {pointDirection === "down" && (
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `10px solid ${background}`,
          }}
        />
      )}
      {pointDirection === "up" && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: `10px solid ${background}`,
          }}
        />
      )}
      {pointDirection === "left" && (
        <div
          style={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: `10px solid ${background}`,
          }}
        />
      )}
      {pointDirection === "right" && (
        <div
          style={{
            position: "absolute",
            right: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: `10px solid ${background}`,
          }}
        />
      )}
    </motion.div>
  );
}

// Mood → Character resolver
export const MOOD_CHARACTERS = {
  happy: CharacterWaving,
  thinking: CharacterThinking,
  correct: CharacterCelebrating,
  wrong: CharacterThinking,
  speaking: CharacterSpeaking,
  reading: CharacterReading,
  running: CharacterRunner,
  sleeping: CharacterSleeping,
  celebrate: CharacterCelebrating,
} as const;

export type CharacterMood = keyof typeof MOOD_CHARACTERS;

export function MoodCharacter({
  mood,
  size = 200,
  animated = true,
}: {
  mood: CharacterMood;
  size?: number;
  animated?: boolean;
}) {
  const Comp = MOOD_CHARACTERS[mood] || CharacterWaving;
  return <Comp size={size} animated={animated} />;
}
