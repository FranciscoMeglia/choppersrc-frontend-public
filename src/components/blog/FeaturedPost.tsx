import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { PostMeta } from "./PostMeta";
import { imageUrl } from "@/lib/utils/imageUrl";
import type { BlogPost } from "@/types/blogPost";

export function FeaturedPost({ post }: { post: BlogPost }) {
  const t = useTranslations("FeaturedPost");
  const tCategory = useTranslations("BlogCategory");
  const cover = post.images[0];

  return (
    <div className="grid overflow-hidden rounded border border-ink/10 lg:grid-cols-2">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-video overflow-hidden bg-ink/10 lg:aspect-auto"
      >
        {cover && (
          <Image
            src={imageUrl(cover)}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-3 left-3 rounded bg-ink/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
          {t("featured")}
        </span>
      </Link>
      <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          {tCategory(post.category)}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-2xl font-semibold hover:text-primary sm:text-3xl"
        >
          {post.title}
        </Link>
        {post.excerpt && <p className="text-ink/70">{post.excerpt}</p>}
        {post.publishedAt && (
          <PostMeta date={post.publishedAt} excerpt={null} />
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="group mt-2 text-sm font-medium text-primary hover:underline"
        >
          {t("readPost")}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
