"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

function parse(value: string): { target: number; decimals: number; suffix: string } {
  const match = value.match(/^(\d[\d.]*)(,\d+)?(.*)$/);
  if (!match) return { target: 0, decimals: 0, suffix: "" };
  const [, intPart, decPart, suffix] = match;
  const decimals = decPart ? decPart.length - 1 : 0;
  const target = Number(
    `${intPart.replace(/\./g, "")}${decPart ? `.${decPart.slice(1)}` : ""}`,
  );
  return { target, decimals, suffix };
}

export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { target, decimals, suffix } = parse(value);
  const [display, setDisplay] = useState(
    () => `${(0).toFixed(decimals).replace(".", ",")}${suffix}`,
  );

  useEffect(() => {
    if (!isInView) return;
    const formatter = new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (current) => setDisplay(`${formatter.format(current)}${suffix}`),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
