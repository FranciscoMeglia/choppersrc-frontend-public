"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CategoryGroup } from "@/types/catalog";

export function MobileProductsAccordion({
  label,
  groups,
  onNavigate,
}: {
  label: string;
  groups: CategoryGroup[];
  onNavigate?: () => void;
}) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-4 border-l border-ink/10 py-1 pl-3">
          {groups.map((group) => (
            <div key={group.id}>
              <Link
                href={`/products/group/${group.slug}`}
                onClick={onNavigate}
                className="text-sm font-semibold text-ink/70"
              >
                {group.name}
              </Link>
              {group.categories.length > 0 && (
                <ul className="mt-1.5 flex flex-col gap-1.5">
                  {group.categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/products/category/${category.slug}`}
                        onClick={onNavigate}
                        className="text-sm text-ink/60"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Link
            href="/products"
            onClick={onNavigate}
            className="text-sm font-medium text-primary"
          >
            {t("allProducts")}
          </Link>
        </div>
      )}
    </div>
  );
}
