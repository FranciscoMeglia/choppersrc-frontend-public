import { ArrowRight as ArrowRightIcon } from "lucide-react";

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <ArrowRightIcon
      aria-hidden
      className={`-mt-0.5 ml-1 inline-block size-3.5 align-middle transition-transform duration-150 group-hover:translate-x-0.5 ${className}`}
    />
  );
}
