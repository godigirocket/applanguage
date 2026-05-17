import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/signup")({
  component: RedirectToLogin,
});

function RedirectToLogin() {
  const nav = useNavigate();

  useEffect(() => {
    nav({ to: "/login" });
  }, []);

  return null;
}