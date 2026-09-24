"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "motion/react";
import { imageUrl } from "@/lib/utils/imageUrl";

export function ImageGallery({
  images,
  alt,
  aspectClassName = "aspect-square",
}: {
  images: string[];
  alt: string;
  aspectClassName?: string;
}) {
  const t = useTranslations("ImageGallery");
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function showPrev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function showNext() {
    setActive((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className={`${aspectClassName} rounded border border-ink/10 bg-ink/5`} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={t("zoom")}
        className={`group relative block w-full ${aspectClassName} cursor-zoom-in overflow-hidden rounded border border-ink/10 bg-ink/5`}
      >
        <Image
          key={images[active]}
          src={imageUrl(images[active])}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
      </button>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t("viewImage", { index: i + 1, total: images.length })}
              aria-current={i === active}
              className={`group relative aspect-square w-16 shrink-0 overflow-hidden rounded border ${
                i === active ? "border-primary" : "border-ink/10"
              }`}
            >
              <Image
                src={imageUrl(src)}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-3 sm:p-6"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label={t("close")}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-8 w-8"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                key={images[active]}
                src={imageUrl(images[active])}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </m.div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPrev();
                  }}
                  aria-label={t("previous")}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/90 hover:bg-black/60 hover:text-white sm:left-4"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNext();
                  }}
                  aria-label={t("next")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/90 hover:bg-black/60 hover:text-white sm:right-4"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/90">
                  {active + 1} / {images.length}
                </span>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
