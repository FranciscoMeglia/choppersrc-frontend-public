"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ResendVerificationButton({
  email,
  className = "underline underline-offset-2 hover:text-amber-700",
}: {
  email: string;
  className?: string;
}) {
  const t = useTranslations("ResendVerificationButton");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  async function handleClick() {
    setState("loading");
    try {
      await fetch("/api/backend/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setState("sent");
    }
  }

  if (state === "sent") {
    return <span>{t("sent")}</span>;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className={className}
    >
      {state === "loading" ? t("sending") : t("resend")}
    </button>
  );
}
