const DATE_LOCALES: Record<string, string> = {
  es: "es-AR",
  en: "en-US",
  pt: "pt-BR",
};

export function formatDate(
  date: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale] ?? locale, options).format(
    new Date(date),
  );
}
