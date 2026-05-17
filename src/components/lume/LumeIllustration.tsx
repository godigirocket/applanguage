import { motion } from "framer-motion";

const PARTICLES = [
  { cx: 80, cy: 75, r: 3, delay: 0.1, duration: 2.5 },
  { cx: 120, cy: 85, r: 2, delay: 0.5, duration: 3.2 },
  { cx: 95, cy: 115, r: 4, delay: 0.8, duration: 2.8 },
  { cx: 110, cy: 65, r: 2.5, delay: 0.3, duration: 3.5 },
  { cx: 75, cy: 105, r: 3, delay: 0.6, duration: 2.9 },
  { cx: 130, cy: 110, r: 2, delay: 0.9, duration: 3.1 },
];

export function LumeIllustration({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Soft background glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#paint0_radial)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* The "Lume" character core */}
        <motion.path
          d="M100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60Z"
          fill="url(#paint1_linear)"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner light */}
        <circle cx="100" cy="100" r="20" fill="white" fillOpacity="0.4" />
        <circle cx="100" cy="100" r="10" fill="white" />

        {/* Floating particles (Deterministic & Optimized) */}
        {PARTICLES.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="white"
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        <defs>
          <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(80)">
            <stop stopColor="#2D4A3E" stopOpacity="0.6" />
            <stop offset="1" stopColor="#2D4A3E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="paint1_linear" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2D4A3E" />
            <stop offset="1" stopColor="#1B3A4B" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
