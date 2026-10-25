import { bands, type Band } from "@/lib/data";
import { cx } from "./ui";

/** Tiny trend line; the last point is today. */
export function Sparkline({ values, className = "", stroke = "var(--color-ink)" }: { values: number[]; className?: string; stroke?: string }) {
  const w = 120, h = 36, max = 100;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - 3 - (v / max) * (h - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cx("h-9 w-[120px] overflow-visible", className)} aria-hidden="true">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3" fill={stroke} />
    </svg>
  );
}

/**
 * Drift over time with the alarm line and the frozen anchor.
 * values: Drift Score per day, oldest first.
 */
export function DriftChart({ values, labels, alarm = 50, anchor }: { values: number[]; labels: string[]; alarm?: number; anchor: number }) {
  const w = 640, h = 220, padL = 34, padB = 26, padT = 12;
  const iw = w - padL - 8, ih = h - padB - padT;
  const x = (i: number) => padL + (i / (values.length - 1)) * iw;
  const y = (v: number) => padT + ih - (v / 100) * ih;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(values.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Drift Score by day, with the alarm line and the frozen anchor">
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - 8} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" />
          <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="12.5" fill="var(--color-ink-3)">{t}</text>
        </g>
      ))}
      <path d={area} fill="var(--color-leaf-soft)" opacity="0.7" />
      <line x1={padL} x2={w - 8} y1={y(anchor)} y2={y(anchor)} stroke="var(--color-leaf-ink)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={w - 10} y={y(anchor) - 6} textAnchor="end" fontSize="12.5" fill="var(--color-leaf-ink)">Frozen anchor</text>
      <line x1={padL} x2={w - 8} y1={y(alarm)} y2={y(alarm)} stroke="var(--color-risk)" strokeWidth="1.5" strokeDasharray="2 4" />
      <text x={w - 10} y={y(alarm) - 6} textAnchor="end" fontSize="12.5" fill="var(--color-risk)">Alarm line</text>
      <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4.5 : 2.5} fill={i === values.length - 1 ? "var(--color-risk)" : "var(--color-ink)"} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={h - 6} textAnchor="middle" fontSize="12.5" fill="var(--color-ink-3)">{l}</text>
      ))}
    </svg>
  );
}

/** One bar split by containment level; widths are proportional on a log scale so small counts stay visible. */
export function LadderBar({ items }: { items: { band: Band; count: number }[] }) {
  const weights = items.map((i) => Math.log10(i.count + 1) + 0.6);
  const total = weights.reduce((a, b) => a + b, 0);
  return (
    <div>
      <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full">
        {items.map((it, i) => (
          <div key={it.band} className={cx(bands[it.band].tone, "h-full first:rounded-l-full last:rounded-r-full")} style={{ width: `${(weights[i] / total) * 100}%` }} />
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {items.map((it) => (
          <div key={it.band}>
            <dt className="flex items-center gap-1.5 text-[14.5px] text-ink-3">
              <span className={cx("h-2 w-2 rounded-full", bands[it.band].tone)} />
              {bands[it.band].label}
            </dt>
            <dd className="mt-1 font-display text-[26px] font-extrabold tabular leading-none text-ink">{it.count.toLocaleString("en-US")}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-6 space-y-2 border-t border-line pt-5">
        {items.map((it) => (
          <li key={it.band} className="flex gap-3 text-[15px]">
            <span className="w-16 shrink-0 font-semibold text-ink">{bands[it.band].label}</span>
            <span className="w-14 shrink-0 tabular text-ink-3">{bands[it.band].range}</span>
            <span className="text-ink-2">{bands[it.band].does}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14px] text-ink-3">Bar widths use a log scale so the rare levels stay visible.</p>
    </div>
  );
}
