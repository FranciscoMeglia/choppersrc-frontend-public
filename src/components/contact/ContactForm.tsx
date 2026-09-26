"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";

const inputClass =
  "w-full rounded border border-ink/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "text-sm";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const topicKeys = [
    "topicProduct",
    "topicOrderStatus",
    "topicReturns",
    "topicPartner",
    "topicOther",
  ] as const;

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      topic: String(data.get("topic") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as ApiSuccessEnvelope<null> | ApiErrorEnvelope;

      if (!body.success) {
        setStatus("error");
        setErrorMessage(body.message || t("errorGeneric"));
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(t("errorGeneric"));
    }
  }

  if (status === "sent") {
    return (
      <div>
        <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
          {t("heading")}
        </p>
        <p className="mt-6 text-sm text-ink/80">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
        {t("heading")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            {t("name")}
            <input
              name="name"
              type="text"
              required
              minLength={2}
              placeholder={t("namePlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
          <label className={labelClass}>
            {t("email")}
            <input
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            {t("phone")} <span className="text-ink/40">{t("optional")}</span>
            <input
              name="phone"
              type="tel"
              placeholder={t("phonePlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
          <label className={labelClass}>
            {t("topic")}
            <select name="topic" className={`mt-1 ${inputClass}`}>
              {topicKeys.map((key) => (
                <option key={key}>{t(key)}</option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          {t("message")}
          <textarea
            name="message"
            required
            minLength={10}
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? t("sending") : t("submit")}
          </Button>
          <p className="text-sm text-ink/60">{t("responseNote")}</p>
        </div>

        {status === "error" ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
