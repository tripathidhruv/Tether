import Link from "next/link";
import { Clock3 } from "lucide-react";
import { AnimatedNumber } from "@/components/animated-number";
import { LadderBar } from "@/components/charts";
import { AgentLeaderboard } from "@/components/demo/agent-leaderboard";
import { BandBadge, ButtonLink, Card, CardTitle, PageHeader, cx } from "@/components/ui";
import { agents, alertById, containmentToday, feed, kpis, pullRequests, scorecard, workspace } from "@/lib/data";

export default function Overview() {
  const incident = alertById("ALR-1042")!;
  const waiting = alertById("ALR-1036")!;
  const pr = pullRequests[0];
  const sorted = [...agents].sort((a, b) => b.score - a.score);

  return (
    <>
      <PageHeader
        title="Overview"
        intro={`${workspace.name}, ${workspace.date}. Tether checked ${kpis.actionsToday.toLocaleString("en-US")} agent actions today and contained ${kpis.contained}. Nothing left the company.`}
        aside={<ButtonLink href="/demo/run">Start a live run</ButtonLink>}
      />

      <Link
        href={`/demo/alerts/${waiting.id}`}
        className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[22px] bg-butter px-5 py-4 text-butter-ink transition-colors hover:bg-[#efdc9d]"
      >
        <Clock3 size={18} aria-hidden="true" />
        <span className="font-semibold">Support Agent is waiting for a decision</span>
        <span className="text-[15.5px]">{waiting.title}</span>
        <span className="ml-auto text-[15.5px] font-semibold underline underline-offset-4">Review</span>
      </Link>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="relative overflow-hidden rounded-[30px] bg-forest p-7 text-white xl:col-span-7 lg:p-9">
          <p className="text-[15.5px] font-semibold text-leaf">Latest incident, {incident.time.toLowerCase()}</p>
          <h2 className="mt-2 max-w-md text-[22px] font-bold leading-snug">
            Procurement Agent {incident.title.charAt(0).toLowerCase() + incident.title.slice(1)}
          </h2>

          <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="flex items-end gap-3">
              <AnimatedNumber value={incident.score} className="font-display text-[132px] font-extrabold leading-[0.8] tracking-[-0.03em] text-white" />
              <div className="pb-2">
                <p className="text-[14.5px] text-[#D3DDD6]">Drift Score</p>
                <span className="mt-1 inline-block rounded-full bg-blush px-3 py-1 text-[14.5px] font-semibold text-blush-ink">Cut</span>
              </div>
            </div>
            <ul className="min-w-[240px] flex-1 space-y-2 pb-1 text-[15.5px] text-[#DCE5DE]">
              {incident.breakdown.map((b) => (
                <li key={b.points} className="flex gap-3">
                  <span className="w-9 shrink-0 font-semibold tabular text-leaf">{b.points}</span>
                  <span>{b.reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/demo/alerts/${incident.id}`} variant="leaf">Open the incident</ButtonLink>
            <ButtonLink href={`/demo/alerts/${incident.id}?tab=replay`} variant="ghostOnDark">See the replay</ButtonLink>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 xl:col-span-5">
          {[
            { label: "Agents monitored", value: kpis.agents, tone: "bg-surface" },
            { label: "Actions checked today", value: kpis.actionsToday, tone: "bg-surface" },
            { label: "Actions contained today", value: kpis.contained, tone: "bg-blush" },
          ].map((k) => (
            <div key={k.label} className={cx("flex flex-col justify-between rounded-[26px] p-6", k.tone)}>
              <p className="text-[15.5px] text-ink-2">{k.label}</p>
              <AnimatedNumber value={k.value} className="mt-6 font-display text-[44px] font-extrabold leading-none text-ink" />
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-[26px] bg-leaf-soft p-6">
            <p className="text-[15.5px] text-leaf-ink">Data out before containment</p>
            <p className="mt-6 font-display text-[44px] font-extrabold leading-none text-ink">{kpis.dataOut}</p>
          </div>
        </div>

        <Card className="xl:col-span-7">
          <CardTitle aside={<Link href="/demo/agents" className="text-[15.5px] font-semibold text-leaf-ink hover:underline">All agents</Link>}>
            Agents by Drift Score
          </CardTitle>
          <AgentLeaderboard agents={sorted} />
        </Card>

        <Card className="xl:col-span-5">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">Last 30 seconds</span>}>Live actions</CardTitle>
          <ol className="space-y-1">
            {feed.map((f) => (
              <li key={f.time + f.action} className="flex items-start gap-3 rounded-2xl px-1 py-2">
                <span className="w-[62px] shrink-0 pt-0.5 text-[14px] tabular text-ink-3">{f.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15.5px] font-semibold text-ink">{f.action}</p>
                  <p className="text-[14px] text-ink-3">{f.agent}</p>
                </div>
                <BandBadge score={f.score} size="sm" />
              </li>
            ))}
          </ol>
        </Card>

        <Card className="xl:col-span-7">
          <CardTitle>Containment today</CardTitle>
          <LadderBar items={containmentToday} />
        </Card>

        <Card className="xl:col-span-5">
          <CardTitle aside={<span className="rounded-full bg-leaf-soft px-3 py-1 text-[14px] font-semibold text-leaf-ink">{pr.status}</span>}>
            Proof loop
          </CardTitle>
          <p className="font-semibold text-ink">#{pr.id} {pr.title}</p>
          <p className="mt-1 text-[15px] text-ink-3">Opened by {pr.author}, {pr.opened.toLowerCase()}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {scorecard.slice(0, 3).concat(scorecard[4]).map((s) => (
              <div key={s.check} className="rounded-2xl bg-mist p-3.5">
                <dt className="text-[14px] text-ink-3">{s.check}</dt>
                <dd className="mt-1 font-display text-[22px] font-extrabold text-ink">{s.after}</dd>
              </div>
            ))}
          </dl>
          <Link href="/demo/proof-loop" className="mt-5 inline-block text-[15.5px] font-semibold text-leaf-ink hover:underline">
            Open the proof loop
          </Link>
        </Card>
      </div>
    </>
  );
}
