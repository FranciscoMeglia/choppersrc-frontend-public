import Image from "next/image";
import { useTranslations } from "next-intl";

export function OurStory() {
  const t = useTranslations("OurStory");

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4 text-ink/80">
        <p className="font-medium text-ink">{t("p1")}</p>
        <p>
          {t.rich("p2", {
            b: (chunks) => <strong className="text-ink">{chunks}</strong>,
          })}
        </p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
        <p>{t("p5")}</p>
      </div>

      <div className="relative aspect-4/5 bg-ink lg:aspect-auto">
        <Image
          src="/images/choppersrc.webp"
          alt={t("imageAlt")}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
