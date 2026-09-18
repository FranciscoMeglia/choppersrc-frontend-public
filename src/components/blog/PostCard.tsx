import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { PostMeta } from "./PostMeta";
import { imageUrl } from "@/lib/utils/imageUrl";
import type { BlogPost } from "@/types/blogPost";

export function PostCard({ post }: { post: BlogPost }) {
  const t = useTranslations("PostCard");
  const tCategory = useTranslations("BlogCategory");
  const cover = post.images[0];

  return (
    <div className="overflow-hidden rounded border border-ink/10">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-video overflow-hidden bg-ink/5"
      >
        {cover && (
          <Image
            src={imageUrl(cover)}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-2 left-2 rounded bg-ink px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
          {tCategory(post.category)}
        </span>
      </Link>
      <div className="flex flex-col gap-2 p-4">
        <Link
          href={`/blog/${post.slug}`}
          className="font-semibold hover:text-primary"
        >
          {post.title}
        </Link>
        {post.publishedAt && (
          <PostMeta date={post.publishedAt} excerpt={post.excerpt} />
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="group mt-1 text-sm font-medium text-primary hover:underline"
        >
          {t("viewPost")}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
