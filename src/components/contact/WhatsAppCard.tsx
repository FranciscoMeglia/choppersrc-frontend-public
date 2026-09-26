import { getTranslations } from "next-intl/server";
import { getPublicSettings } from "@/lib/settings/getPublicSettings";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { formatPhone } from "@/lib/utils/phone";

export async function WhatsAppCard() {
  const [t, settings] = await Promise.all([
    getTranslations("WhatsAppCard"),
    getPublicSettings(),
  ]);
  const [street, ...rest] = settings.contactAddress.split(", ");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-3xl font-semibold">{t("title")}</h2>
        <p className="mt-3 text-ink/70">{t("description")}</p>
      </div>

      <a
        href={buildWhatsAppUrl(settings.contactPhone)}
        className="flex items-center gap-3 rounded bg-[#25D366] px-5 py-4 text-white hover:bg-[#1fbd59]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 shrink-0"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6a3.8 3.8 0 0 0 1.7.1c.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" />
        </svg>
        <span>
          <span className="block font-semibold">{t("chatNow")}</span>
          <span className="block text-sm text-white/90">
            {formatPhone(settings.contactPhone)}
          </span>
        </span>
      </a>

      <p className="flex items-center gap-2 text-sm font-medium text-[#1fbd59]">
        <span className="h-2 w-2 rounded-full bg-[#25D366]" />
        {t("responseTime")}
      </p>

      <div className="flex flex-col gap-6 border-t border-ink/10 pt-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
            {t("emailLabel")}
          </p>
          <p className="mt-1 font-semibold">{settings.contactEmail}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
            {t("storeLabel")}
          </p>
          <p className="mt-1">{street}</p>
          <p>{rest.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
