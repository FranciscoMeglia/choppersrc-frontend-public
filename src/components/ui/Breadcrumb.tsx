import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Breadcrumb({
  current,
  parent,
  parents,
}: {
  current: string;
  /** Un solo nivel intermedio (la mayoría de las páginas). */
  parent?: { label: string; href: string };
  /**
   * Cadena de niveles intermedios, en orden (ej. grupo > categoría) — para
   * la ficha de producto cuando se entra desde un listado por categoría/grupo,
   * en vez de desde "todos los productos". Si se pasa, tiene prioridad sobre
   * `parent`.
   */
  parents?: { label: string; href: string }[];
}) {
  const t = useTranslations("Breadcrumb");
  const chain = parents ?? (parent ? [parent] : []);

  return (
    <nav className="text-sm text-ink/60">
      <Link href="/" className="hover:text-primary hover:underline">
        {t("home")}
      </Link>{" "}
      /{" "}
      {chain.map((level) => (
        <span key={level.href}>
          <Link href={level.href} className="hover:text-primary hover:underline">
            {level.label}
          </Link>{" "}
          /{" "}
        </span>
      ))}
      <span className="text-ink">{current}</span>
    </nav>
  );
}
