import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { LegalContent } from "@/components/legal/LegalContent";
import { TERMS_SECTION_SHAPES } from "@/lib/mock/termsMockData";

export default async function TermsPage() {
  const t = await getTranslations("TermsPage");

  const sections = TERMS_SECTION_SHAPES.map(({ key, paragraphCount }) => ({
    title: t(`${key}Title`),
    paragraphs: Array.from({ length: paragraphCount }, (_, i) =>
      t(`${key}P${i + 1}`),
    ),
  }));

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-12">
          <Breadcrumb current={t("title")} />
          <Reveal>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-ink/70">{t("description")}</p>
          </Reveal>
        </div>
      </section>

      <section>
        <Reveal className="mx-auto max-w-6xl px-6 py-12">
          <LegalContent sections={sections} lastUpdated={t("lastUpdated")} />
        </Reveal>
      </section>
    </>
  );
}
