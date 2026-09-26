"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm";

export function ChangeEmailForm({
  pendingEmail,
}: {
  pendingEmail: string | null;
}) {
  const t = useTranslations("ChangeEmailForm");
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/backend/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newEmail }),
      });
      const body = (await res.json()) as ApiSuccessEnvelope<null> | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      setSuccess(true);
      setNewEmail("");
      setCurrentPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-medium">{t("title")}</h2>
      <p className="text-sm text-ink/60">{t("hint")}</p>

      {pendingEmail && (
        <p className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {t("pending", { email: pendingEmail })}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("newEmail")}
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            maxLength={255}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          {t("currentPassword")}
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={inputClass}
          />
        </label>
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}
      {success && !error && <p className="text-sm text-ink/60">{t("sent")}</p>}

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? t("sending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
