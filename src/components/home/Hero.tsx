import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { Reveal } from "@/components/ui/Reveal";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image
        src="/images/bg.webp"
        alt=""
        fill
        priority
        className="object-cover object-[center_10%]"
      />
      <div className="absolute inset-0 bg-black/55" />
      <Reveal className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
            {t("eyebrow")}
          </p>
          <span className="mt-2 block h-1 w-10 bg-primary" />
        </div>
        <h1 className="max-w-xl font-heading text-4xl font-bold tracking-tight uppercase sm:text-6xl">
          {t("title")}
        </h1>
        <p className="max-w-md text-white/70">{t("description")}</p>
        <div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40 sm:px-6 sm:py-3 sm:text-sm"
          >
            {t("cta")}
            <ArrowRight />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
