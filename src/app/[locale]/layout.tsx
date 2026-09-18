import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Oswald, Public_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { Toaster } from "@/components/ui/Toaster";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import "../globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oswald",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    title: site.name,
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`h-full ${oswald.variable} ${publicSans.variable}`}>
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider>
          <CookieConsentProvider>
            <GoogleAnalytics />
            <MotionProvider>
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
              <Toaster />
            </MotionProvider>
            <CookieBanner />
          </CookieConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
