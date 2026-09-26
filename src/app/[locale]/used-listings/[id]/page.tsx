import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { UsedListingContactCard } from "@/components/usedListings/UsedListingContactCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiFetch, ApiError } from "@/lib/api/client";
import { formatArs } from "@/lib/utils/formatPrice";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, usedListingJsonLd } from "@/lib/seo/jsonLd";
import { imageUrl } from "@/lib/utils/imageUrl";
import { env } from "@/config/env";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { UsedListing } from "@/types/usedListing";

type Props = { params: Promise<{ locale: string; id: string }> };

async function getListing(id: string): Promise<UsedListing> {
  // Un id no numérico (ej. una ruta vieja tipo /used-listings/new que ya no
  // existe) tiene que dar 404 acá, no llegar a romper contra el backend.
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await apiFetch<UsedListing>(`/used-listings/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!/^\d+$/.test(id)) return {};
  let listing: UsedListing;
  try {
    listing = await apiFetch<UsedListing>(`/used-listings/${id}`);
  } catch {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildMetadata({
    locale: locale as AppLocale,
    href: `/used-listings/${id}`,
    title: listing.title,
    description: `${listing.description.slice(0, 200)} ${t("usedListingDescriptionSuffix", { city: listing.city })}`,
    image: listing.images[0] ? imageUrl(listing.images[0]) : undefined,
  });
}

export default async function Page({ params }: Props) {
  const { id, locale } = await params;
  const [listing, tNav] = await Promise.all([
    getListing(id),
    getTranslations("Nav"),
  ]);
  const canonicalPath = getPathname({ href: `/used-listings/${id}`, locale: locale as AppLocale });

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: tNav("usedListings"), path: "/used-listings" },
            { name: listing.title, path: canonicalPath },
          ]),
          usedListingJsonLd(listing, `${env.siteUrl}${canonicalPath}`),
        ]}
      />
      <Breadcrumb
        current={listing.title}
        parent={{ label: tNav("usedListings"), href: "/used-listings" }}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ImageGallery images={listing.images} alt={listing.title} />

        <div className="flex flex-col gap-4">
          {listing.category && (
            <p className="text-xs text-ink/50 uppercase">{listing.category.name}</p>
          )}
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          <p className="text-sm text-ink/60">{listing.city}</p>
          <div className="text-2xl font-semibold text-primary">
            {formatArs(listing.price)}
          </div>

          <UsedListingContactCard listing={listing} />

          <p className="whitespace-pre-line text-ink/80">{listing.description}</p>
        </div>
      </div>
    </Container>
  );
}
