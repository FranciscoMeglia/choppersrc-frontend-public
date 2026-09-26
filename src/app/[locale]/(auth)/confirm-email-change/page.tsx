"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api/client";

type Status = "confirming" | "success" | "error";

export default function ConfirmEmailChangePage() {
  const t = useTranslations("ConfirmEmailChangePage");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "confirming" : "error");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    apiFetch("/auth/confirm-email-change", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("genericError"));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, t]);

  return (
    <Container>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>

      {status === "confirming" && (
        <p className="mt-4 text-sm text-ink/60">{t("confirming")}</p>
      )}

      {status === "success" && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-ink/60">{t("success")}</p>
          <div>
            <LinkButton href="/account">{t("goToAccount")}</LinkButton>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex max-w-sm flex-col gap-4">
          <p className="text-sm text-primary">{error ?? t("missingToken")}</p>
          <div>
            <LinkButton href="/account">{t("goToAccount")}</LinkButton>
          </div>
        </div>
      )}
    </Container>
  );
}
