import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { LatestPosts } from "@/components/home/LatestPosts";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiFetch } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";
import { MOCK_STATS } from "@/lib/mock/statsMockData";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/types/product";
import type { BlogPost } from "@/types/blogPost";
import type { Brand } from "@/types/catalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildMetadata({
    locale: locale as AppLocale,
    href: "/",
    title: t("home.title"),
    description: t("home.description"),
    image: "/images/bannerHome.webp",
  });
}

async function fetchOrEmpty<T>(path: string): Promise<T[]> {
  try {
    return await apiFetch<T[]>(path);
  } catch (err) {
    console.error(`HomePage: falling back to empty list for "${path}"`, err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, latestPosts, brands, settings] = await Promise.all([
    fetchOrEmpty<Product>("/products/featured?limit=6"),
    fetchOrEmpty<BlogPost>("/blog?limit=3"),
    fetchOrEmpty<Brand>("/brands?featured=true"),
    getPublicSettings(),
  ]);

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
      <Hero />
      <StatsBar stats={MOCK_STATS} />
      <FeaturedProducts products={featuredProducts} />
      <PromoBanner />
      <LatestPosts posts={latestPosts} />
      <BrandsCarousel brands={brands} />
    </>
  );
}
