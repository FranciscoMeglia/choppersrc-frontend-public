import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/types/product";

export async function FeaturedProducts({ products }: { products: Product[] }) {
  const t = await getTranslations("FeaturedProducts");

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          cta={{ href: "/products", label: t("cta") }}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={Math.min(i, 5) * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
