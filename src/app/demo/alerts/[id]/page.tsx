import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTabs } from "@/components/demo/alert-tabs";
import { BandBadge } from "@/components/ui";
import { agentById, alertById, alerts, bandFor } from "@/lib/data";

export function generateStaticParams() {
  return alerts.map((a) => ({ id: a.id }));
}

export default async function AlertPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab } = await searchParams;
  const alert = alertById(id);
  if (!alert) notFound();
  const agent = agentById(alert.agentId)!;

  return (
    <>
      <Link href="/demo/alerts" className="mb-4 inline-block text-[15.5px] font-semibold text-leaf-ink hover:underline">
        All alerts
      </Link>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-[15.5px] text-ink-3">
            {alert.id}, {alert.time.toLowerCase()},{" "}
            <Link href={`/demo/agents/${agent.id}`} className="font-semibold text-ink-2 hover:underline">
              {agent.name}
            </Link>
          </p>
          <h1 className="mt-2 text-balance [overflow-wrap:anywhere] font-display text-[34px] sm:text-[44px] font-extrabold leading-[0.95] text-ink">{alert.title}</h1>
        </div>
        <div className="flex items-center gap-4 rounded-[22px] bg-surface px-5 py-4">
          <p className="font-display text-[56px] font-extrabold leading-none tabular text-ink">{alert.score}</p>
          <div>
            <p className="text-[14.5px] text-ink-3">Drift Score</p>
            <BandBadge band={bandFor(alert.score)} />
          </div>
        </div>
      </header>
      <AlertTabs alert={alert} agentName={agent.name} defaultTab={tab === "replay" ? "replay" : tab === "containment" ? "containment" : "story"} />
    </>
  );
}
