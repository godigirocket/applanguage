export interface AvatarDef {
  id: string;
  bgFrom: string;
  bgTo: string;
  accessory: "ears" | "cat-ears" | "antenna" | "leaf" | "star" | "none";
}

// 10 lightweight, friendly SVG avatars — flat colors + simple shapes, no
// external images/fonts, so this never adds real weight to the bundle.
export const AVATARS: AvatarDef[] = [
  { id: "fox", bgFrom: "#FF9466", bgTo: "#FF7A45", accessory: "ears" },
  { id: "sky", bgFrom: "#67C9F5", bgTo: "#38BDF8", accessory: "none" },
  { id: "plum", bgFrom: "#B48CE0", bgTo: "#9061C9", accessory: "cat-ears" },
  { id: "rose", bgFrom: "#F591B2", bgTo: "#EC6690", accessory: "leaf" },
  { id: "amber", bgFrom: "#FBC454", bgTo: "#F5A623", accessory: "star" },
  { id: "teal", bgFrom: "#5FD0C0", bgTo: "#2FB8A6", accessory: "antenna" },
  { id: "indigo", bgFrom: "#7C8CF8", bgTo: "#5A6CE8", accessory: "ears" },
  { id: "coral", bgFrom: "#FF8B7A", bgTo: "#FF6A54", accessory: "cat-ears" },
  { id: "lime", bgFrom: "#D8DB6E", bgTo: "#C3C64A", accessory: "leaf" },
  { id: "slate", bgFrom: "#95A3C4", bgTo: "#7688B3", accessory: "none" },
];

export function getAvatarDef(id: string | null | undefined): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

function Accessory({ kind }: { kind: AvatarDef["accessory"] }) {
  switch (kind) {
    case "ears":
      return (
        <>
          <circle cx="26" cy="24" r="10" fill="currentColor" opacity="0.9" />
          <circle cx="74" cy="24" r="10" fill="currentColor" opacity="0.9" />
        </>
      );
    case "cat-ears":
      return (
        <>
          <path d="M22 32 L14 8 L38 26 Z" fill="currentColor" opacity="0.9" />
          <path d="M78 32 L86 8 L62 26 Z" fill="currentColor" opacity="0.9" />
        </>
      );
    case "antenna":
      return (
        <>
          <line x1="50" y1="20" x2="50" y2="6" stroke="currentColor" strokeWidth="3" />
          <circle cx="50" cy="5" r="4" fill="currentColor" />
        </>
      );
    case "leaf":
      return (
        <path d="M50 18 C40 6 30 10 32 22 C34 32 46 30 50 18 Z" fill="currentColor" opacity="0.9" />
      );
    case "star":
      return (
        <path
          d="M50 4 L54 15 L66 15 L56 22 L60 33 L50 26 L40 33 L44 22 L34 15 L46 15 Z"
          fill="currentColor"
          opacity="0.9"
        />
      );
    default:
      return null;
  }
}

export function AvatarSvg({ def, size = 64 }: { def: AvatarDef; size?: number }) {
  const gradId = `avatar-grad-${def.id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Avatar ${def.id}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={def.bgFrom} />
          <stop offset="100%" stopColor={def.bgTo} />
        </linearGradient>
      </defs>
      <g style={{ color: def.bgTo }}>
        <Accessory kind={def.accessory} />
      </g>
      <circle cx="50" cy="54" r="38" fill={`url(#${gradId})`} />
      <circle cx="37" cy="50" r="5" fill="#1c1c1a" />
      <circle cx="63" cy="50" r="5" fill="#1c1c1a" />
      <path
        d="M38 64 Q50 74 62 64"
        stroke="#1c1c1a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
