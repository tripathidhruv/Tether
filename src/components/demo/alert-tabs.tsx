"use client";

import Link from "next/link";
import { Root as Tabs, TabsContent, TabsList, TabsTrigger } from "@animate-ui/react/primitives/radix-ui/tabs";
import { DecisionPanel } from "@/components/demo/decision-panel";
import { BandBadge, cx } from "@/components/ui";
import { bandFor, bands, type Alert, type Band } from "@/lib/data";

const trigger =
  "rounded-full px-4 py-2 text-[15.5px] font-semibold text-ink-2 transition-colors data-[state=active]:bg-ink data-[state=active]:text-white";
const ladder: Band[] = ["allow", "watch", "ask", "cut", "isolate"];

export function AlertTabs({ alert, agentName, defaultTab }: { alert: Alert; agentName: string; defaultTab: string }) {
  const current = bandFor(alert.score);
  const tab = defaultTab === "replay" && !alert.replay ? "story" : defaultTab;

  return (
    <Tabs defaultValue={tab}>
      <TabsList className="mb-6 inline-flex flex-wrap gap-1 rounded-full bg-surface p-1.5">
        <TabsTrigger value="story" className={trigger}>What happened</TabsTrigger>
        {alert.replay && <TabsTrigger value="replay" className={trigger}>Replay evidence</TabsTrigger>}
        <TabsTrigger value="containment" className={trigger}>Containment</TabsTrigger>
      </TabsList>

      <TabsContent value="story">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="rounded-[26px] bg-surface p-6 xl:col-span-7">
            <h2 className="mb-5 text-[17px] font-bold text-ink">Cause chain</h2>
            <ol className="relative space-y-5 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-line">
              {alert.chain.map((step, i) => {
                const b = bandFor(step.score);
                return (
                  <li key={i} className="relative flex gap-4 pl-0">
                    <span className={cx("relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full ring-4 ring-surface", bands[b].tone)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] tabular text-ink-3">{step.time}</span>
                        {step.trust === "trusted" && <span className="rounded-full bg-leaf-soft px-2 py-0.5 text-[13px] font-semibold text-leaf-ink">Trusted input</span>}
                        {step.trust === "untrusted" && <span className="rounded-full bg-lilac px-2 py-0.5 text-[13px] font-semibold text-lilac-ink">Untrusted input</span>}
                      </div>
                      <p className="mt-1 font-semibold text-ink">{step.action}</p>
                      <p className="text-[15px] text-ink-3">{step.note}</p>
                    </div>
                    {step.score > 0 && (
                      <span className="self-start pt-1">
                        <BandBadge score={step.score} size="sm" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-[26px] bg-surface p-6 xl:col-span-5">
            <h2 className="mb-5 text-[17px] font-bold text-ink">Why the score is {alert.score}</h2>
            <ul className="space-y-4">
              {alert.breakdown.map((b) => (
                <li key={b.reason} className="flex gap-4">
                  <span className="w-14 shrink-0 font-display text-[24px] font-extrabold leading-tight tabular text-ink">{b.points}</span>
                  <span className="text-[15.5px] leading-snug text-ink-2">{b.reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between rounded-[18px] bg-mist p-4">
              <span className="text-[15.5px] text-ink-2">OWASP Agentic Top 10</span>
              <span className="text-[15.5px] font-semibold text-ink">{alert.owasp}</span>
            </div>
          </section>
        </div>
      </TabsContent>

      {alert.replay && (
        <TabsContent value="replay">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section className="rounded-[26px] bg-surface p-6 xl:col-span-12">
              <h2 className="text-[17px] font-bold text-ink">Tether re-ran the decision with the user&rsquo;s task hidden</h2>
              <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink-2">
                If the agent still takes the action without being asked, the order did not come from the user. It came from something the agent read.
              </p>
              <figure className="mt-5 rounded-[20px] bg-butter p-5">
                <blockquote className="text-[17.5px] font-semibold leading-snug text-ink">&ldquo;{alert.replay.hiddenLine}&rdquo;</blockquote>
                <figcaption className="mt-2 text-[14.5px] text-butter-ink">Found in {alert.replay.source}</figcaption>
              </figure>
            </section>

            {[
              { title: "With the user's task", sub: alert.replay.task, list: alert.replay.original },
              { title: "With the task hidden", sub: "Task replaced by an empty request", list: alert.replay.masked },
            ].map((run) => (
              <section key={run.title} className="rounded-[26px] bg-surface p-6 xl:col-span-6">
                <h3 className="font-bold text-ink">{run.title}</h3>
                <p className="mt-1 text-[15px] text-ink-3">{run.sub}</p>
                <ol className="mt-5 space-y-2">
                  {run.list.map((action) => {
                    const both = alert.replay!.original.includes(action) && alert.replay!.masked.includes(action);
                    return (
                      <li key={action} className={cx("rounded-[14px] px-4 py-3 text-[15.5px] font-semibold", both ? "bg-blush text-blush-ink" : "bg-mist text-ink-2")}>
                        {action}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}

            <p className="rounded-[22px] bg-forest p-5 text-[16.5px] leading-relaxed text-white xl:col-span-12">
              Both runs reach for <span className="font-semibold text-leaf">hr/salaries.csv</span> and{" "}
              <span className="font-semibold text-leaf">paste-site.xyz</span>, so the order came from the PDF. Replay confirmed: +35.
            </p>
          </div>
        </TabsContent>
      )}

      <TabsContent value="containment">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="rounded-[26px] bg-surface p-6 xl:col-span-7">
            <h2 className="mb-5 text-[17px] font-bold text-ink">Containment ladder</h2>
            <ol className="space-y-2">
              {ladder.map((b) => (
                <li
                  key={b}
                  aria-current={b === current ? "step" : undefined}
                  className={cx(
                    "flex items-center gap-4 rounded-[16px] px-4 py-3",
                    b === current ? cx(bands[b].tone, "ring-2 ring-ink") : "bg-mist",
                  )}
                >
                  <span className={cx("w-16 font-semibold", b === current ? bands[b].text : "text-ink")}>{bands[b].label}</span>
                  <span className={cx("w-14 text-[14.5px] tabular", b === current ? bands[b].text : "text-ink-3")}>{bands[b].range}</span>
                  <span className={cx("text-[15.5px]", b === current ? bands[b].text : "text-ink-2")}>{bands[b].does}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col rounded-[26px] bg-surface p-6 xl:col-span-5">
            <h2 className="text-[17px] font-bold text-ink">What Tether did</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{alert.taken}</p>
            <h3 className="mt-5 text-[15.5px] font-bold text-ink">What keeps working</h3>
            <p className="mt-1 text-[16px] leading-relaxed text-ink-2">{alert.keeps}</p>
            <div className="mt-auto pt-6">
              <p className="mb-3 text-[14.5px] text-ink-3">Your decision, also available in Slack</p>
              <DecisionPanel agentName={agentName} />
              <Link href="/demo/run" className="mt-4 inline-block text-[16px] font-semibold text-leaf-ink underline-offset-4 hover:underline">
                Find and test a permanent fix in a live run
              </Link>
            </div>
          </section>
        </div>
      </TabsContent>
    </Tabs>
  );
}
