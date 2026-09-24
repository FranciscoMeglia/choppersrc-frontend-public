"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { NavLinks } from "./NavLinks";
import { MobileProductsAccordion } from "./MobileProductsAccordion";
import type { CategoryGroup } from "@/types/catalog";

interface NavItem {
  label: string;
  href: string;
}

export function MobileNav({
  beforeProductsItems,
  productsLabel,
  categoryGroups,
  afterProductsItems,
  children,
}: {
  beforeProductsItems: NavItem[];
  productsLabel: string;
  categoryGroups: CategoryGroup[];
  afterProductsItems: NavItem[];
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Header");

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        className="rounded border border-ink/20 p-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-5 w-5"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-ink/10 bg-background px-4 py-4 shadow-sm">
          <nav className="flex flex-col gap-3 text-sm">
            <NavLinks items={beforeProductsItems} onNavigate={close} />
            <MobileProductsAccordion label={productsLabel} groups={categoryGroups} onNavigate={close} />
            <NavLinks items={afterProductsItems} onNavigate={close} />
          </nav>
          {children && (
            <div
              className="mt-3 flex flex-col gap-3 border-t border-ink/10 pt-3 text-sm"
              onClick={close}
            >
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
