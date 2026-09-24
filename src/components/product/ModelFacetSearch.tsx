"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  buildProductsHref,
  type ProductsSearchParams,
} from "@/lib/utils/productSearchParams";
import type { ProductModel } from "@/types/catalog";

export function ModelFacetSearch({
  title,
  models,
  current,
  basePath,
}: {
  title: string;
  models: ProductModel[];
  current: ProductsSearchParams;
  basePath?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = models.find((m) => m.slug === current.model) ?? null;
  const term = query.trim().toLowerCase();
  const matches = models.filter((m) => m.name.toLowerCase().includes(term));

  function select(slug: string) {
    router.push(buildProductsHref(current, { model: slug }, basePath));
    setQuery("");
    setOpen(false);
  }

  function clear() {
    router.push(buildProductsHref(current, { model: undefined }, basePath));
  }

  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-ink/60 uppercase">
        {title}
      </p>

      {selected ? (
        <div className="mt-3 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
          <span className="truncate">{selected.name}</span>
          <button
            type="button"
            onClick={clear}
            aria-label="Quitar filtro"
            className="text-primary/70 hover:text-primary"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="relative mt-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder="Buscar modelo..."
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          {open && matches.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded border border-ink/10 bg-background text-sm shadow-lg">
              {matches.map((model) => (
                <li key={model.slug}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(model.slug)}
                    className="block w-full px-3 py-2 text-left hover:bg-ink/5"
                  >
                    {model.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
