export interface AvatarDef {
  id: string;
  bgFrom: string;
  bgTo: string;
  accessory: "ears" | "cat-ears" | "antenna" | "leaf" | "star" | "none";
}

// 10 lightweight, friendly SVG avatars. They use only vector shapes so the
// profile stays crisp on large displays without adding image requests.
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
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={def.bgFrom} />
          <stop offset="100%" stopColor={def.bgTo} />
        </linearGradient>
        <radialGradient id={`${gradId}-glow`} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
      <circle cx="50" cy="50" r="50" fill={`url(#${gradId}-glow)`} />
      <g style={{ color: def.bgTo }} opacity="0.8">
        <Accessory kind={def.accessory} />
      </g>
      <ellipse cx="50" cy="61" rx="31" ry="33" fill="#FFF9EF" />
      <ellipse cx="50" cy="61" rx="27" ry="29" fill="#FFF1D9" opacity="0.55" />
      <circle cx="37" cy="56" r="4.5" fill="#243240" />
      <circle cx="63" cy="56" r="4.5" fill="#243240" />
      <circle cx="35.5" cy="54.5" r="1.25" fill="#fff" opacity="0.9" />
      <circle cx="61.5" cy="54.5" r="1.25" fill="#fff" opacity="0.9" />
      <ellipse cx="31" cy="66" rx="5" ry="2.5" fill="#F5A8AB" opacity="0.42" />
      <ellipse cx="69" cy="66" rx="5" ry="2.5" fill="#F5A8AB" opacity="0.42" />
      <path
        d="M40 69 Q50 78 60 69"
        stroke="#243240"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
