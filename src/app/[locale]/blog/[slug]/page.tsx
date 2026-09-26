import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { PostMeta } from "@/components/blog/PostMeta";
import { EventInfo } from "@/components/blog/EventInfo";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiFetch, ApiError } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/seo/jsonLd";
import { imageUrl } from "@/lib/utils/imageUrl";
import { env } from "@/config/env";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { BlogPost } from "@/types/blogPost";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getPost(slug: string): Promise<BlogPost> {
  try {
    return await apiFetch<BlogPost>(`/blog/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let post: BlogPost;
  try {
    post = await apiFetch<BlogPost>(`/blog/${slug}`);
  } catch {
    return {};
  }

  const description =
    post.excerpt || post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);

  return buildMetadata({
    locale: locale as AppLocale,
    href: `/blog/${slug}`,
    title: post.title,
    description,
    image: post.images[0] ? imageUrl(post.images[0]) : undefined,
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  const [post, tNav, tCategory] = await Promise.all([
    getPost(slug),
    getTranslations("Nav"),
    getTranslations("BlogCategory"),
  ]);
  const canonicalPath = getPathname({ href: `/blog/${slug}`, locale: locale as AppLocale });

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: tNav("blog"), path: "/blog" },
            { name: post.title, path: canonicalPath },
          ]),
          blogPostingJsonLd(post, `${env.siteUrl}${canonicalPath}`),
        ]}
      />
      <Breadcrumb
        current={post.title}
        parent={{ label: tNav("blog"), href: "/blog" }}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ImageGallery
          images={post.images}
          alt={post.title}
          aspectClassName="aspect-video"
        />

        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            {tCategory(post.category)}
          </p>
          <h1 className="text-3xl font-semibold">{post.title}</h1>
          <EventInfo
            eventDateStart={post.eventDateStart}
            eventDateEnd={post.eventDateEnd}
            location={post.location}
          />
          {post.publishedAt && (
            <PostMeta date={post.publishedAt} excerpt={null} />
          )}
        </div>
      </div>

      <div
        className="rich-text mt-8 max-w-3xl text-ink/80"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Container>
  );
}
