import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ_ITEMS } from "@/lib/mock/faqMockData";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonLd";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildMetadata({
    locale: locale as AppLocale,
    href: "/faq",
    title: t("faq.title"),
    description: t("faq.description"),
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const [t, tItems] = await Promise.all([
    getTranslations("FaqPage"),
    getTranslations({ locale, namespace: "FaqItems" }),
  ]);
  // Mismo contenido que se ve en <FaqAccordion> — Google exige que el
  // JSON-LD de FAQPage coincida con lo que el visitante realmente ve en la
  // página, nunca preguntas/respuestas que no estén visibles.
  const faqItems = FAQ_ITEMS.map((item) => ({
    question: tItems(item.questionKey),
    answer: tItems(item.answerKey),
  }));

  return (
    <>
      <JsonLd data={faqJsonLd(faqItems)} />
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
          <FaqAccordion items={FAQ_ITEMS} />
        </Reveal>
      </section>
    </>
  );
}
