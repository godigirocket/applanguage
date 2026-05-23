import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    if (user) {
      setIsAuthorized(true);
      return;
    }

    // Check Guest Mode
    const guestStartTime = localStorage.getItem("lume_guest_start");
    if (guestStartTime) {
      const startTime = parseInt(guestStartTime, 10);
      const elapsed = Date.now() - startTime;
      const tenMinutes = 10 * 60 * 1000;

      if (elapsed < tenMinutes) {
        setIsAuthorized(true);
        return;
      }
    }

    // Not authorized and not valid guest
    setIsAuthorized(false);
    router.navigate({ to: "/login" });
  }, [user, loading, router]);

  if (isAuthorized === null || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg)",
        }}
      >
        <div
          className="pin-pulse"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--brand)",
          }}
        ></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
