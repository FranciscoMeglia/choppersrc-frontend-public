import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded border border-ink/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "text-sm";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const topicKeys = [
    "topicProduct",
    "topicOrderStatus",
    "topicReturns",
    "topicPartner",
    "topicOther",
  ] as const;

  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
        {t("heading")}
      </p>

      <form className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            {t("name")}
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
          <label className={labelClass}>
            {t("email")}
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            {t("phone")} <span className="text-ink/40">{t("optional")}</span>
            <input
              type="tel"
              placeholder={t("phonePlaceholder")}
              className={`mt-1 ${inputClass}`}
            />
          </label>
          <label className={labelClass}>
            {t("topic")}
            <select className={`mt-1 ${inputClass}`}>
              {topicKeys.map((key) => (
                <option key={key}>{t(key)}</option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          {t("message")}
          <textarea
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">{t("submit")}</Button>
          <p className="text-sm text-ink/60">{t("responseNote")}</p>
        </div>
      </form>
    </div>
  );
}
