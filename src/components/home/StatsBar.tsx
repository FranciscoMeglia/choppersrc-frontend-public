import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import type { HomeStat } from "@/lib/mock/statsMockData";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M11.3 3H5a2 2 0 0 0-2 2v6.3c0 .5.2 1 .6 1.4l8.7 8.7a2 2 0 0 0 2.8 0l6.3-6.3a2 2 0 0 0 0-2.8l-8.7-8.7c-.4-.4-.9-.6-1.4-.6Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 10h3.6l3.4 3v2.5h-7z" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M12 3.3l2.6 5.4 5.9.6-4.4 4 1.2 5.9L12 16.4l-5.3 2.8 1.2-5.9-4.4-4 5.9-.6L12 3.3Z" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = [CalendarIcon, TagIcon, TruckIcon, StarIcon];

export async function StatsBar({ stats }: { stats: HomeStat[] }) {
  const t = await getTranslations("Stats");

  return (
    <section className="bg-primary text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-12 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-white/20">
        {stats.map((stat, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal
              key={stat.key}
              delay={i * 0.08}
              className="flex flex-col items-center gap-2 px-4 text-center sm:first:pl-0 sm:last:pr-0"
            >
              {Icon && <Icon className="h-6 w-6 text-white/70" />}
              <CountUp
                value={stat.value}
                className="text-2xl font-semibold sm:text-3xl"
              />
              <p className="text-xs text-white/70 uppercase">{t(stat.key)}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
