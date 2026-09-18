import { useTranslations } from "next-intl";
import type { AboutValue } from "@/lib/mock/aboutMockData";

export function ValuesGrid({ values }: { values: AboutValue[] }) {
  const t = useTranslations("ValuesGrid");
  const tValues = useTranslations("AboutValues");

  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-ink/60 uppercase">
        {t("eyebrow")}
      </p>
      <h2 className="mt-1 text-2xl font-semibold">{t("title")}</h2>

      <div className="mt-8 grid grid-cols-1 divide-y divide-ink/10 rounded border border-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {values.map((value) => (
          <div key={value.number} className="flex flex-col gap-3 p-6">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-medium text-white">
              {value.number}
            </span>
            <p className="font-semibold">{tValues(value.titleKey)}</p>
            <p className="text-sm text-ink/70">{tValues(value.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
