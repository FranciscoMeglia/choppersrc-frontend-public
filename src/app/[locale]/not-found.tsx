import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <Reveal className="flex flex-col items-center gap-6">
        <p className="font-heading text-7xl font-bold tracking-tight text-primary sm:text-8xl">
          404
        </p>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            {t("description")}
          </p>
        </div>
        <LinkButton href="/" className="mt-2 px-6 py-3 text-base">
          {t("backHome")}
        </LinkButton>
      </Reveal>
    </section>
  );
}
