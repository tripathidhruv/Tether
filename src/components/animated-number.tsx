"use client";

import { SlidingNumber } from "@animate-ui/react/primitives/texts/sliding-number";

export function AnimatedNumber({ value, from = 0, className = "" }: { value: number; from?: number; className?: string }) {
  return <SlidingNumber number={value} fromNumber={from} thousandSeparator="," inView inViewOnce className={className} />;
}
