import { useLocale } from "next-intl";
import { formatDate } from "@/lib/utils/formatDate";

export function EventInfo({
  eventDateStart,
  eventDateEnd,
  location,
}: {
  eventDateStart: string | null;
  eventDateEnd: string | null;
  location: string | null;
}) {
  const locale = useLocale();
  if (!eventDateStart) return null;

  const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  const dateLabel =
    eventDateEnd && eventDateEnd !== eventDateStart
      ? `${formatDate(eventDateStart, locale, dateOptions)} – ${formatDate(eventDateEnd, locale, dateOptions)}`
      : formatDate(eventDateStart, locale, dateOptions);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/60">
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        {dateLabel}
      </span>
      {location && (
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0">
            <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {location}
        </span>
      )}
    </div>
  );
}
