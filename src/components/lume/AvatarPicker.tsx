import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AVATARS, AvatarSvg } from "@/components/lume/AvatarSvg";

interface AvatarPickerProps {
  isPT: boolean;
  onClose: () => void;
}

/**
 * Grid of the built-in SVG avatars. Persists the choice locally right away
 * (so it survives a refresh even signed out) and syncs to the profiles
 * table's `avatar_url` column when the user is logged in.
 */
export function AvatarPicker({ isPT, onClose }: AvatarPickerProps) {
  const { user } = useAuth();
  const avatarId = useStore((s) => s.avatarId);
  const setAvatarId = useStore((s) => s.setAvatarId);

  async function handlePick(id: string) {
    setAvatarId(id);
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: `lume-avatar:${id}` })
        .eq("id", user.id);
      if (error) {
        toast.warning(
          isPT ? "Avatar salvo só neste dispositivo" : "Avatar saved on this device only",
        );
      }
    }
    toast.success(isPT ? "Avatar atualizado!" : "Avatar updated!");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(5,7,13,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-solid)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "28px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--text-strong)",
            marginBottom: "4px",
          }}
        >
          {isPT ? "Escolha seu avatar" : "Choose your avatar"}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
          {isPT ? "Fica salvo no seu perfil." : "This stays with your profile."}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(72px, 100%), 1fr))",
            gap: "12px",
          }}
        >
          {AVATARS.map((def) => {
            const selected = def.id === avatarId;
            return (
              <button
                key={def.id}
                onClick={() => handlePick(def.id)}
                aria-pressed={selected}
                style={{
                  padding: "8px",
                  borderRadius: "16px",
                  border: selected ? "2px solid var(--brand)" : "2px solid var(--border)",
                  background: selected ? "var(--surface-strong)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AvatarSvg def={def} size={56} />
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {isPT ? "Fechar" : "Close"}
        </button>
      </div>
    </div>
  );
}
