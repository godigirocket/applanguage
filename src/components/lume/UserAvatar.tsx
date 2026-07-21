import { useStore } from "@/hooks/useStore";
import { AvatarSvg, getAvatarDef } from "@/components/lume/AvatarSvg";

interface UserAvatarProps {
  size?: number;
  name?: string;
  /** Overrides the store's chosen avatar — used for other people's avatars (e.g. community feed). */
  avatarId?: string | null;
}

/**
 * Consistent avatar everywhere in the app: the user's chosen SVG creature,
 * or an initial-letter fallback when none has been picked yet — never a
 * random photo/emoji, so the same person looks the same on every screen.
 */
export function UserAvatar({ size = 40, name, avatarId }: UserAvatarProps) {
  const storeAvatarId = useStore((s) => s.avatarId);
  const id = avatarId !== undefined ? avatarId : storeAvatarId;

  if (!id) {
    const initial = name?.trim()?.[0]?.toUpperCase() || "L";
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: size * 0.42,
          fontWeight: 800,
          color: "white",
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, flexShrink: 0, borderRadius: "50%", overflow: "hidden" }}
    >
      <AvatarSvg def={getAvatarDef(id)} size={size} />
    </div>
  );
}
