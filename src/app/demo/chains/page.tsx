import { ArrowRight, Lock } from "lucide-react";
import { ChainExplorer } from "@/components/demo/chain-explorer";
import { ScoreRing } from "@/components/demo/visuals";
import { Card, CardTitle, PageHeader } from "@/components/ui";
import { agentById } from "@/lib/data";

export default function ChainsPage() {
  const procurement = agentById("procurement")!;
  const finance = agentById("finance")!;

  return (
    <>
      <PageHeader
        title="Agent chains"
        intro="When one agent calls another, Tether carries the request's authority, trust tags and risk along the chain. A hijacked agent cannot borrow power from the agents it calls."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { n: "214", t: "Agent-to-agent calls today", tone: "bg-surface" },
          { n: "213", t: "Stayed inside their authority", tone: "bg-leaf-soft" },
          { n: "1", t: "Denied: payroll.export", tone: "bg-blush" },
        ].map((s) => (
          <div key={s.t} className={`rounded-[24px] p-6 ${s.tone}`}>
            <p className="font-display text-[48px] font-extrabold leading-none tabular text-ink">{s.n}</p>
            <p className="mt-2 text-[16px] font-semibold text-ink-2">{s.t}</p>
          </div>
        ))}
      </div>

      <Card className="mb-6 p-7">
        <CardTitle aside={<span className="text-[15px] text-ink-2">Today 09:43</span>}>Procurement Agent asked Finance Agent to export payroll</CardTitle>
        <ChainExplorer />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardTitle>Authority only shrinks</CardTitle>
          <p className="mb-4 text-[16px] leading-relaxed text-ink-2">A called agent may only touch data that both it and its caller may touch.</p>
          <svg viewBox="0 0 600 270" className="h-auto w-full" role="img" aria-label="Procurement's data and Finance's data do not overlap, so nothing is shared">
            <circle cx="215" cy="135" r="122" fill="var(--color-blush)" fillOpacity="0.85" />
            <circle cx="385" cy="135" r="122" fill="var(--color-sky)" fillOpacity="0.85" />
            <text x="150" y="62" textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--color-ink)">Procurement</text>
            {procurement.roleCard.data.map((d, i) => (
              <text key={d} x="150" y={110 + i * 30} textAnchor="middle" fontSize="15.5" fill="var(--color-ink-2)">{d}</text>
            ))}
            <text x="450" y="62" textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--color-ink)">Finance</text>
            {finance.roleCard.data.map((d, i) => (
              <text key={d} x="450" y={110 + i * 30} textAnchor="middle" fontSize="15.5" fill="var(--color-ink-2)">{d}</text>
            ))}
            <rect x="262" y="104" width="76" height="62" rx="16" fill="#fff" />
            <path d="M288 128v-6a12 12 0 0 1 24 0v6" fill="none" stroke="var(--color-risk)" strokeWidth="3" />
            <rect x="282" y="127" width="36" height="26" rx="6" fill="var(--color-risk)" />
            <text x="300" y="200" textAnchor="middle" fontSize="15.5" fontWeight="700" fill="var(--color-blush-ink)">Shared: nothing</text>
          </svg>
          <p className="mt-2 rounded-[16px] bg-blush px-4 py-3 text-[16px] font-semibold text-blush-ink">
            On this call Finance may touch nothing, so payroll stays closed.
          </p>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:col-span-5">
          <Card>
            <CardTitle>Untrusted taint passes down</CardTitle>
            <ol className="flex flex-wrap items-center gap-2">
              {["supplier_invoice.pdf", "Procurement request", "Finance call"].map((t, i) => (
                <li key={t} className="flex items-center gap-2">
                  {i > 0 && <ArrowRight size={16} className="text-ink-3" aria-hidden="true" />}
                  <span className="rounded-[12px] bg-lilac px-3 py-2 text-[15px] font-semibold text-lilac-ink">{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
              Every request Procurement sends after reading the PDF carries the untrusted tag, so Finance treats it as content, not as orders.
            </p>
          </Card>

          <Card>
            <CardTitle>Risk passes down</CardTitle>
            <div className="flex items-center justify-center gap-5 rounded-[20px] bg-mist py-5">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={92} size={76} stroke={7} />
                <span className="text-[14.5px] font-semibold text-ink-2">Procurement</span>
              </div>
              <span className="font-display text-[34px] font-extrabold text-ink">× ½</span>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={46} size={76} stroke={7} />
                <span className="text-[14.5px] font-semibold text-ink-2">Finance</span>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[16px] leading-relaxed text-ink-2">
              <Lock size={18} className="mt-1 shrink-0 text-ink-3" aria-hidden="true" />
              Finance goes on Watch while serving the call, without stopping its own invoice work.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
