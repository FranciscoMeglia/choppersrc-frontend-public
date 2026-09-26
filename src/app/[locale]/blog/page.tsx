import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryTabs } from "@/components/blog/CategoryTabs";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { PostCard } from "@/components/blog/PostCard";
import { apiFetch } from "@/lib/api/client";
import { BLOG_CATEGORIES } from "@/lib/blog/categoryLabels";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { BlogCategory, BlogPost } from "@/types/blogPost";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

function isBlogCategory(value: string | undefined): value is BlogCategory {
  return !!value && (BLOG_CATEGORIES as string[]).includes(value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  // Canonical siempre a /blog "limpio": el filtro por categoría es una
  // variante de la misma página (ver el mismo criterio en /products).
  return buildMetadata({
    locale: locale as AppLocale,
    href: "/blog",
    title: t("blog.title"),
    description: t("blog.description"),
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: rawCategory } = await searchParams;
  const category = isBlogCategory(rawCategory) ? rawCategory : undefined;

  const [posts, t, tNav, tCategory] = await Promise.all([
    apiFetch<BlogPost[]>(
      `/blog?limit=13${category ? `&category=${category}` : ""}`,
    ).catch((err) => {
      console.error("BlogPage: falling back to empty list", err);
      return [] as BlogPost[];
    }),
    getTranslations("BlogPage"),
    getTranslations("Nav"),
    getTranslations("BlogCategory"),
  ]);
  const [featured, ...rest] = posts;

  return (
    <Container>
      <Breadcrumb current={tNav("blog")} />
      <Reveal>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
          {tNav("blog")}
        </h1>
        <p className="mt-2 max-w-xl text-ink/70">{t("description")}</p>
      </Reveal>

      <div className="mt-8">
        <CategoryTabs active={category ?? "TODOS"} />
      </div>

      {featured ? (
        <>
          <div className="mt-8">
            <FeaturedPost post={featured} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={Math.min(i, 5) * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-12 text-center text-sm text-ink/60">
          {category
            ? t("noPostsInCategory", { category: tCategory(category) })
            : t("noPosts")}
        </p>
      )}
    </Container>
  );
}
