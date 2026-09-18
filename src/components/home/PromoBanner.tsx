import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";

export async function PromoBanner() {
  const t = await getTranslations("PromoBanner");

  return (
    <section>
      <Reveal className="relative aspect-4/5 bg-ink/5 sm:aspect-2/1">
        <Image
          src="/images/bannerHome.webp"
          alt={t("alt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Reveal>
    </section>
  );
}
