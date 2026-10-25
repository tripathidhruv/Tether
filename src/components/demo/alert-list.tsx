"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Root as Tabs, TabsContent, TabsList, TabsTrigger } from "@animate-ui/react/primitives/radix-ui/tabs";
import { AgentIcon } from "@/components/demo/visuals";
import { cx } from "@/components/ui";
import { agentById, alerts, bandFor, bands, type Alert, type Band } from "@/lib/data";

const filters: { value: string; label: string; match: (a: Alert) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "decide", label: "Needs a decision", match: (a) => bandFor(a.score) === "ask" },
  { value: "contained", label: "Contained", match: (a) => ["cut", "isolate"].includes(bandFor(a.score)) },
  { value: "watching", label: "Watching", match: (a) => bandFor(a.score) === "watch" },
];

const status: Record<Band, { label: string; tone: string }> = {
  allow: { label: "Allowed", tone: "bg-leaf-soft text-leaf-ink" },
  watch: { label: "Watching", tone: "bg-sky text-sky-ink" },
  ask: { label: "Waiting for you", tone: "bg-butter text-butter-ink" },
  cut: { label: "Contained", tone: "bg-ink text-white" },
  isolate: { label: "Isolated", tone: "bg-risk text-white" },
};

const trigger =
  "rounded-full px-5 py-2.5 text-[16px] font-semibold text-ink-2 transition-colors data-[state=active]:bg-ink data-[state=active]:text-white";

function AlertCard({ a }: { a: Alert }) {
  const band = bandFor(a.score);
  const agent = agentById(a.agentId)!;
  const preview = a.chain.slice(0, 4);
  return (
    <Link
      href={`/demo/alerts/${a.id}`}
      className="group grid grid-cols-1 items-center gap-5 rounded-[26px] bg-surface p-4 pr-6 ring-1 ring-transparent transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(24,35,29,0.35)] hover:ring-line md:grid-cols-[128px_1fr_auto]"
    >
      <div className={cx("flex h-full min-h-[112px] flex-col justify-between rounded-[20px] p-4", bands[band].tone)}>
        <span className={cx("text-[14.5px] font-bold", band === "isolate" ? "text-white" : bands[band].text)}>{bands[band].label}</span>
        <span className={cx("font-display text-[52px] font-extrabold leading-[0.85] tabular", band === "isolate" ? "text-white" : "text-ink")}>{a.score}</span>
      </div>

      <div className="min-w-0">
        <p className="text-[19px] font-bold leading-snug text-ink">{a.title}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-mist py-1 pl-1 pr-3 text-[14.5px] font-semibold text-ink">
            <AgentIcon id={agent.id} size={26} />
            {agent.name}
          </span>
          <span className="rounded-full px-3 py-1 text-[14px] font-semibold text-ink-2 ring-1 ring-line">{a.owasp}</span>
        </div>
        <ol className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Cause chain preview">
          {preview.map((step, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight size={14} className="text-ink-3" aria-hidden="true" />}
              <span
                className={cx(
                  "max-w-[220px] truncate rounded-[10px] px-2.5 py-1 text-[14px] font-medium",
                  step.score >= 60 ? "bg-blush text-blush-ink" : step.trust === "untrusted" ? "bg-lilac text-lilac-ink" : step.trust === "trusted" ? "bg-leaf-soft text-leaf-ink" : "bg-mist text-ink-2",
                )}
              >
                {step.action}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-3">
        <span className={cx("rounded-full px-3.5 py-1.5 text-[14.5px] font-bold", status[band].tone)}>{status[band].label}</span>
        <span className="text-[15px] text-ink-2">{a.time}</span>
        <ChevronRight size={20} className="ml-auto text-ink-3 transition-transform group-hover:translate-x-1 md:ml-0" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function AlertList() {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-6 inline-flex flex-wrap gap-1 rounded-full bg-surface p-1.5">
        {filters.map((f) => (
          <TabsTrigger key={f.value} value={f.value} className={trigger}>
            {f.label} <span className="ml-1.5 tabular">{alerts.filter(f.match).length}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {filters.map((f) => (
        <TabsContent key={f.value} value={f.value}>
          <ul className="space-y-4">
            {alerts.filter(f.match).map((a) => (
              <li key={a.id}>
                <AlertCard a={a} />
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
