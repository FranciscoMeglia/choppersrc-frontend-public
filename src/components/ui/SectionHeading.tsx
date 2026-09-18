import Link from "next/link";
import { ArrowRight } from "./ArrowRight";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  cta,
}: {
  eyebrow: string;
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
        <span className="mt-2 block h-1 w-10 bg-primary" />
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group text-sm whitespace-nowrap hover:text-primary hover:underline"
        >
          {cta.label}
          <ArrowRight />
        </Link>
      )}
    </Reveal>
  );
}
