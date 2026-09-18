"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTo(next: AppLocale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs uppercase">{locale}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-32 rounded border border-ink/10 bg-background py-1 text-sm text-ink shadow-lg">
          {routing.locales.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => switchTo(option)}
              className={`block w-full px-3 py-1.5 text-left hover:bg-ink/5 ${
                option === locale ? "font-medium text-primary" : ""
              }`}
            >
              {t(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
