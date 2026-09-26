"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatPhoneInput } from "@/lib/utils/phone";
import { showToast } from "@/lib/toast/toastStore";
import { UsedListingImagesPicker } from "./UsedListingImagesPicker";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import type { Category } from "@/types/catalog";
import type { UsedListing } from "@/types/usedListing";

const MAX_IMAGES = 3;

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm";

export function UsedListingForm({
  listing,
  categories,
  user,
  onSaved,
  onCancel,
}: {
  /** Si viene, es edición — si no, alta nueva. */
  listing?: UsedListing;
  categories: Category[];
  /** Nombre y email de contacto siempre son los de esta cuenta, no se
   * pueden tipear a mano (ver used-listings.service.js#createListing) —
   * sólo se muestran, de acá salen. */
  user: AuthUser;
  /** Si se pasa, el form se usa embebido (ver PublishUsedListingPanel/MyUsedListingsManager)
   * y este callback reemplaza la navegación por defecto a /account/used-listings. */
  onSaved?: (listing: UsedListing) => void;
  onCancel?: () => void;
}) {
  const t = useTranslations("UsedListingForm");
  const router = useRouter();

  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing?.price ?? "");
  const [city, setCity] = useState(listing?.city ?? "");
  const [contactPhone, setContactPhone] = useState(listing?.contactPhone ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    listing?.category ? String(listing.category.id) : "",
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const { formatted, cursor } = formatPhoneInput(
      event.target.value,
      event.target.selectionStart ?? event.target.value.length,
    );
    setContactPhone(formatted);
    requestAnimationFrame(() => event.target.setSelectionRange(cursor, cursor));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!listing && newImages.length === 0) {
      setError(t("imagesRequired"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("city", city);
      formData.append("contactPhone", contactPhone);
      if (categoryId) formData.append("categoryId", categoryId);
      newImages.forEach((file) => formData.append("images", file));

      const res = await fetch(
        listing ? `/api/backend/used-listings/${listing.id}` : "/api/backend/used-listings",
        { method: listing ? "PUT" : "POST", body: formData },
      );
      const body = (await res.json()) as
        | ApiSuccessEnvelope<UsedListing>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }

      showToast(listing ? t("editSuccess") : t("createSuccess"));
      if (onSaved) onSaved(body.data);
      else router.push("/account/used-listings");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("saveError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className={labelClass}>
        {t("title")}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={2}
          maxLength={150}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        {t("description")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t("price")}
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            step="0.01"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          {t("category")}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={inputClass}
          >
            <option value="" disabled>
              {t("categoryPlaceholder")}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        {t("city")}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          placeholder={t("cityPlaceholder")}
          className={inputClass}
        />
      </label>

      <div className="rounded border border-ink/10 bg-ink/5 p-3 text-sm">
        <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">{t("contactBlockTitle")}</p>
        <p className="mt-1">
          {user.name} · {user.email}
        </p>
        <p className="mt-1 text-xs text-ink/50">{t("contactBlockHint")}</p>
      </div>

      <label className={labelClass}>
        {t("contactPhone")}
        <input
          type="tel"
          value={contactPhone}
          onChange={handlePhoneChange}
          required
          minLength={6}
          maxLength={30}
          placeholder={t("contactPhonePlaceholder")}
          className={`max-w-60 ${inputClass}`}
        />
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm">
          {t("images")} <span className="text-ink/40">({t("imagesMax", { max: MAX_IMAGES })})</span>
        </p>

        {listing && listing.images.length > 0 && newImages.length === 0 && (
          <div>
            <p className="text-xs text-ink/50">{t("currentImages")}</p>
            <div className="mt-2 flex gap-2">
              {listing.images.map((path) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={path}
                  src={imageUrl(path)}
                  alt=""
                  className="h-20 w-20 rounded object-cover"
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-amber-700">{t("replaceImagesWarning")}</p>
          </div>
        )}

        <UsedListingImagesPicker images={newImages} onChange={setNewImages} maxFiles={MAX_IMAGES} />
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : listing ? t("saveChanges") : t("publish")}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-sm text-ink/60 hover:text-ink"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
