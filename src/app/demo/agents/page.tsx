import Link from "next/link";
import { Sparkline } from "@/components/charts";
import { BandBadge, PageHeader, cx } from "@/components/ui";
import { agents, bandFor, bands } from "@/lib/data";

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        title="Agents"
        intro="Every agent has a Role Card, a learned habit profile and a Drift Score. Scores reset to the agent's normal as soon as the cause is contained."
      />
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {agents.map((a) => {
          const band = bandFor(a.score);
          return (
            <li key={a.id}>
              <Link href={`/demo/agents/${a.id}`} className="group flex h-full flex-col rounded-[26px] bg-surface p-6 transition-colors duration-150 hover:bg-[#FBFCFA]">
                <div>
                  <p className="text-[18px] font-bold text-ink">{a.name}</p>
                  <p className="mt-1 text-[15.5px] leading-snug text-ink-3">{a.role}</p>
                </div>

                <div className={cx("mt-6 flex items-end justify-between rounded-[20px] p-5", bands[band].tone)}>
                  <div>
                    <p className={cx("text-[14.5px]", band === "isolate" ? "text-white" : "text-ink-2")}>Drift Score</p>
                    <p className={cx("font-display text-[56px] font-extrabold leading-[0.9] tabular", band === "isolate" ? "text-white" : "text-ink")}>{a.score}</p>
                  </div>
                  <Sparkline values={a.trend} stroke={band === "isolate" ? "#fff" : "var(--color-ink)"} />
                </div>

                <p className="mt-4 text-[15.5px] font-semibold text-ink-2">{a.status}</p>

                <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-4 text-[14.5px]">
                  <div>
                    <dt className="text-ink-3">Owner</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{a.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Actions today</dt>
                    <dd className="mt-0.5 font-semibold tabular text-ink">{a.actionsToday.toLocaleString("en-US")}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Level</dt>
                    <dd className="mt-0.5">
                      <BandBadge band={band} size="sm" />
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
