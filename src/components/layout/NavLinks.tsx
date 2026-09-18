"use client";

import { Link, usePathname } from "@/i18n/navigation";

interface NavItem {
  label: string;
  href: string;
}

export function NavLinks({
  items,
  className = "",
  onNavigate,
}: {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`${className} ${isActive ? "text-primary" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
