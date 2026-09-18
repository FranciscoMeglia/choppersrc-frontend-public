"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export function StockAlertButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const t = useTranslations("StockAlertButton");
  const [state, setState] = useState<
    "idle" | "loading" | "subscribed" | "guest"
  >("idle");

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch(`/api/backend/products/${slug}/stock-alert`, {
        method: "POST",
      });
      if (res.status === 401) {
        setState("guest");
        return;
      }
      setState(res.ok ? "subscribed" : "idle");
    } catch {
      setState("idle");
    }
  }

  if (state === "subscribed") {
    return (
      <p className={`text-sm text-ink/70 ${className}`}>
        ✓ {t("subscribed")}
      </p>
    );
  }

  if (state === "guest") {
    return (
      <p className={`text-sm text-ink/70 ${className}`}>
        <Link
          href={`/login?redirect=/products/${slug}`}
          className="text-primary underline underline-offset-4"
        >
          {t("loginLink")}
        </Link>{" "}
        {t("subscribePrompt")}
      </p>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      disabled={state === "loading"}
      className={className}
    >
      {state === "loading" ? t("activating") : t("notifyMe")}
    </Button>
  );
}
