"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, FileSpreadsheet, Headset, Landmark, Search, ShoppingCart, UserPlus, Users, type LucideIcon } from "lucide-react";
import { bandFor, bands, type Band } from "@/lib/data";
import { cx } from "@/components/ui";

const icons: Record<string, LucideIcon> = {
  procurement: ShoppingCart,
  finance: Landmark,
  support: Headset,
  research: Search,
  "hr-helper": Users,
  onboarding: UserPlus,
  "report-builder": FileSpreadsheet,
};

/** Stroke colour per level, strong enough to read on white. */
export const bandStroke: Record<Band, string> = {
  allow: "#3C8A50",
  watch: "#3A70A3",
  ask: "#B98918",
  cut: "#C2554A",
  isolate: "#A63A2F",
};

export function AgentIcon({ id, score, size = 44 }: { id: string; score?: number; size?: number }) {
  const Icon = icons[id] ?? Bot;
  const band = score === undefined ? null : bandFor(score);
  return (
    <span
      className={cx("inline-flex shrink-0 items-center justify-center rounded-[14px]", band ? bands[band].tone : "bg-mist", band === "isolate" ? "text-white" : "text-ink")}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.46)} strokeWidth={1.9} />
    </span>
  );
}

/** Circular Drift Score gauge. */
export function ScoreRing({ score, size = 64, stroke = 6, label = true }: { score: number; size?: number; stroke?: number; label?: boolean }) {
  const reduce = useReducedMotion();
  const band = bandFor(score);
  const r = (size - stroke) / 2;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`Drift Score ${score}, ${bands[band].label}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-mist)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={bandStroke[band]}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? Math.max(score, 2) / 100 : 0 }}
          whileInView={{ pathLength: Math.max(score, 2) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {label && <span className="absolute font-display text-[22px] font-extrabold tabular text-ink" style={{ fontSize: size * 0.34 }}>{score}</span>}
    </span>
  );
}

/** Area sparkline tinted by level. */
export function AreaSpark({ values, band, className = "" }: { values: number[]; band: Band; className?: string }) {
  const w = 160, h = 48;
  const x = (i: number) => (i / (values.length - 1)) * w;
  const y = (v: number) => h - 4 - (v / 100) * (h - 8);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const id = `spark-${band}`;
  const c = bandStroke[band];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cx("h-12 w-40 overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.28" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={c} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="3.6" fill="#fff" stroke={c} strokeWidth="2.2" />
    </svg>
  );
}
