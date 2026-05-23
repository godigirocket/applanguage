import React from "react";
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
    <div
      style={{
        width: "100%",
        minWidth: "760px", // Prevent map from shrinking too small, enabling horizontal scroll on mobile
        aspectRatio: "2 / 1",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Decorative Grid Lines */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full select-none"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--bg-primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--bg-secondary)" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="1000" height="500" fill="url(#oceanGlow)" />

        {/* Lat/Long Gridlines */}
        <path
          d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 0,400 L 1000,400"
          stroke="var(--border)"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          opacity="0.3"
        />
        <path
          d="M 200,0 L 200,500 M 400,0 L 400,500 M 600,0 L 600,500 M 800,0 L 800,500"
          stroke="var(--border)"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          opacity="0.3"
        />

        {/* Stylized Continent Silhouettes (High-Contrast Premium Laser-Etched Style) */}
        {/* Greenland */}
        <polygon
          points="270,15 320,15 315,55 265,40"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* North America */}
        <polygon
          points="50,40 330,40 340,165 260,250 250,285 160,285 120,225 50,150"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* South America */}
        <polygon
          points="220,290 325,290 435,355 425,405 375,495 295,495 220,355"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* Europe */}
        <polygon
          points="410,80 540,80 560,195 420,195"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* Africa */}
        <polygon
          points="450,200 590,210 620,300 565,450 480,300"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* Asia */}
        <polygon
          points="540,80 910,80 930,240 680,320 570,190"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />
        {/* Oceania */}
        <polygon
          points="790,340 950,340 935,460 790,460"
          fill="var(--border)"
          stroke="var(--text-secondary)"
          strokeWidth="0.75"
          opacity="0.9"
        />

        {/* Country Labels (Light decoration) */}
        <text
          x="160"
          y="110"
          fill="var(--text-secondary)"
          fontSize="10"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="2"
        >
          AMÉRICA DO NORTE
        </text>
        <text
          x="290"
          y="360"
          fill="var(--text-secondary)"
          fontSize="10"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="2"
        >
          AMÉRICA DO SUL
        </text>
        <text
          x="475"
          y="105"
          fill="var(--text-secondary)"
          fontSize="9"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="1"
        >
          EUROPA
        </text>
        <text
          x="525"
          y="290"
          fill="var(--text-secondary)"
          fontSize="10"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="2"
        >
          ÁFRICA
        </text>
        <text
          x="730"
          y="140"
          fill="var(--text-secondary)"
          fontSize="10"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="2"
        >
          ÁSIA
        </text>
        <text
          x="830"
          y="400"
          fill="var(--text-secondary)"
          fontSize="9"
          fontWeight="800"
          opacity="0.55"
          letterSpacing="1"
        >
          OCEANIA
        </text>

        {/* Country/City Interactive Pins */}
        {countries.map((c) => {
          return c.cities.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            const isCurrentCountry = selectedCountry.id === c.id;

            return (
              <g key={city.id} style={{ cursor: "pointer" }} onClick={() => onSelect(c, city)}>
                {/* Glowing backdrop aura */}
                <circle
                  cx={city.coords.x}
                  cy={city.coords.y}
                  r={isSelected ? 20 : isCurrentCountry ? 13 : 8}
                  fill={isCurrentCountry ? "var(--accent)" : "var(--brand)"}
                  opacity={isSelected ? 0.35 : isCurrentCountry ? 0.2 : 0.08}
                />

                {/* Pin Dot */}
                <circle
                  cx={city.coords.x}
                  cy={city.coords.y}
                  r={isSelected ? 6 : isCurrentCountry ? 4.5 : 3.5}
                  fill={isCurrentCountry ? "var(--accent)" : "var(--brand)"}
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Tiny pulsing indicator */}
                {isSelected && (
                  <motion.circle
                    cx={city.coords.x}
                    cy={city.coords.y}
                    r={16}
                    fill="transparent"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  />
                )}

                {/* Tooltip Label (Shows on selected or country match) */}
                {(isSelected || isCurrentCountry) && (
                  <text
                    x={city.coords.x}
                    y={city.coords.y - 12}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="10"
                    fontWeight="700"
                    style={{
                      paintOrder: "stroke",
                      stroke: "var(--bg-secondary)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                  >
                    {city.namePT}
                  </text>
                )}
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
}
