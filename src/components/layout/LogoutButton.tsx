"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { logout } from "@/lib/auth/client";

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoutButton() {
  const t = useTranslations("Header");
  const router = useRouter();

  async function handleClick() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
    >
      <LogoutIcon className="h-4 w-4" />
      {t("logout")}
    </button>
  );
}
