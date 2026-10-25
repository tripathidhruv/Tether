import Link from "next/link";
import { Card, CardTitle, PageHeader, cx } from "@/components/ui";
import { agents, roleChanges } from "@/lib/data";

export default function RolesPage() {
  return (
    <>
      <PageHeader
        title="Role Cards"
        intro="Each agent's job lives as a short YAML file in GitHub. A change that comes through an approved pull request is growth. A change in behavior with no pull request behind it is drift."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">Last 7 days</span>}>Growth or drift</CardTitle>
          <ul className="space-y-3">
            {roleChanges.map((c) => (
              <li key={c.when + c.agent} className={cx("flex flex-wrap items-start gap-x-4 gap-y-1 rounded-[18px] p-4", c.kind === "growth" ? "bg-leaf-soft" : "bg-blush")}>
                <span className={cx("w-[70px] shrink-0 text-[14.5px] font-semibold", c.kind === "growth" ? "text-leaf-ink" : "text-blush-ink")}>
                  {c.kind === "growth" ? "Growth" : "Drift"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">
                    {c.agent}: {c.what.charAt(0).toLowerCase() + c.what.slice(1)}
                  </p>
                  <p className="text-[15px] text-ink-2">
                    {c.ref}, {c.when.toLowerCase()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-5">
          <CardTitle>How a role changes</CardTitle>
          <ol className="space-y-4 text-[16px] leading-relaxed text-ink-2">
            {[
              "Tether drafts a Role Card from the plain-English job description.",
              "The agent's owner reviews it as a pull request in northwind/agent-roles.",
              "The proof loop attacks the new role and replays normal work before merge.",
              "On merge, Tether resets the agent's frozen anchor to the new normal.",
            ].map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[14.5px] font-semibold text-white">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="xl:col-span-12">
          <CardTitle>All Role Cards</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[15.5px]">
              <thead>
                <tr className="text-[14.5px] text-ink-3">
                  <th className="pb-3 font-medium">Agent</th>
                  <th className="pb-3 font-medium">Version</th>
                  <th className="pb-3 font-medium">Tools</th>
                  <th className="pb-3 font-medium">Destinations</th>
                  <th className="pb-3 font-medium">Last change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3.5 pr-4">
                      <Link href={`/demo/agents/${a.id}`} className="font-semibold text-ink hover:underline">
                        {a.name}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 tabular text-ink-2">{a.roleCard.version}</td>
                    <td className="py-3.5 pr-4 tabular text-ink-2">{a.roleCard.tools.length}</td>
                    <td className="py-3.5 pr-4 text-ink-2">{a.roleCard.destinations.length}</td>
                    <td className="py-3.5 text-ink-2">{a.roleCard.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
