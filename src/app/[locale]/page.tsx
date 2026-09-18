import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { LatestPosts } from "@/components/home/LatestPosts";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { apiFetch } from "@/lib/api/client";
import { MOCK_STATS } from "@/lib/mock/statsMockData";
import type { Product } from "@/types/product";
import type { BlogPost } from "@/types/blogPost";
import type { Brand } from "@/types/catalog";

export default async function HomePage() {
  const [featuredProducts, latestPosts, brands] = await Promise.all([
    apiFetch<Product[]>("/products?limit=6"),
    apiFetch<BlogPost[]>("/blog?limit=3"),
    apiFetch<Brand[]>("/brands?featured=true"),
  ]);

  return (
    <>
      <Hero />
      <StatsBar stats={MOCK_STATS} />
      <FeaturedProducts products={featuredProducts} />
      <PromoBanner />
      <LatestPosts posts={latestPosts} />
      <BrandsCarousel brands={brands} />
    </>
  );
}
