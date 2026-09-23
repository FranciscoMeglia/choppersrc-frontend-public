"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ResendVerificationButton } from "./ResendVerificationButton";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-ink/5 disabled:text-ink/50";
const labelClass = "flex flex-col gap-1 text-sm";

export function ProfileForm({ user }: { user: AuthUser }) {
  const t = useTranslations("ProfileForm");
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/backend/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone.trim() || null }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<AuthUser>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("saveError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-medium">{t("title")}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("name")}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={150}
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span>
            {t("phone")} <span className="text-ink/40">{t("optional")}</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 ..."
            maxLength={30}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        {t("email")}
        <input
          type="email"
          value={user.email}
          disabled
          className={inputClass}
        />
        {user.emailVerified ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 pt-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("verified")}
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-2 text-xs text-amber-600">
            {t("unverified")} · <ResendVerificationButton email={user.email} />
          </span>
        )}
      </label>

      {error && <p className="text-sm text-primary">{error}</p>}
      {success && !error && (
        <p className="text-sm text-ink/60">{t("changesSaved")}</p>
      )}

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
