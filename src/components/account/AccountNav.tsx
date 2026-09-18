"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCOUNT_NAV = [
  { label: "Mi cuenta", href: "/account" },
  { label: "Direcciones", href: "/account/addresses" },
  { label: "Pedidos", href: "/account/orders" },
  { label: "Devoluciones", href: "/account/returns" },
  { label: "Alertas de stock", href: "/account/stock-alerts" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
      {ACCOUNT_NAV.map((item) => {
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
