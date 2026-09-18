"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicSettings } from "@/types/settings";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="9" y="9" width="12" height="12" rx="1.5" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const t = useTranslations("BankTransferDetails");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-ink/50 uppercase">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("copyAria", { label })}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-ink/30 hover:bg-ink/5 hover:text-ink"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" />
        )}
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}

export function BankTransferDetails({ settings }: { settings: PublicSettings }) {
  const t = useTranslations("BankTransferDetails");

  return (
    <div className="flex flex-col gap-3 rounded border border-ink/10 bg-ink/3 p-4 text-sm">
      <div>
        <p className="text-xs text-ink/50 uppercase">{t("bank")}</p>
        <p className="font-medium">{settings.bankTransferBank}</p>
      </div>
      <div>
        <p className="text-xs text-ink/50 uppercase">{t("holder")}</p>
        <p className="font-medium">{settings.bankTransferHolder}</p>
      </div>
      <CopyField label="CBU" value={settings.bankTransferCbu} />
      <CopyField label="Alias" value={settings.bankTransferAlias} />
    </div>
  );
}
