import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { BlogPost } from "@/types/blogPost";

export async function LatestPosts({ posts }: { posts: BlogPost[] }) {
  const t = await getTranslations("LatestPosts");

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          cta={{ href: "/blog", label: t("cta") }}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 5) * 0.06}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
