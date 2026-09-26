import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { UsedListingFilters } from "@/components/usedListings/UsedListingFilters";
import { UsedListingSortBar } from "@/components/usedListings/UsedListingSortBar";
import { UsedListingGrid } from "@/components/usedListings/UsedListingGrid";
import { PublishUsedListingPanel } from "@/components/usedListings/PublishUsedListingPanel";
import { apiFetchPage } from "@/lib/api/client";
import { getCategories } from "@/lib/catalog/facets";
import { getCurrentUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { ProductsSearchParams } from "@/lib/utils/productSearchParams";
import type { UsedListing } from "@/types/usedListing";

const PAGE_SIZE = 30;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ProductsSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildMetadata({
    locale: locale as AppLocale,
    href: "/used-listings",
    title: t("usedListings.title"),
    description: t("usedListings.description"),
  });
}

export default async function UsedListingsPage({ searchParams }: Props) {
  const current = await searchParams;
  const [t, tNav] = await Promise.all([
    getTranslations("UsedListingsPage"),
    getTranslations("Nav"),
  ]);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (current.category) query.set("category", current.category);
  if (current.minPrice) query.set("minPrice", current.minPrice);
  if (current.maxPrice) query.set("maxPrice", current.maxPrice);
  if (current.sort) query.set("sort", current.sort);

  const [{ data: listings, pagination }, categories, user] = await Promise.all([
    apiFetchPage<UsedListing[]>(`/used-listings?${query.toString()}`).catch((err) => {
      console.error("UsedListingsPage: falling back to empty results", err);
      return {
        data: [] as UsedListing[],
        pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 },
      };
    }),
    getCategories(),
    getCurrentUser(),
  ]);

  return (
    <Container>
      <Breadcrumb current={tNav("usedListings")} />
      <Reveal>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              {tNav("usedListings")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink/60">{t("subtitle")}</p>
          </div>
          <PublishUsedListingPanel categories={categories} user={user} />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <UsedListingFilters categories={categories} current={current} />

        <div className="flex flex-col gap-6">
          <UsedListingSortBar count={pagination.total} current={current} />
          <UsedListingGrid
            key={query.toString()}
            initialListings={listings}
            initialPagination={pagination}
            queryString={query.toString()}
          />
        </div>
      </div>
    </Container>
  );
}
