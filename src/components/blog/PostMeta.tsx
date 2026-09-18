import { useLocale } from "next-intl";

const DATE_LOCALES: Record<string, string> = {
  es: "es-AR",
  en: "en-US",
  pt: "pt-BR",
};

export function PostMeta({
  date,
  excerpt,
}: {
  date: string;
  excerpt: string | null;
}) {
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
      <span className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5 shrink-0"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        {new Date(date).toLocaleDateString(DATE_LOCALES[locale] ?? locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
      {excerpt && (
        <span className="flex min-w-0 items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-3.5 w-3.5 shrink-0"
          >
            <path
              d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="truncate">{excerpt}</span>
        </span>
      )}
    </div>
  );
}
