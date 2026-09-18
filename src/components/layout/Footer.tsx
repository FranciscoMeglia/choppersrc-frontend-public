import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { legalNav, site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";

export async function Footer() {
  const [t, tNav, tSite, settings] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getTranslations("Site"),
    getPublicSettings(),
  ]);

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Image
            src="/images/logoWhite.webp"
            alt={site.name}
            width={1536}
            height={1024}
            className="h-20 w-auto self-center object-contain"
          />
          <p className="text-white/80">{tSite("footerDescription")}</p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
            {t("shop")}
          </p>
          <span className="mt-2 block h-0.5 w-8 bg-primary" />
          <nav className="mt-4 flex flex-col gap-2.5">
            <Link href="/products" className="text-white/85 hover:text-primary">
              {tNav("products")}
            </Link>
            <Link href="/blog" className="text-white/85 hover:text-primary">
              {tNav("blog")}
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
            {t("company")}
          </p>
          <span className="mt-2 block h-0.5 w-8 bg-primary" />
          <nav className="mt-4 flex flex-col gap-2.5">
            <Link href="/about" className="text-white/85 hover:text-primary">
              {tNav("about")}
            </Link>
            <Link href="/contact" className="text-white/85 hover:text-primary">
              {tNav("contact")}
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
            {t("help")}
          </p>
          <span className="mt-2 block h-0.5 w-8 bg-primary" />
          <nav className="mt-4 flex flex-col gap-2.5">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/85 hover:text-primary"
              >
                {tNav(item.key)}
              </Link>
            ))}
            <span className="text-white/50">{settings.contactEmail}</span>
            <a
              href={`https://wa.me/${settings.contactPhone.replace(/\D/g, "")}`}
              className="text-white/85 hover:text-primary"
            >
              {settings.contactPhone}
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-white/60 sm:flex-row">
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
              name: site.name,
            })}
          </p>
          <p>{t("paymentMethods")}</p>
        </div>
      </div>
    </footer>
  );
}
