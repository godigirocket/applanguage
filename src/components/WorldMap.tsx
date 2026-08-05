import { motion } from "framer-motion";
import { CountryData, CityInfo } from "@/lib/cultureData";

interface WorldMapProps {
  countries: CountryData[];
  selectedCountry: CountryData;
  selectedCity: CityInfo | null;
  onSelect: (country: CountryData, city: CityInfo) => void;
}

export function WorldMap({ countries, selectedCountry, selectedCity, onSelect }: WorldMapProps) {
  return (
    <div className="lume-world-map">
      <svg viewBox="0 0 1000 520" className="w-full h-full select-none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="lumeOceanGlow" cx="42%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#f6fbff" />
            <stop offset="48%" stopColor="#dff2ff" />
            <stop offset="100%" stopColor="#f8f4ea" />
          </radialGradient>
          <linearGradient id="lumeLand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#eef7ff" />
            <stop offset="100%" stopColor="#fff0c8" />
          </linearGradient>
          <linearGradient id="lumeRoute" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f6bff" />
            <stop offset="45%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#f5b700" />
          </linearGradient>
          <filter id="mapSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#07101f" floodOpacity="0.14" />
          </filter>
        </defs>

        <rect width="1000" height="520" fill="url(#lumeOceanGlow)" />

        <g opacity="0.34" stroke="#0f6bff" strokeWidth="1" strokeDasharray="5 12">
          <path d="M 0 130 C 200 100 330 160 500 128 S 800 104 1000 132" />
          <path d="M 0 260 C 220 230 330 292 500 260 S 790 232 1000 262" />
          <path d="M 0 390 C 190 360 360 420 500 390 S 790 362 1000 392" />
          <path d="M 190 0 C 160 120 230 210 190 520" />
          <path d="M 410 0 C 380 120 450 250 410 520" />
          <path d="M 630 0 C 590 130 670 250 630 520" />
          <path d="M 840 0 C 800 130 880 250 840 520" />
        </g>

        <g filter="url(#mapSoftShadow)" fill="url(#lumeLand)" stroke="rgba(15,107,255,0.22)" strokeWidth="2">
          <path d="M52 122 C90 58 175 48 247 78 C320 110 360 174 323 232 C290 284 213 310 143 278 C80 248 18 183 52 122Z" />
          <path d="M245 284 C298 274 363 314 389 365 C416 418 371 493 314 504 C270 510 236 454 230 405 C224 360 203 301 245 284Z" />
          <path d="M405 116 C450 79 526 86 558 132 C591 181 548 224 492 218 C436 211 369 165 405 116Z" />
          <path d="M480 224 C543 194 619 232 635 302 C650 370 606 455 542 457 C494 458 462 387 444 326 C429 275 437 245 480 224Z" />
          <path d="M556 118 C628 64 789 66 904 125 C963 155 959 242 894 278 C819 318 712 314 641 260 C577 212 505 156 556 118Z" />
          <path d="M774 362 C833 326 929 343 958 398 C984 448 920 490 846 480 C781 471 724 397 774 362Z" />
          <path d="M270 42 C292 18 328 20 344 45 C359 69 334 95 300 88 C271 82 250 65 270 42Z" />
        </g>

        <motion.path
          d="M106 374 C244 106 401 432 527 194 S782 80 914 348"
          fill="none"
          stroke="url(#lumeRoute)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="18 18"
          animate={{ strokeDashoffset: [0, -72] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: "linear" }}
          opacity="0.84"
        />
        <path
          d="M106 374 C244 106 401 432 527 194 S782 80 914 348"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {countries.flatMap((country) =>
          country.cities.map((city, index) => {
            const isSelected = selectedCity?.id === city.id;
            const isCurrentCountry = selectedCountry.id === country.id;
            const fill = isCurrentCountry ? "#f5b700" : "#0f6bff";

            return (
              <motion.g
                key={city.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(country, city)}
                animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                transition={{ repeat: Infinity, duration: 2.8 + (index % 4) * 0.28, ease: "easeInOut" }}
              >
                <circle cx={city.coords.x} cy={city.coords.y} r={isSelected ? 22 : 14} fill={fill} opacity={isSelected ? 0.24 : 0.12} />
                {isSelected && (
                  <motion.circle
                    cx={city.coords.x}
                    cy={city.coords.y}
                    r={20}
                    fill="transparent"
                    stroke={fill}
                    strokeWidth="2"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.85, 0.08, 0.85] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  />
                )}
                <circle cx={city.coords.x} cy={city.coords.y} r={isSelected ? 7 : isCurrentCountry ? 5 : 4} fill={fill} stroke="white" strokeWidth="3" />
                {(isSelected || isCurrentCountry) && (
                  <text
                    x={city.coords.x}
                    y={city.coords.y - 15}
                    textAnchor="middle"
                    fill="#07101f"
                    fontSize="10"
                    fontWeight="800"
                    style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 5, strokeLinejoin: "round" }}
                  >
                    {city.namePT}
                  </text>
                )}
              </motion.g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
