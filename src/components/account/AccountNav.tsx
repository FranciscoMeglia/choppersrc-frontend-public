"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function AccountNav() {
  const t = useTranslations("AccountNav");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();

  const items = [
    { label: tHeader("myAccount"), href: "/account" },
    { label: t("addresses"), href: "/account/addresses" },
    { label: t("orders"), href: "/account/orders" },
    { label: t("returns"), href: "/account/returns" },
    { label: t("stockAlerts"), href: "/account/stock-alerts" },
  ] as const;

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors lg:rounded lg:border-0 lg:border-l-2 lg:px-3 lg:py-2 ${
              isActive
                ? "border-primary bg-primary/10 text-primary lg:bg-primary/5 lg:font-medium"
                : "border-ink/15 text-ink/70 hover:border-primary/40 hover:text-primary lg:border-transparent lg:hover:border-ink/20 lg:hover:bg-ink/5 lg:hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
