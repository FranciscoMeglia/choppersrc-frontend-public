"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { UsedListingStatusBadge } from "./UsedListingStatusBadge";
import { UsedListingForm } from "./UsedListingForm";
import { ConfirmStillAvailableButton } from "./ConfirmStillAvailableButton";
import { MarkAsSoldButton } from "./MarkAsSoldButton";
import { DeleteUsedListingButton } from "./DeleteUsedListingButton";
import { formatArs } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import type { AuthUser } from "@/types/auth";
import type { Category } from "@/types/catalog";
import type { UsedListing } from "@/types/usedListing";

type View = "list" | "new" | UsedListing;

/**
 * "Mis publicaciones" — una sola vista a la vez: lista, o el form (alta o
 * edición) ocupando el lugar de la lista, nunca los dos juntos (ver pedido
 * del usuario). Al guardar/cancelar, vuelve a la lista.
 */
export function MyUsedListingsManager({
  listings,
  categories,
  user,
}: {
  listings: UsedListing[];
  categories: Category[];
  user: AuthUser;
}) {
  const t = useTranslations("MyUsedListingsPage");
  const tNew = useTranslations("NewUsedListingPage");
  const locale = useLocale();
  const router = useRouter();
  const [view, setView] = useState<View>("list");

  function backToList() {
    setView("list");
    router.refresh();
  }

  if (view !== "list") {
    const editing = view === "new" ? undefined : view;
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">{editing ? tNew("editTitle") : tNew("title")}</h1>
          {!editing && <p className="mt-1 text-sm text-ink/60">{tNew("subtitle")}</p>}
        </div>

        {!user.emailVerified ? (
          <div className="max-w-md rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>{tNew("verifyEmailPrompt")}</p>
            <p className="mt-2">
              <ResendVerificationButton
                email={user.email}
                className="font-medium underline underline-offset-2 hover:text-amber-900"
              />
            </p>
            <button
              type="button"
              onClick={() => setView("list")}
              className="mt-2 text-sm font-medium underline underline-offset-2"
            >
              {tNew("close")}
            </button>
          </div>
        ) : (
          <div className="max-w-2xl">
            <UsedListingForm
              listing={editing}
              categories={categories}
              user={user}
              onSaved={backToList}
              onCancel={() => setView("list")}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setView("new")}>{t("publishCta")}</Button>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-ink/60">{t("empty")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10 rounded border border-ink/10">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-3 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/used-listings/${listing.id}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-ink/60">{formatArs(listing.price)}</p>
                </div>
                <UsedListingStatusBadge status={listing.status} />
              </div>

              {listing.status === "REJECTED" && listing.rejectionReason && (
                <p className="text-ink/60">
                  <span className="font-medium text-ink">{t("rejectionReason")} </span>
                  {listing.rejectionReason}
                </p>
              )}

              <p className="text-xs text-ink/40">
                {t("publishedOn", {
                  date: formatDate(listing.createdAt, locale, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                })}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {listing.status !== "SOLD" && (
                  <button
                    type="button"
                    onClick={() => setView(listing)}
                    className="rounded border border-ink/20 px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
                  >
                    {t("edit")}
                  </button>
                )}
                {listing.status === "APPROVED" && (
                  <>
                    <ConfirmStillAvailableButton listingId={listing.id} />
                    <MarkAsSoldButton listingId={listing.id} />
                  </>
                )}
                <DeleteUsedListingButton listingId={listing.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
