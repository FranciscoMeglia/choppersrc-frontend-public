import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { formatPhone } from "@/lib/utils/phone";
import { LanguageSwitcher } from "./LanguageSwitcher";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.8h2.6l.4-3h-3V8.3c0-.9.2-1.5 1.5-1.5h1.6V4.1C15.9 4 15 4 14 4c-2.2 0-3.7 1.3-3.7 3.8v2.4H7.7v3h2.6V21h3.2Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5A9.5 9.5 0 0 0 3.8 17l-1.1 4 4.2-1.1A9.5 9.5 0 1 0 12 2.5Zm0 1.7a7.8 7.8 0 1 1-4.1 14.4l-.3-.2-2.4.6.6-2.3-.2-.3A7.8 7.8 0 0 1 12 4.2Zm-3.1 4.1c-.2 0-.5 0-.7.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.5 2.4 3.7 3.2 1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1s.2-.9.1-1c-.1-.1-.2-.2-.5-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.5.7c-.1.2-.3.2-.5.1-.5-.2-1.3-.6-1.9-1.3-.5-.6-.8-1.2-.9-1.4-.1-.2 0-.4.1-.5l.5-.6c.1-.2.1-.4 0-.5l-.6-1.5c-.1-.2-.3-.4-.5-.4Z" />
    </svg>
  );
}

export async function TopBar() {
  const [t, settings] = await Promise.all([
    getTranslations("TopBar"),
    getPublicSettings(),
  ]);

  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-6">
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${settings.contactEmail}`}
            className="flex items-center gap-1.5 text-white/70 hover:text-white"
          >
            <MailIcon className="h-3.5 w-3.5" />
            {settings.contactEmail}
          </a>
          <a
            href={buildWhatsAppUrl(settings.contactPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-white/70 hover:text-white sm:flex"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            {formatPhone(settings.contactPhone)}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={settings.socialFacebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("facebookAria", { name: site.name })}
            className="inline-flex text-white/70 transition-all duration-150 hover:-translate-y-0.5 hover:text-white"
          >
            <FacebookIcon className="h-4.5 w-4.5" />
          </Link>
          <Link
            href={settings.socialInstagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("instagramAria", { name: site.name })}
            className="inline-flex text-white/70 transition-all duration-150 hover:-translate-y-0.5 hover:text-white"
          >
            <InstagramIcon className="h-4.5 w-4.5" />
          </Link>
          <Link
            href={settings.socialYoutube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("youtubeAria", { name: site.name })}
            className="inline-flex text-white/70 transition-all duration-150 hover:-translate-y-0.5 hover:text-white"
          >
            <YoutubeIcon className="h-4.5 w-4.5" />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
