import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { PostMeta } from "@/components/blog/PostMeta";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { BlogPost } from "@/types/blogPost";

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<BlogPost> {
  try {
    return await apiFetch<BlogPost>(`/blog/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) notFound();
    throw error;
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [post, tNav, tCategory] = await Promise.all([
    getPost(slug),
    getTranslations("Nav"),
    getTranslations("BlogCategory"),
  ]);

  return (
    <Container>
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
          {post.publishedAt && (
            <PostMeta date={post.publishedAt} excerpt={null} />
          )}
        </div>
      </div>

      <div className="mt-8 max-w-3xl whitespace-pre-line text-ink/80">
        {post.content}
      </div>
    </Container>
  );
}
