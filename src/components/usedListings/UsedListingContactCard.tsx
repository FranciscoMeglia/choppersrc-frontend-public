import { useTranslations } from "next-intl";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { formatPhone } from "@/lib/utils/phone";
import type { UsedListing } from "@/types/usedListing";

export function UsedListingContactCard({ listing }: { listing: UsedListing }) {
  const t = useTranslations("UsedListingDetail");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-ink/10 p-5">
      <div>
        <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
          {t("sellerLabel")}
        </p>
        <p className="mt-1 font-semibold">{listing.contactName}</p>
      </div>

      <a
        href={buildWhatsAppUrl(listing.contactPhone)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded bg-[#25D366] px-4 py-3 text-white hover:bg-[#1fbd59]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6a3.8 3.8 0 0 0 1.7.1c.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" />
        </svg>
        <span className="text-sm font-medium">{formatPhone(listing.contactPhone)}</span>
      </a>

      <a
        href={`mailto:${listing.contactEmail}`}
        className="flex items-center gap-3 rounded border border-ink/15 px-4 py-3 text-sm hover:border-primary hover:text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="h-5 w-5 shrink-0"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {listing.contactEmail}
      </a>

      <p className="text-xs text-ink/50">{t("noStoreInvolvement")}</p>
    </div>
  );
}
