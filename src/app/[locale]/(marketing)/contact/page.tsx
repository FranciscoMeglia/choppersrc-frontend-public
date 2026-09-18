import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppCard } from "@/components/contact/WhatsAppCard";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const [t, tNav] = await Promise.all([
    getTranslations("ContactPage"),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-12">
          <Breadcrumb current={tNav("contact")} />
          <Reveal>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              {tNav("contact")}
            </h1>
            <p className="mt-3 max-w-xl text-ink/70">{t("description")}</p>
          </Reveal>
        </div>
      </section>

      <section>
        <Reveal className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2 lg:divide-x lg:divide-ink/10 lg:gap-0">
          <div className="lg:pr-12">
            <WhatsAppCard />
          </div>
          <div className="lg:pl-12">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
