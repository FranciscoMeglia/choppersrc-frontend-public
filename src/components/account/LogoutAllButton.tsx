"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/auth/client";

export function LogoutAllButton() {
  const t = useTranslations("LogoutAllButton");
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
      {loading ? t("loggingOut") : t("submit")}
    </Button>
  );
}
