"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "motion/react";
import { imageUrl } from "@/lib/utils/imageUrl";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { Reveal } from "@/components/ui/Reveal";
import type { Brand } from "@/types/catalog";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -32 : 32, opacity: 0 }),
};

export function BrandsCarousel({
  brands,
  perPage = 5,
}: {
  brands: Brand[];
  perPage?: number;
}) {
  const t = useTranslations("BrandsCarousel");
  const withLogo = brands.filter((brand) => brand.logo);
  const pageCount = Math.max(1, Math.ceil(withLogo.length / perPage));
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  function step(delta: number) {
    setPage(([current]) => [
      ((current + delta) % pageCount + pageCount) % pageCount,
      delta,
    ]);
  }

  function goTo(next: number) {
    setPage(([current]) => [next, next > current ? 1 : next < current ? -1 : 0]);
  }

  const visible = withLogo.slice(page * perPage, page * perPage + perPage);

  if (withLogo.length === 0) return null;

  return (
    <section className="bg-ink/[0.03]">
      <Reveal className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
          {t("eyebrow")}
        </p>
        <span className="mt-2 block h-1 w-10 bg-primary" />

        <div className="mt-8 flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t("previous")}
            className="shrink-0 rounded border border-ink/20 p-2 hover:border-primary hover:text-primary"
          >
            ‹
          </button>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <m.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-2 gap-6 sm:grid-cols-5"
              >
                {visible.map((brand) => {
                  const logo = (
                    <div className="relative aspect-3/2">
                      <Image
                        src={imageUrl(brand.logo!)}
                        alt={brand.name}
                        fill
                        sizes="(min-width: 640px) 20vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                  );

                  return brand.websiteUrl ? (
                    <a
                      key={brand.id}
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={brand.name}
                      className="transition-opacity hover:opacity-70"
                    >
                      {logo}
                    </a>
                  ) : (
                    <div key={brand.id}>{logo}</div>
                  );
                })}
              </m.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t("next")}
            className="shrink-0 rounded border border-ink/20 p-2 hover:border-primary hover:text-primary"
          >
            ›
          </button>
        </div>

        {pageCount > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t("goToPage", { page: i + 1 })}
                className={`h-1.5 w-4 rounded-full ${i === page ? "bg-primary" : "bg-ink/20"}`}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm">
          {t("ctaText")}{" "}
          <Link
            href="/contact"
            className="group font-medium text-primary underline underline-offset-4"
          >
            {t("ctaLink")}
            <ArrowRight />
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
