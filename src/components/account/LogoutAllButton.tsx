"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/auth/client";

export function LogoutAllButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/backend/auth/logout-all", { method: "POST" });
    } finally {
      await logout();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={loading}>
      {loading
        ? "Cerrando sesiones..."
        : "Cerrar sesión en todos los dispositivos"}
    </Button>
  );
}
