"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const { consent, accept, reject } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t("dialogAria")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink text-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/85">
          {t("message")}{" "}
          <Link href="/privacy" className="underline hover:text-primary">
            {t("moreInfo")}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {t("reject")}
          </button>
          <Button onClick={accept}>{t("accept")}</Button>
        </div>
      </div>
    </div>
  );
}
