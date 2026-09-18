import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { StatsBar } from "@/components/home/StatsBar";
import { OurStory } from "@/components/about/OurStory";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { QuoteBlock } from "@/components/about/QuoteBlock";
import { MOCK_STATS } from "@/lib/mock/statsMockData";
import { ABOUT_VALUES } from "@/lib/mock/aboutMockData";

export default async function AboutPage() {
  const [t, tNav] = await Promise.all([
    getTranslations("AboutPage"),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-12 sm:pb-16">
          <Breadcrumb current={tNav("about")} />
          <Reveal>
            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <span className="mt-2 block h-1 w-10 bg-primary" />
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight uppercase sm:text-5xl">
              {t("title")}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <Reveal className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <OurStory />
        </Reveal>
      </section>

      <StatsBar stats={MOCK_STATS} />

      <section>
        <Reveal className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <ValuesGrid values={ABOUT_VALUES} />
        </Reveal>
      </section>

      <section>
        <Reveal className="mx-auto max-w-6xl px-6 pb-12 sm:pb-16">
          <QuoteBlock quote={t("quote")} author={t("quoteAuthor")} />
        </Reveal>
      </section>
    </>
  );
}
