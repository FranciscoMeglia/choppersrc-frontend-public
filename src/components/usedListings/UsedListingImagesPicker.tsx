"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslations } from "next-intl";

// Sólo webp: el backend lo exige (firma real del archivo, ver
// backend/src/middlewares/verifyFileSignature.js) — filtrar acá evita el
// viaje redondo de subir algo que el backend va a rechazar igual.
const ACCEPTED_TYPES = ["image/webp"];

// Mismo tope que `createUploader` en backend/src/config/upload.js
// (MAX_FILE_SIZE) — igual criterio que el tipo: evitar el viaje redondo de
// subir algo que el backend va a rechazar igual.
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

function isSameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M12 16V4m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Picker de fotos para Usados: mismo patrón visual/interacción que
 * ReorderableImagesPicker del admin (arrastrar para agregar, tocar la cruz
 * para sacar, flechas para reordenar) — reimplementado acá porque
 * frontend-publico y frontend (admin) son dos proyectos Next/Vite
 * separados, sin paquete compartido. Sólo maneja `File[]` (no hay
 * keepImages/imageOrder como en Product: al editar, cualquier foto nueva
 * reemplaza a todas las anteriores, ver used-listings.service.js#updateListing).
 */
export function UsedListingImagesPicker({
  images,
  onChange,
  maxFiles = 3,
}: {
  images: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}) {
  const t = useTranslations("UsedListingImagesPicker");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const atLimit = images.length >= maxFiles;

  function addFiles(newFiles: File[]) {
    const rightType = newFiles.filter((file) => ACCEPTED_TYPES.includes(file.type));
    const accepted = rightType.filter((file) => file.size <= MAX_FILE_SIZE);
    if (rightType.length > accepted.length) {
      setError(t("tooLarge", { maxMb: MAX_FILE_SIZE_MB }));
    } else if (newFiles.length > rightType.length) {
      setError(t("onlyWebp"));
    } else {
      setError(null);
    }
    if (accepted.length === 0) return;
    const merged = [...images];
    for (const file of accepted) {
      if (!merged.some((existing) => isSameFile(existing, file))) merged.push(file);
    }
    onChange(merged.slice(0, maxFiles));
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files ?? []));
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!atLimit) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={atLimit ? undefined : handleDrop}
        className={`rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
          atLimit ? "border-ink/10 bg-ink/5" : isDragging ? "border-primary bg-primary/5" : "border-ink/15"
        }`}
      >
        <UploadIcon className="mx-auto h-6 w-6 text-ink/40" />
        {atLimit ? (
          <p className="mt-1.5 text-xs text-ink/50">{t("atLimit", { max: maxFiles })}</p>
        ) : (
          <p className="mt-1.5 text-xs text-ink/50">
            {t("dropHint")}{" "}
            <label className="cursor-pointer font-medium text-primary hover:underline">
              {t("chooseFiles")}
              <input type="file" accept="image/webp" multiple onChange={handleFileInput} className="hidden" />
            </label>{" "}
            {t("onlyWebpMax", { max: maxFiles })}
          </p>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-primary">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        {images.map((file, i) => (
          <div key={`${file.name}-${file.lastModified}-${i}`} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[i]} alt="" className="h-20 w-20 rounded-lg border border-ink/15 object-cover" />
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {t("cover")}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-primary"
              aria-label={t("remove")}
            >
              <XIcon className="h-3 w-3" />
            </button>
            {images.length > 1 && (
              <div className="absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t("moveBefore")}
                >
                  <ArrowIcon direction="left" className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t("moveAfter")}
                >
                  <ArrowIcon direction="right" className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
        {!atLimit && (
          <label
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-ink/20 text-ink/40 transition-colors hover:border-primary hover:text-primary"
            aria-label={t("addImage")}
          >
            <PlusIcon className="h-6 w-6" />
            <input type="file" accept="image/webp" multiple onChange={handleFileInput} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}
