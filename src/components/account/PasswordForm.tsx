"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/toast/toastStore";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm";

const PASSWORD_PATTERN = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}";
const PASSWORD_MAX_LENGTH = 72;

export function PasswordForm() {
  const t = useTranslations("PasswordForm");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (newPassword !== confirmPassword) {
      setError(t("mismatchError"));
      return;
    }
    if (newPassword === currentPassword) {
      setError(t("sameAsCurrentError"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/backend/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<null>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }

      showToast(t("updated"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError && err.errors && err.errors.length > 0) {
        const map: Record<string, string> = {};
        for (const fieldError of err.errors) {
          map[fieldError.field] = fieldError.message;
        }
        setFieldErrors(map);
      } else {
        setError(err instanceof ApiError ? err.message : t("genericError"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h2 className="font-medium">{t("title")}</h2>
      <p className="text-sm text-ink/60">{t("hint")}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("newPassword")}
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            maxLength={PASSWORD_MAX_LENGTH}
            pattern={PASSWORD_PATTERN}
            title={t("passwordHint")}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          {t("confirmPassword")}
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            maxLength={PASSWORD_MAX_LENGTH}
            className={inputClass}
          />
        </label>
      </div>
      <p className="text-xs text-ink/50">{t("passwordHint")}</p>

      {(error || Object.keys(fieldErrors).length > 0) && (
        <div className="flex flex-col gap-1 text-sm text-primary">
          {error && <p>{error}</p>}
          {Object.values(fieldErrors).map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? t("changing") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
