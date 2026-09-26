import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatArs } from "@/lib/utils/formatPrice";
import { imageUrl } from "@/lib/utils/imageUrl";
import type { UsedListing } from "@/types/usedListing";

export function UsedListingCard({ listing }: { listing: UsedListing }) {
  const cover = listing.images[0];

  return (
    <Link
      href={`/used-listings/${listing.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-background shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative block aspect-square overflow-hidden bg-ink/5">
        {cover ? (
          <Image
            src={imageUrl(cover)}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="h-16 w-16"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {listing.category && (
          <p className="text-xs font-medium text-ink/50 uppercase">{listing.category.name}</p>
        )}
        <p className="line-clamp-2 min-h-10 text-sm font-medium">{listing.title}</p>
        <p className="text-base font-semibold text-primary">{formatArs(listing.price)}</p>
        <p className="mt-auto text-xs text-ink/50">{listing.city}</p>
      </div>
    </Link>
  );
}
