import { CopyCode } from "@/components/copy-code";
import { Card, CardTitle, PageHeader, cx } from "@/components/ui";
import { mcpConfig } from "@/lib/data";

const connected = [
  {
    name: "GitHub",
    where: "northwind/agent-roles",
    does: "Role Cards live here as YAML. Tether opens fix pull requests and the proof loop runs as a GitHub Action that posts the scorecard.",
  },
  {
    name: "Slack",
    where: "#agent-security",
    does: "Alerts arrive with the Drift Score, the reason in plain English and Approve, Block and Isolate buttons.",
  },
];

const next = [
  { name: "OpenTelemetry", status: "Available", does: "Watch agents that don't use MCP by reading their traces. Watch-only, no containment." },
  { name: "Keycloak token exchange", status: "Available", does: "Issue a real, narrower OAuth token (RFC 8693) instead of only blocking at the gateway." },
  { name: "Microsoft Entra Agent ID", status: "Planned", does: "Share each agent's Drift Score with your identity platform." },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        intro="Tether sits where agents already reach their tools, and reports where your team already works. No agent code changes."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardTitle aside={<span className="rounded-full bg-leaf-soft px-3 py-1 text-[14px] font-semibold text-leaf-ink">7 agents connected</span>}>
            MCP gateway
          </CardTitle>
          <p className="mb-5 text-[16px] leading-relaxed text-ink-2">
            Point an agent&rsquo;s MCP config at Tether instead of at its tool servers. Tether holds the real tool keys, checks every call and forwards the allowed ones. Works with any MCP client, including Claude Desktop, Cursor, LangGraph and the OpenAI Agents SDK.
          </p>
          <CopyCode code={mcpConfig} label="MCP configuration for an agent" />
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:col-span-5">
          {connected.map((c) => (
            <Card key={c.name}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[17px] font-bold text-ink">{c.name}</h2>
                  <p className="text-[15px] text-ink-3">{c.where}</p>
                </div>
                <span className="rounded-full bg-leaf-soft px-3 py-1 text-[14px] font-semibold text-leaf-ink">Connected</span>
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{c.does}</p>
            </Card>
          ))}
        </div>

        <Card className="xl:col-span-12">
          <CardTitle>More integrations</CardTitle>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {next.map((n) => (
              <li key={n.name} className="rounded-[20px] bg-mist p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{n.name}</p>
                  <span className={cx("shrink-0 rounded-full px-2.5 py-0.5 text-[13.5px] font-semibold", n.status === "Available" ? "bg-sky text-sky-ink" : "bg-white text-ink-3 ring-1 ring-line")}>
                    {n.status}
                  </span>
                </div>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{n.does}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
