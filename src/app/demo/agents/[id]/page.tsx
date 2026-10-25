import Link from "next/link";
import { notFound } from "next/navigation";
import { DriftChart } from "@/components/charts";
import { BandBadge, Card, CardTitle, Code, PageHeader, cx } from "@/components/ui";
import { agentById, agents, alerts, bandFor, roleCardYaml } from "@/lib/data";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

const days = ["Oct 11", "", "Oct 13", "", "Oct 15", "", "Oct 17", "", "Oct 19", "", "Oct 21", "", "Oct 23", "Today"];

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = agentById(id);
  if (!agent) notFound();

  const anchor = Math.round(agent.trend.slice(0, 7).reduce((s, v) => s + v, 0) / 7);
  const maxUse = Math.max(...agent.granted.map((g) => g.used));
  const agentAlerts = alerts.filter((a) => a.agentId === agent.id);

  return (
    <>
      <Link href="/demo/agents" className="mb-4 inline-block text-[15.5px] font-semibold text-leaf-ink hover:underline">
        All agents
      </Link>
      <PageHeader
        title={agent.name}
        intro={`${agent.role}. Owned by ${agent.owner}, running for ${agent.age}.`}
        aside={
          <div className="flex items-center gap-4 rounded-[22px] bg-surface px-5 py-4">
            <div>
              <p className="text-[14.5px] text-ink-3">Drift Score</p>
              <p className="font-display text-[44px] font-extrabold leading-none tabular text-ink">{agent.score}</p>
            </div>
            <div className="max-w-[200px]">
              <BandBadge band={bandFor(agent.score)} />
              <p className="mt-2 text-[14.5px] leading-snug text-ink-2">{agent.status}</p>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">Last 14 days</span>}>Drift over time</CardTitle>
          <DriftChart values={agent.trend} labels={days} anchor={anchor} />
          <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
            The frozen anchor is this agent&rsquo;s approved normal. Tether measures distance from it as well as from the rolling baseline, so a slow climb still crosses the alarm line.
          </p>
        </Card>

        <Card className="xl:col-span-4">
          <CardTitle aside={<Link href="/demo/roles" className="text-[14.5px] font-semibold text-leaf-ink hover:underline">{agent.roleCard.version}</Link>}>
            Role Card
          </CardTitle>
          <Code>{roleCardYaml(agent)}</Code>
          <p className="mt-3 text-[14.5px] text-ink-3">Last changed by {agent.roleCard.changedBy}</p>
        </Card>

        <Card className="xl:col-span-7">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">Uses in the last 30 days</span>}>Permissions granted vs used</CardTitle>
          <ul className="space-y-4">
            {agent.granted.map((g) => (
              <li key={g.permission}>
                <div className="flex items-baseline justify-between gap-4 text-[15.5px]">
                  <span className="font-semibold text-ink">{g.permission}</span>
                  {g.used === 0 ? (
                    <span className="rounded-full bg-butter px-2.5 py-0.5 text-[13.5px] font-semibold text-butter-ink">Never used, suggest removing</span>
                  ) : (
                    <span className="tabular text-ink-3">{g.used.toLocaleString("en-US")}</span>
                  )}
                </div>
                <div className="mt-2 h-2 rounded-full bg-mist">
                  <div className={cx("h-2 rounded-full", g.used === 0 ? "bg-butter" : "bg-ink")} style={{ width: `${Math.max(2, (g.used / maxUse) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-5">
          <CardTitle>Learned habits</CardTitle>
          <ul className="space-y-4">
            {agent.habits.map((h) => (
              <li key={h.sequence} className="flex items-center gap-4">
                <span className="w-12 shrink-0 font-display text-[26px] font-extrabold tabular text-ink">{h.share}%</span>
                <span className="text-[15.5px] leading-snug text-ink-2">{h.sequence}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-[18px] bg-mist p-4">
            <p className="text-[14.5px] text-ink-3">Baseline</p>
            <p className="mt-0.5 text-[15.5px] font-semibold text-ink">{agent.baseline}</p>
          </div>
        </Card>

        <Card className="xl:col-span-12">
          <CardTitle>Alerts for this agent</CardTitle>
          {agentAlerts.length === 0 ? (
            <p className="text-[15.5px] text-ink-3">No alerts. This agent has stayed inside its role.</p>
          ) : (
            <ul className="divide-y divide-line">
              {agentAlerts.map((al) => (
                <li key={al.id}>
                  <Link href={`/demo/alerts/${al.id}`} className="-mx-3 flex flex-wrap items-center gap-4 rounded-2xl px-3 py-3.5 hover:bg-mist">
                    <BandBadge score={al.score} size="sm" />
                    <span className="font-semibold text-ink">{al.title}</span>
                    <span className="ml-auto text-[14.5px] text-ink-3">{al.time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
