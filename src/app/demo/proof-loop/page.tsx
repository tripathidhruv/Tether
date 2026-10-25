import { GitPullRequest } from "lucide-react";
import { RunSuite } from "@/components/demo/run-suite";
import { Card, CardTitle, PageHeader, cx } from "@/components/ui";
import { pullRequests, scorecard } from "@/lib/data";

const statusTone = {
  "Ready to merge": "bg-leaf-soft text-leaf-ink",
  Blocked: "bg-blush text-blush-ink",
  Merged: "bg-lilac text-lilac-ink",
};

export default function ProofLoopPage() {
  const pr = pullRequests[0];

  return (
    <>
      <PageHeader
        title="Proof loop"
        intro="Attack, fix, re-attack. Every change to an agent's role or permissions runs the full attack suite and replays recorded normal work. It merges only if every attack fails and no normal action is blocked."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <GitPullRequest className="mt-1 shrink-0 text-leaf-ink" size={22} aria-hidden="true" />
              <div>
                <h2 className="text-[19px] font-bold leading-snug text-ink">
                  #{pr.id} {pr.title}
                </h2>
                <p className="mt-1 text-[15px] text-ink-3">
                  Opened by {pr.author}, {pr.opened.toLowerCase()}, in northwind/agent-roles
                </p>
              </div>
            </div>
            <span className={cx("rounded-full px-3 py-1 text-[14.5px] font-semibold", statusTone[pr.status])}>{pr.status}</span>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{pr.why}</p>
          <pre className="mt-5 overflow-x-auto rounded-[18px] bg-mist p-5 font-mono text-[14.5px] leading-[1.8]">
            <code>
              <span className="text-ink-3">agents/procurement/permissions.yaml{"\n"}</span>
              {pr.diff.map((d) => (
                <span key={d.line} className={cx("block", d.sign === "-" ? "text-blush-ink" : "text-leaf-ink")}>
                  {d.sign} {d.line}
                </span>
              ))}
            </code>
          </pre>
        </Card>

        <Card className="xl:col-span-5">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">Posted on the pull request</span>}>Scorecard</CardTitle>
          <table className="w-full text-[15.5px]">
            <thead>
              <tr className="text-left text-[14.5px] text-ink-3">
                <th className="pb-3 font-medium">Check</th>
                <th className="pb-3 text-right font-medium">Before</th>
                <th className="pb-3 text-right font-medium">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {scorecard.map((s) => (
                <tr key={s.check}>
                  <td className="py-3 pr-3 text-ink-2">{s.check}</td>
                  <td className="py-3 text-right tabular text-ink-3">{s.before}</td>
                  <td className="py-3 text-right font-semibold tabular text-ink">{s.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-5 rounded-[16px] bg-leaf-soft p-4 text-[15.5px] font-semibold text-leaf-ink">All checks pass. Safe to merge.</p>
        </Card>

        <Card className="xl:col-span-12">
          <CardTitle>Attack suite</CardTitle>
          <RunSuite />
          <p className="mt-5 text-[14.5px] leading-relaxed text-ink-3">
            Attacks run live against the real model, three times each, and count as caught only if caught every time. Normal work is replayed from recorded sessions without the model, so that check gives the same answer on every run.
          </p>
        </Card>

        <Card className="xl:col-span-12">
          <CardTitle>Recent pull requests</CardTitle>
          <ul className="divide-y divide-line">
            {pullRequests.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-4">
                <span className="w-12 font-semibold tabular text-ink-3">#{p.id}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="text-[15px] text-ink-3">{p.why}</p>
                </div>
                <span className="text-[14.5px] text-ink-3">{p.opened}</span>
                <span className={cx("rounded-full px-3 py-1 text-[14px] font-semibold", statusTone[p.status])}>{p.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
