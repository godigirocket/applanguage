import React, { useRef, useEffect, useState } from "react";
import { useStore } from "@/hooks/useStore";

// Highly detailed lat/lng coordinates for the 24 cities in the 17 countries of Lume Culture Hub.
interface CityPin {
  cityId: string;
  countryId: string;
  name: string;
  namePT: string;
  nameES: string;
  lat: number;
  lng: number;
}

const CITY_PINS: CityPin[] = [
  // USA
  {
    cityId: "ny",
    countryId: "usa",
    name: "New York",
    namePT: "Nova York",
    nameES: "Nueva York",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    cityId: "boston",
    countryId: "usa",
    name: "Boston",
    namePT: "Boston",
    nameES: "Boston",
    lat: 42.3601,
    lng: -71.0589,
  },
  {
    cityId: "miami",
    countryId: "usa",
    name: "Miami",
    namePT: "Miami",
    nameES: "Miami",
    lat: 25.7617,
    lng: -80.1918,
  },
  // UK
  {
    cityId: "lon",
    countryId: "uk",
    name: "London",
    namePT: "Londres",
    nameES: "Londres",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    cityId: "sco",
    countryId: "uk",
    name: "Edinburgh",
    namePT: "Edimburgo",
    nameES: "Edimburgo",
    lat: 55.9533,
    lng: -3.1883,
  },
  // Spain
  {
    cityId: "mad",
    countryId: "spain",
    name: "Madrid",
    namePT: "Madri",
    nameES: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
  },
  {
    cityId: "and",
    countryId: "spain",
    name: "Andalucia",
    namePT: "Andaluzia",
    nameES: "Andalucía",
    lat: 37.3891,
    lng: -5.9845,
  },
  // Mexico
  {
    cityId: "cdmx",
    countryId: "mexico",
    name: "Mexico City",
    namePT: "Cidade do México",
    nameES: "Ciudad de México",
    lat: 19.4326,
    lng: -99.1332,
  },
  // Argentina
  {
    cityId: "ba",
    countryId: "argentina",
    name: "Buenos Aires",
    namePT: "Buenos Aires",
    nameES: "Buenos Aires",
    lat: -34.6037,
    lng: -58.3816,
  },
  // Colombia
  {
    cityId: "bog",
    countryId: "colombia",
    name: "Bogota",
    namePT: "Bogotá",
    nameES: "Bogotá",
    lat: 4.711,
    lng: -74.0721,
  },
  // Brazil
  {
    cityId: "sp",
    countryId: "brazil",
    name: "São Paulo",
    namePT: "São Paulo",
    nameES: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
  },
  {
    cityId: "rio",
    countryId: "brazil",
    name: "Rio de Janeiro",
    namePT: "Rio de Janeiro",
    nameES: "Río de Janeiro",
    lat: -22.9068,
    lng: -43.1729,
  },
  // Portugal
  {
    cityId: "lis",
    countryId: "portugal",
    name: "Lisboa",
    namePT: "Lisboa",
    nameES: "Lisboa",
    lat: 38.7223,
    lng: -9.1393,
  },
  // Canada
  {
    cityId: "tor",
    countryId: "canada",
    name: "Toronto",
    namePT: "Toronto",
    nameES: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    cityId: "van",
    countryId: "canada",
    name: "Vancouver",
    namePT: "Vancouver",
    nameES: "Vancouver",
    lat: 49.2827,
    lng: -123.1207,
  },
  // Australia
  {
    cityId: "syd",
    countryId: "australia",
    name: "Sydney",
    namePT: "Sydney",
    nameES: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
  },
  {
    cityId: "mel",
    countryId: "australia",
    name: "Melbourne",
    namePT: "Melbourne",
    nameES: "Melbourne",
    lat: -37.8136,
    lng: 144.9631,
  },
  // France
  {
    cityId: "par",
    countryId: "france",
    name: "Paris",
    namePT: "Paris",
    nameES: "París",
    lat: 48.8566,
    lng: 2.3522,
  },
  // Germany
  {
    cityId: "ber",
    countryId: "germany",
    name: "Berlin",
    namePT: "Berlim",
    nameES: "Berlín",
    lat: 52.52,
    lng: 13.405,
  },
  // Italy
  {
    cityId: "rom",
    countryId: "italy",
    name: "Rome",
    namePT: "Roma",
    nameES: "Roma",
    lat: 41.9028,
    lng: 12.4964,
  },
  // Japan
  {
    cityId: "tok",
    countryId: "japan",
    name: "Tokyo",
    namePT: "Tóquio",
    nameES: "Tokio",
    lat: 35.6895,
    lng: 139.6917,
  },
  // China
  {
    cityId: "bei",
    countryId: "china",
    name: "Beijing",
    namePT: "Pequim",
    nameES: "Pekín",
    lat: 39.9042,
    lng: 116.4074,
  },
  // India
  {
    cityId: "del",
    countryId: "india",
    name: "New Delhi",
    namePT: "Nova Déli",
    nameES: "Nueva Delhi",
    lat: 28.6139,
    lng: 77.209,
  },
  // South Africa
  {
    cityId: "cpt",
    countryId: "southafrica",
    name: "Cape Town",
    namePT: "Cidade do Cabo",
    nameES: "Ciudad del Cabo",
    lat: -33.9249,
    lng: 18.4241,
  },
];

// Utility to convert lat/lng to 3D coordinates on a unit sphere.
function latLngToXYZ(lat: number, lng: number) {
  const phi = (90 - lat) * (Math.PI / 180); // polar angle
  const theta = (lng + 180) * (Math.PI / 180); // azimuthal angle
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}

interface WorldGlobe3DProps {
  selectedCountryId: string;
  selectedCityId: string | null;
  onSelectCountryCity: (countryId: string, cityId: string) => void;
}

export const WorldGlobe3D: React.FC<WorldGlobe3DProps> = ({
  selectedCountryId,
  selectedCityId,
  onSelectCountryCity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Rotation states managed with refs for smooth requestAnimationFrame rendering
  const currentRotation = useRef({ x: 0.3, y: -0.8 });
  const targetRotation = useRef({ x: 0.3, y: -0.8 });

  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Keep track of projected coordinates of pins for hover and click detection
  interface ProjectedPin extends CityPin {
    screenX: number;
    screenY: number;
    depth: number;
  }
  const projectedPins = useRef<ProjectedPin[]>([]);

  // React state for hover tooltip
  const [hoveredPin, setHoveredPin] = useState<CityPin | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getTranslation = (item: CityPin) => {
    if (isPT) return item.namePT;
    if (isES) return item.nameES;
    return item.name;
  };

  // Centering the globe smoothly when props change
  useEffect(() => {
    // Find active city or primary city of the selected country
    let activeCity = CITY_PINS.find((p) => p.cityId === selectedCityId);
    if (!activeCity) {
      activeCity = CITY_PINS.find((p) => p.countryId === selectedCountryId);
    }

    if (activeCity && !isDragging.current) {
      const targetY = -((activeCity.lng * Math.PI) / 180) - Math.PI / 2;
      const targetX = (activeCity.lat * Math.PI) / 180;

      // Calculate shortest angular path around vertical Y axis to prevent rapid spinning
      const diffY = targetY - currentRotation.current.y;
      const normalizedDiffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

      targetRotation.current.y = currentRotation.current.y + normalizedDiffY;
      targetRotation.current.x = targetX;
    }
  }, [selectedCountryId, selectedCityId]);

  // Handle pointer down (mouse or touch)
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;

    if (canvasRef.current) {
      canvasRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Handle pointer move
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging.current) {
      const dx = e.clientX - lastPointerPos.current.x;
      const dy = e.clientY - lastPointerPos.current.y;

      currentRotation.current.y += dx * 0.005;
      currentRotation.current.x += dy * 0.005;

      // Clamp vertical tilt to prevent upside down views
      currentRotation.current.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, currentRotation.current.x),
      );

      targetRotation.current = { ...currentRotation.current };

      lastPointerPos.current = { x: e.clientX, y: e.clientY };
      if (Math.hypot(e.clientX - pointerStart.current.x, e.clientY - pointerStart.current.y) > 4) {
        hasMoved.current = true;
      }
      setHoveredPin(null);
    } else {
      // Pin hover detection
      let bestPin: ProjectedPin | null = null;
      let minDistance = 14; // hover range in pixels

      projectedPins.current.forEach((pin) => {
        if (pin.depth < 0.2) return; // ignore pins on the back
        const dist = Math.hypot(mouseX - pin.screenX, mouseY - pin.screenY);
        if (dist < minDistance) {
          minDistance = dist;
          bestPin = pin;
        }
      });

      if (bestPin) {
        setHoveredPin(bestPin);
        setTooltipPos({
          x: (bestPin as ProjectedPin).screenX,
          y: (bestPin as ProjectedPin).screenY - 14,
        });
      } else {
        setHoveredPin(null);
      }
    }
  };

  // Handle pointer up
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }

    // Tap/Click Detection
    if (!hasMoved.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let clickedPin: ProjectedPin | null = null;
      let minDistance = 16; // click tolerance

      projectedPins.current.forEach((pin) => {
        if (pin.depth < 0.2) return;
        const dist = Math.hypot(clickX - pin.screenX, clickY - pin.screenY);
        if (dist < minDistance) {
          minDistance = dist;
          clickedPin = pin;
        }
      });

      if (clickedPin) {
        onSelectCountryCity(
          (clickedPin as ProjectedPin).countryId,
          (clickedPin as ProjectedPin).cityId,
        );
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let pulseAngle = 0;

    const renderLoop = () => {
      pulseAngle += 0.08;

      const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
      const height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const logicWidth = canvas.offsetWidth;
      const logicHeight = canvas.offsetHeight;
      const radius = (Math.min(logicWidth, logicHeight) / 2) * 0.88;

      ctx.clearRect(0, 0, logicWidth, logicHeight);

      // Smoothly interpolate rotation if not dragging
      if (!isDragging.current) {
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.095;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.095;
      }

      const rotX = currentRotation.current.x;
      const rotY = currentRotation.current.y;

      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";

      // Gorgeous premium sphere gradient shading
      const centerX = logicWidth / 2;
      const centerY = logicHeight / 2;

      // Draw atmospheric space glow aura
      const spaceGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.9,
        centerX,
        centerY,
        radius * 1.08,
      );
      spaceGrad.addColorStop(0, isDark ? "rgba(45, 74, 62, 0.09)" : "rgba(76, 175, 80, 0.05)");
      spaceGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spaceGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Base sphere shadow and styling
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#080d0b" : "#f0fcf6";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";
      ctx.stroke();

      // Draw 3D wireframe grid (Graticules) for vector premium look
      ctx.save();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = isDark ? "rgba(76, 175, 80, 0.09)" : "rgba(45, 74, 62, 0.05)";

      // Latitude lines (horizontal)
      [-60, -30, 0, 30, 60].forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 10) {
          const { x, y, z } = latLngToXYZ(lat, lng);

          // Apply rotation
          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);
          const cosX = Math.cos(rotX);
          const sinX = Math.sin(rotX);

          const vx = x * cosY - z * sinY;
          const vz = x * sinY + z * cosY;
          const vy = y;

          const vy2 = vy * cosX - vz * sinX;
          const vz2 = vy * sinX + vz * cosX;

          if (vz2 >= 0.0) {
            // Only draw front side points
            const screenX = centerX + vx * radius;
            const screenY = centerY + vy2 * radius;
            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // Longitude lines (vertical)
      [-120, -60, 0, 60, 120, 180].forEach((lng) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const { x, y, z } = latLngToXYZ(lat, lng);

          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);
          const cosX = Math.cos(rotX);
          const sinX = Math.sin(rotX);

          const vx = x * cosY - z * sinY;
          const vz = x * sinY + z * cosY;
          const vy = y;

          const vy2 = vy * cosX - vz * sinX;
          const vz2 = vy * sinX + vz * cosX;

          if (vz2 >= 0.0) {
            const screenX = centerX + vx * radius;
            const screenY = centerY + vy2 * radius;
            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });
      ctx.restore();

      // Sphere gloss overlay (Shading)
      const glossGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius,
      );
      glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      glossGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.05)");
      glossGrad.addColorStop(0.85, "rgba(45, 74, 62, 0.3)");
      glossGrad.addColorStop(1, "rgba(10, 20, 15, 0.7)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = glossGrad;
      ctx.fill();

      // Compute and draw interactive pins
      const pinsTemp: ProjectedPin[] = [];

      CITY_PINS.forEach((pin) => {
        const { x, y, z } = latLngToXYZ(pin.lat, pin.lng);

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const vx = x * cosY - z * sinY;
        const vz = x * sinY + z * cosY;
        const vy = y;

        const vy2 = vy * cosX - vz * sinX;
        const vz2 = vy * sinX + vz * cosX;

        const depth = (vz2 + 1) / 2; // 0 (back) to 1 (front)

        const screenX = centerX + vx * radius;
        const screenY = centerY + vy2 * radius;

        pinsTemp.push({
          ...pin,
          screenX,
          screenY,
          depth,
        });

        if (depth < 0.22) return; // Hide pins on far back side

        const isCountryActive = pin.countryId === selectedCountryId;
        const isCityActive = pin.cityId === selectedCityId;

        // Pin sizing based on depth
        const baseSize = isCityActive ? 7.5 : isCountryActive ? 6 : 4.5;
        const pinSize = baseSize * (0.4 + 0.6 * depth);

        ctx.save();

        // Draw selected country highlight pulsing ring
        if (isCountryActive) {
          const ringRad = pinSize * (2 + Math.sin(pulseAngle) * 0.5);
          ctx.beginPath();
          ctx.arc(screenX, screenY, ringRad, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = isCityActive ? "rgba(212, 162, 59, 0.4)" : "rgba(76, 175, 80, 0.4)";
          ctx.stroke();
        }

        // Draw pin core
        ctx.beginPath();
        ctx.arc(screenX, screenY, pinSize, 0, Math.PI * 2);

        // Premium gradient fill for active pin
        if (isCityActive) {
          const pinGrad = ctx.createRadialGradient(
            screenX - 1,
            screenY - 1,
            0,
            screenX,
            screenY,
            pinSize,
          );
          pinGrad.addColorStop(0, "#fffbe6");
          pinGrad.addColorStop(1, "#D4A23B");
          ctx.fillStyle = pinGrad;
          ctx.shadowColor = "#D4A23B";
          ctx.shadowBlur = 12 * depth;
        } else if (isCountryActive) {
          const pinGrad = ctx.createRadialGradient(
            screenX - 1,
            screenY - 1,
            0,
            screenX,
            screenY,
            pinSize,
          );
          pinGrad.addColorStop(0, "#e8fdf5");
          pinGrad.addColorStop(1, "#2D4A3E");
          ctx.fillStyle = pinGrad;
          ctx.shadowColor = "#2D4A3E";
          ctx.shadowBlur = 8 * depth;
        } else {
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(45, 74, 62, 0.4)";
        }

        ctx.fill();

        // Stroke outline
        ctx.beginPath();
        ctx.arc(screenX, screenY, pinSize + 0.5, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = isCityActive
          ? "#fff"
          : isCountryActive
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(255, 255, 255, 0.15)";
        ctx.shadowBlur = 0; // reset
        ctx.stroke();

        ctx.restore();
      });

      projectedPins.current = pinsTemp;
      animFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [selectedCountryId, selectedCityId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center"
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-shadow duration-300"
        style={{ maxWidth: "420px", maxHeight: "420px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          isDragging.current = false;
          setHoveredPin(null);
        }}
      />

      {/* Floating glassmorphic vector tooltip */}
      {hoveredPin && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%) translateY(-8px)",
            background: "rgba(30, 41, 35, 0.82)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255, 255, 255, 0.08)",
            padding: "6px 12px",
            borderRadius: "12px",
            color: "white",
            fontFamily: "var(--font-sans)",
            fontSize: "12.5px",
            fontWeight: 700,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background:
                hoveredPin.countryId === selectedCountryId ? "var(--accent-green)" : "#fff",
              boxShadow:
                hoveredPin.countryId === selectedCountryId ? "0 0 6px var(--accent-green)" : "none",
            }}
          />
          {getTranslation(hoveredPin)}
        </div>
      )}
    </div>
  );
};
