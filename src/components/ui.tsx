import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { bandFor, bands, type Band } from "@/lib/data";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect width="30" height="30" rx="10" className={dark ? "fill-leaf" : "fill-ink"} />
        <path d="M9 20 C 12 9, 18 21, 21 10" fill="none" strokeWidth="2" strokeLinecap="round" className={dark ? "stroke-ink" : "stroke-leaf"} />
        <circle cx="9" cy="20" r="2.6" className={dark ? "fill-ink" : "fill-white"} />
        <circle cx="21" cy="10" r="2.6" className={dark ? "fill-ink" : "fill-white"} />
      </svg>
      <span className={cx("font-display text-[22px] font-extrabold", dark ? "text-white" : "text-ink")}>Tether</span>
    </span>
  );
}

export function Card({ className = "", children, ...rest }: ComponentProps<"section">) {
  return (
    <section className={cx("rounded-[26px] bg-surface p-6", className)} {...rest}>
      {children}
    </section>
  );
}

export function CardTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{children}</h2>
      {aside}
    </div>
  );
}

export function BandBadge({ band, score, size = "md" }: { band?: Band; score?: number; size?: "sm" | "md" }) {
  const b = band ?? bandFor(score ?? 0);
  const meta = bands[b];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold",
        meta.tone,
        meta.text,
        size === "sm" ? "px-2.5 py-0.5 text-[13.5px]" : "px-3 py-1 text-[14.5px]",
      )}
    >
      {score !== undefined && <span className="tabular">{score}</span>}
      {meta.label}
    </span>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:opacity-50";

export const buttonStyles = {
  dark: cx(buttonBase, "bg-ink px-5 py-3 text-[16.5px] text-white hover:bg-forest-2"),
  light: cx(buttonBase, "bg-white px-5 py-3 text-[16.5px] text-ink ring-1 ring-line hover:bg-mist"),
  leaf: cx(buttonBase, "bg-leaf px-5 py-3 text-[16.5px] text-ink hover:bg-[#a3d38b]"),
  ghostOnDark: cx(buttonBase, "px-5 py-3 text-[16.5px] text-white ring-1 ring-forest-line hover:bg-forest-2"),
  small: cx(buttonBase, "bg-mist px-3.5 py-1.5 text-[14.5px] text-ink ring-1 ring-line hover:bg-white"),
};

export function ButtonLink({ href, variant = "dark", children, className = "" }: { href: string; variant?: keyof typeof buttonStyles; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cx(buttonStyles[variant], className)}>
      {children}
    </Link>
  );
}

export function PageHeader({ title, intro, aside }: { title: string; intro: string; aside?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <h1 className="text-balance [overflow-wrap:anywhere] font-display text-[34px] sm:text-[44px] font-extrabold leading-[0.95] text-ink">{title}</h1>
        <p className="mt-3 text-[16.5px] leading-relaxed text-ink-2">{intro}</p>
      </div>
      {aside}
    </header>
  );
}

export function Code({ children, className = "" }: { children: string; className?: string }) {
  return (
    <pre className={cx("overflow-x-auto whitespace-pre-wrap break-words rounded-[18px] bg-forest p-5 font-mono text-[14.5px] leading-[1.7] text-[#DDE6DF]", className)}>
      <code>{children}</code>
    </pre>
  );
}
