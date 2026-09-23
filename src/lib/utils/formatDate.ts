// Mapea el locale de la UI (next-intl) al locale real de Intl a usar para
// fechas — mismo criterio que ya usaba PostMeta.tsx, ahora compartido por
// todo lo que necesita formatear una fecha según el idioma activo (cuentas,
// pedidos, devoluciones, blog).
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
