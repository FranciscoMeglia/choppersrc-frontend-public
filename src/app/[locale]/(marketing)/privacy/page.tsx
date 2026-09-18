import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { LegalContent } from "@/components/legal/LegalContent";
import { PRIVACY_SECTION_SHAPES } from "@/lib/mock/privacyMockData";

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");

  const sections = PRIVACY_SECTION_SHAPES.map(({ key, paragraphCount, table }) => ({
    title: t(`${key}Title`),
    paragraphs: Array.from({ length: paragraphCount }, (_, i) =>
      t(`${key}P${i + 1}`),
    ),
    table: table
      ? {
          headers: t.raw(`${key}TableHeaders`) as string[],
          rows: Array.from({ length: table.rowCount }, (_, i) =>
            t.raw(`${key}Row${i + 1}`),
          ) as string[][],
        }
      : undefined,
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
