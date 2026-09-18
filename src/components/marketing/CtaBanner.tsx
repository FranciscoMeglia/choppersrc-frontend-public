import Link from "next/link";
import { ArrowRight } from "@/components/ui/ArrowRight";

export function CtaBanner({
  heading,
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-md text-2xl font-semibold sm:text-3xl">
          {heading}
        </h2>
        <Link
          href={ctaHref}
          className="group flex items-center gap-2 rounded bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-white/90"
        >
          {ctaLabel}
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
