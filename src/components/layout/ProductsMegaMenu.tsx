"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CategoryGroup } from "@/types/catalog";

const navLinkClass = "underline-offset-4 hover:text-primary hover:underline";

export function ProductsMegaMenu({
  label,
  groups,
  className = navLinkClass,
}: {
  label: string;
  groups: CategoryGroup[];
  className?: string;
}) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onFocus={openNow}
        className={`${className} cursor-pointer bg-transparent p-0`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
      </button>

      {open && groups.length > 0 && (
        <div className="absolute inset-x-0 top-full z-30 border-t border-ink/10 bg-background pt-3 shadow-lg">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
              {groups.map((group) => (
                <div key={group.id}>
                  <Link
                    href={`/products/group/${group.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold tracking-wide text-ink/50 uppercase hover:text-primary hover:underline"
                  >
                    {group.name}
                  </Link>
                  {group.categories.length > 0 ? (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {group.categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products/category/${category.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm text-ink/80 hover:text-primary hover:underline"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-ink/40 italic">—</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-ink/10 pt-4">
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("allProducts")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
