"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { env } from "@/config/env";
import { useCookieConsent } from "./CookieConsentProvider";
import { pageview } from "@/lib/analytics/gtag";

export function GoogleAnalytics() {
  const { consent } = useCookieConsent();
  const pathname = usePathname();
  const enabled = consent === "accepted" && Boolean(env.gaMeasurementId);

  useEffect(() => {
    if (enabled) pageview(pathname);
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.gaMeasurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
