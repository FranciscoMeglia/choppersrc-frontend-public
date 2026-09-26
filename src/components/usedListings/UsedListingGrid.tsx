"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { UsedListingCard } from "./UsedListingCard";
import { apiFetchPage } from "@/lib/api/client";
import type { Pagination } from "@/types/api";
import type { UsedListing } from "@/types/usedListing";

const PAGE_SIZE = 30;

export function UsedListingGrid({
  initialListings,
  initialPagination,
  queryString,
}: {
  initialListings: UsedListing[];
  initialPagination: Pagination;
  queryString: string;
}) {
  const t = useTranslations("UsedListingGrid");
  const [listings, setListings] = useState(initialListings);
  const [page, setPage] = useState(initialPagination.page);
  const [total, setTotal] = useState(initialPagination.total);
  const [loading, setLoading] = useState(false);

  if (listings.length === 0) {
    return <p className="py-12 text-center text-sm text-ink/60">{t("noResults")}</p>;
  }

  async function handleLoadMore() {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const { data, pagination } = await apiFetchPage<UsedListing[]>(
        `/used-listings?${queryString}&page=${nextPage}`,
      );
      setListings((prev) => [...prev, ...data]);
      setPage(pagination.page);
      setTotal(pagination.total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, i) => (
          <Reveal key={listing.id} delay={Math.min(i % PAGE_SIZE, 5) * 0.06}>
            <UsedListingCard listing={listing} />
          </Reveal>
        ))}
      </div>

      {listings.length < total && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleLoadMore} disabled={loading}>
            {loading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
