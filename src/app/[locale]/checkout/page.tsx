import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowRight } from "@/components/ui/ArrowRight";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCurrentUser } from "@/lib/auth/session";
import { getCart } from "@/lib/cart/session";
import { cartToLines, hydrateCartLines } from "@/lib/cart/mapCart";
import { authFetch } from "@/lib/api/authFetch";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { Address } from "@/types/address";

type Props = { params: Promise<{ locale: string }> };

// Transaccional, sin valor de búsqueda — noindex (ver robots.ts).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CheckoutPage" });
  return buildMetadata({ locale: locale as AppLocale, href: "/checkout", title: t("title"), description: t("title"), noIndex: true });
}

export default async function CheckoutPage() {
  const [user, t, tCommon] = await Promise.all([
    getCurrentUser(),
    getTranslations("CheckoutPage"),
    getTranslations("Common"),
  ]);
  if (!user) redirect("/login?redirect=/checkout");

  if (!user.emailVerified) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <div className="mt-6 max-w-md rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p>{t("verifyEmailPrompt")}</p>
          <p className="mt-2">
            <ResendVerificationButton
              email={user.email}
              className="font-medium underline underline-offset-2 hover:text-amber-900"
            />
          </p>
        </div>
      </Container>
    );
  }

  const [cart, addresses, settings] = await Promise.all([
    getCart(),
    authFetch<Address[]>("/addresses"),
    getPublicSettings(),
  ]);
  const items = cart ? await hydrateCartLines(cartToLines(cart)) : [];

  if (items.length === 0) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-6 text-sm text-ink/60">
          {t("emptyCart")}{" "}
          <Link href="/products" className="group text-primary hover:underline">
            {tCommon("viewCatalog")}
            <ArrowRight />
          </Link>
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb current={t("title")} />
      <h1 className="mt-2 text-2xl font-semibold">{t("title")}</h1>

      <div className="mt-6">
        <CheckoutForm
          user={user}
          items={items}
          initialAddresses={addresses}
          settings={settings}
        />
      </div>
    </Container>
  );
}
