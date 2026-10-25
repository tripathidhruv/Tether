"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SlidingNumber } from "@animate-ui/react/primitives/texts/sliding-number";
import { cx } from "@/components/ui";

const steps = [
  { action: "email.read", detail: "Supplier email, untrusted", score: 6 },
  { action: "file.read supplier_invoice.pdf", detail: "Hidden text on page 2", score: 9 },
  { action: "price_check SKU-2210", detail: "Normal for this task", score: 4 },
  { action: "file.read hr/salaries.csv", detail: "Not in role. Ordered by the PDF.", score: 92, flagged: true },
  { action: "price_check SKU-2214", detail: "Work carries on", score: 4 },
];

/** The one orchestrated moment on the page: a hijack, replayed once. */
export function HeroReplay() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCount((n) => (n >= steps.length ? n : n + 1)), 900);
    return () => clearInterval(id);
  }, [reduce]);

  const shown = reduce ? steps.length : count;
  const visible = steps.slice(0, shown);
  const score = visible.reduce((max, s) => Math.max(max, s.score), 0);
  const caught = score >= 80;

  return (
    <div className="rounded-[32px] bg-forest p-6 text-white sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[15.5px] text-[#D3DDD6]">Procurement Agent</p>
          <p className="mt-1 text-[16.5px] font-semibold">Token valid, every access check passed</p>
        </div>
        <div className="text-right">
          <p className="text-[14.5px] text-[#D3DDD6]">Drift Score</p>
          <SlidingNumber number={score} className="font-display text-[64px] font-extrabold leading-[0.9] tabular" />
        </div>
      </div>

      <ol className="mt-6 min-h-[330px] space-y-2" aria-label="Agent actions">
        <AnimatePresence initial={false}>
          {visible.map((s) => (
            <motion.li
              key={s.action}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cx(
                "flex items-center justify-between gap-4 rounded-[16px] px-4 py-3",
                s.flagged ? "bg-blush text-blush-ink" : "bg-forest-2",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold">{s.action}</p>
                <p className={cx("text-[14px]", s.flagged ? "text-blush-ink" : "text-[#C4D0C8]")}>{s.detail}</p>
              </div>
              <span className={cx("shrink-0 rounded-full px-2.5 py-0.5 text-[13.5px] font-semibold tabular", s.flagged ? "bg-white/70" : "bg-forest-line text-[#DCE5DE]")}>
                {s.flagged ? "Cut" : "Allowed"}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      <p className={cx("mt-5 min-h-[44px] text-[15.5px] leading-relaxed transition-opacity duration-500", caught ? "opacity-100" : "opacity-0")} aria-live="polite">
        {caught && (
          <>
            <span className="font-semibold text-leaf">HR read and outside send cut.</span>{" "}
            <span className="text-[#DCE5DE]">Price checks keep running. 0 KB left the company.</span>
          </>
        )}
      </p>
    </div>
  );
}
