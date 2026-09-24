"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  buildProductsHref,
  type ProductsSearchParams,
} from "@/lib/utils/productSearchParams";

export function FacetCheckboxGroup({
  title,
  items,
  paramKey,
  current,
  basePath,
}: {
  title: string;
  items: { name: string; slug: string }[];
  paramKey: "category" | "brand" | "stock";
  current: ProductsSearchParams;
  basePath?: string;
}) {
  const router = useRouter();
  const selected = current[paramKey];
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
  }, []);

  function handleChange(slug: string, checked: boolean) {
    router.push(
      buildProductsHref(current, { [paramKey]: checked ? slug : undefined }, basePath),
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-xs font-medium tracking-wide text-ink/60 uppercase"
      >
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.slug}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={selected === item.slug}
                  onChange={(e) => handleChange(item.slug, e.target.checked)}
                />
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
