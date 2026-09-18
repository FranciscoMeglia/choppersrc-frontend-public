import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BLOG_CATEGORIES } from "@/lib/blog/categoryLabels";
import type { BlogCategory } from "@/types/blogPost";

const TAB_VALUES: (BlogCategory | "TODOS")[] = ["TODOS", ...BLOG_CATEGORIES];

export function CategoryTabs({
  active = "TODOS",
}: {
  active?: BlogCategory | "TODOS";
}) {
  const t = useTranslations("BlogCategory");
  const tabs = TAB_VALUES.map((value) => ({ value, label: t(value) }));

  return (
    <div className="flex gap-6 overflow-x-auto border-b border-ink/10 text-sm">
      {tabs.map((tab) => {
        const href = tab.value === "TODOS" ? "/blog" : `/blog?category=${tab.value}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={
              tab.value === active
                ? "border-b-2 border-primary pb-3 font-medium whitespace-nowrap text-primary"
                : "border-b-2 border-transparent pb-3 whitespace-nowrap text-ink/70 hover:text-primary"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
