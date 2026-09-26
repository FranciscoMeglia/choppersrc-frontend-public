"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorBoundary");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <Reveal className="flex flex-col items-center gap-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            {t("description")}
          </p>
        </div>
        <Button onClick={() => reset()} className="mt-2 px-6 py-3 text-base">
          {t("retry")}
        </Button>
      </Reveal>
    </section>
  );
}
