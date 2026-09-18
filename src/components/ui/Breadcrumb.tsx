import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Breadcrumb({
  current,
  parent,
}: {
  current: string;
  parent?: { label: string; href: string };
}) {
  const t = useTranslations("Breadcrumb");

  return (
    <nav className="text-sm text-ink/60">
      <Link href="/" className="hover:text-primary hover:underline">
        {t("home")}
      </Link>{" "}
      /{" "}
      {parent && (
        <>
          <Link
            href={parent.href}
            className="hover:text-primary hover:underline"
          >
            {parent.label}
          </Link>{" "}
          /{" "}
        </>
      )}
      <span className="text-ink">{current}</span>
    </nav>
  );
}
