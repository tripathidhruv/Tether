import Link from "next/link";
import { CopyCode } from "@/components/copy-code";
import { HeroReplay } from "@/components/landing/hero-replay";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { ButtonLink, Logo, cx } from "@/components/ui";
import { bands, mcpConfig, scorecard, type Band } from "@/lib/data";

const facts = [
  { value: "49.8%", text: "of 380+ organisations saw an AI agent take an action nobody intended in the past year.", source: "Salt Security, Oct 2026", href: "https://salt.security/blog/agents-are-acting-most-organizations-cannot-stop-them" },
  { value: "17.5%", text: "can stop a misbehaving agent automatically. The rest find out later.", source: "Salt Security, Oct 2026", href: "https://salt.security/blog/agents-are-acting-most-organizations-cannot-stop-them" },
  { value: "65%", text: "had at least one security incident caused by AI agents in the past year.", source: "CSA and Token Security, Apr 2026", href: "https://www.kiteworks.com/cybersecurity-risk-management/ai-agent-security-incidents-2026/" },
];

const questions = [
  { name: "Role", ask: "Is this in the job?", body: "Every action is checked against the agent's Role Card: the tools, data and destinations its job needs. It works from the very first action, with no history.", tone: "bg-leaf-soft" },
  { name: "Cause", ask: "Who asked for it?", body: "Everything the agent reads is tagged trusted or untrusted. For a risky action, Tether re-runs the decision with the user's task hidden. If the agent still acts, the order came from the content.", tone: "bg-lilac" },
  { name: "Habit", ask: "Is this normal for it?", body: "Tether learns each agent's tool sequences, data, destinations and volume. A brand-new agent borrows the habits of agents with the same role.", tone: "bg-sky" },
];

const ladder: Band[] = ["allow", "watch", "ask", "cut", "isolate"];

const challenges = [
  { name: "Valid credentials hide the attack", answer: "Tether judges what an agent does and why, never whether its token is valid. Only Tether holds the real tool keys." },
  { name: "Indirect prompt injection", answer: "Trust tags on every input, and a replay that shows whether the user or the content gave the order." },
  { name: "Legitimate change vs. drift", answer: "A change through an approved pull request is growth. A change with no pull request behind it is drift." },
  { name: "Little or no history", answer: "Role Cards, the trifecta rule and tripwires work from the first action. New agents borrow role-peer habits." },
  { name: "Chains of agents", answer: "Authority only shrinks down a chain, and untrusted taint and risk pass along it." },
  { name: "Evasion", answer: "A frozen anchor with CUSUM catches slow drift. Tripwires catch attackers who copy normal behavior." },
];

function SectionHead({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-balance font-display text-[44px] font-extrabold leading-[0.95] text-ink sm:text-[56px]">{title}</h2>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{intro}</p>
    </div>
  );
}

export default function Home() {
  return (
    <SmoothScroll>
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="sticky top-4 z-40 mt-4 flex items-center justify-between gap-4 rounded-full bg-surface/90 py-2.5 pl-5 pr-2.5 backdrop-blur">
          <Logo />
          <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
            {[
              ["#how", "How it works"],
              ["#containment", "Containment"],
              ["#proof", "Proof loop"],
              ["#integrations", "Integrations"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2 text-[16px] font-semibold text-ink-2 transition-colors hover:bg-mist hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          <ButtonLink href="/demo" className="py-2.5!">Open the live demo</ButtonLink>
        </header>

        <main>
          <section className="grid grid-cols-1 items-center gap-12 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
            <div>
              <h1 className="font-display text-[60px] font-extrabold leading-[0.88] text-ink sm:text-[84px]">
                Its token is valid.
                <br />
                Its behavior isn&rsquo;t.
              </h1>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-ink-2">
                Tether sits between AI agents and their tools. It checks every action against the agent&rsquo;s role, proves what caused a change in behavior, cuts only the risky action, and proves every fix by attacking again.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/demo">Open the live demo</ButtonLink>
                <a href="#how" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-[16.5px] font-semibold text-ink ring-1 ring-line hover:bg-mist">
                  See how it works
                </a>
              </div>
            </div>
            <HeroReplay />
          </section>

          <section aria-label="Why now" className="grid grid-cols-1 gap-4 pb-28 md:grid-cols-3">
            {facts.map((f) => (
              <div key={f.value} className="rounded-[26px] bg-surface p-7">
                <p className="font-display text-[52px] font-extrabold leading-none tabular text-ink">{f.value}</p>
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink-2">{f.text}</p>
                <a href={f.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[14.5px] text-ink-3 underline-offset-4 hover:underline">
                  {f.source}
                </a>
              </div>
            ))}
          </section>

          <section id="how" className="scroll-mt-28 pb-28">
            <SectionHead
              title="Three questions for every action"
              intro="Credentials answer none of them. Tether asks all three before a tool call reaches the tool, then turns the answers into one Drift Score with a reason for every point."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {questions.map((q) => (
                <div key={q.name} className={cx("rounded-[28px] p-7", q.tone)}>
                  <p className="font-display text-[40px] font-extrabold leading-none text-ink">{q.name}</p>
                  <p className="mt-2 text-[17.5px] font-semibold text-ink">{q.ask}</p>
                  <p className="mt-4 text-[16.5px] leading-relaxed text-ink-2">{q.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-[28px] bg-surface p-7">
                <p className="text-[18px] font-bold text-ink">Trifecta rule</p>
                <p className="mt-2 text-[16.5px] leading-relaxed text-ink-2">
                  An agent that has read untrusted content and touched sensitive data in the same session cannot send anything outside without approval.
                </p>
              </div>
              <div className="rounded-[28px] bg-surface p-7">
                <p className="text-[18px] font-bold text-ink">Tripwires</p>
                <p className="mt-2 text-[16.5px] leading-relaxed text-ink-2">
                  Fake files, keys and links that no real task needs. Touching one is proof of compromise, even for an attacker who copies normal behavior perfectly.
                </p>
              </div>
            </div>
          </section>

          <section id="containment" className="scroll-mt-28 pb-28">
            <SectionHead
              title="Cut the action, not the agent"
              intro="Tether never kills an agent on suspicion. It removes only the risky capability, so the agent's real job keeps running."
            />
            <ol className="grid grid-cols-1 gap-3 md:grid-cols-5">
              {ladder.map((b) => (
                <li key={b} className={cx("flex min-h-[200px] flex-col rounded-[24px] p-6", bands[b].tone)}>
                  <p className={cx("text-[14.5px] font-semibold tabular", b === "isolate" ? "text-white" : "text-ink-2")}>{bands[b].range}</p>
                  <p className={cx("mt-1 font-display text-[34px] font-extrabold leading-none", b === "isolate" ? "text-white" : "text-ink")}>{bands[b].label}</p>
                  <p className={cx("mt-auto pt-6 text-[16px] leading-snug", b === "isolate" ? "text-white" : "text-ink-2")}>{bands[b].does}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="proof" className="scroll-mt-28 pb-28">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionHead
                  title="Every fix is proven before it ships"
                  intro="Most tools stop at the alert. Tether turns each alert into a tested fix, inside GitHub, like a test suite for agent behavior."
                />
                <ol className="space-y-5">
                  {[
                    ["Attack", "Seven attacks from real incidents run against a sandbox copy of your agents."],
                    ["Fix", "Tether opens the smallest fix as a pull request on the agent's Role Card or permissions."],
                    ["Re-attack", "A GitHub Action re-runs every attack and replays recorded normal work."],
                    ["Merge", "Only if every attack fails and no normal action is blocked."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[15.5px] font-semibold text-white">{i + 1}</span>
                      <p className="pt-1 text-[17.5px] leading-relaxed text-ink-2">
                        <span className="font-semibold text-ink">{t}.</span> {d}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[32px] bg-surface p-7 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Logo className="[&>span]:hidden" />
                    <div>
                      <p className="font-semibold text-ink">tether-bot</p>
                      <p className="text-[14.5px] text-ink-3">commented on #128</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-leaf-soft px-3 py-1 text-[14.5px] font-semibold text-leaf-ink">All checks pass</span>
                </div>
                <table className="mt-6 w-full text-[16.5px]">
                  <thead>
                    <tr className="text-left text-[14.5px] text-ink-3">
                      <th className="pb-3 font-medium">Check</th>
                      <th className="pb-3 text-right font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {scorecard.map((s) => (
                      <tr key={s.check}>
                        <td className="py-3.5 text-ink-2">{s.check}</td>
                        <td className="py-3.5 text-right font-semibold tabular text-ink">{s.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link href="/demo/proof-loop" className="mt-6 inline-block text-[16px] font-semibold text-leaf-ink underline-offset-4 hover:underline">
                  Run the attacks in the demo
                </Link>
              </div>
            </div>
          </section>

          <section id="integrations" className="scroll-mt-28 pb-28">
            <SectionHead
              title="One config line, real agents"
              intro="Tether is an MCP gateway. Point an agent at it and it works with Claude Desktop, Cursor, LangGraph and the OpenAI Agents SDK, with no agent code changes."
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
              <div className="rounded-[28px] bg-surface p-7">
                <p className="mb-4 text-[18px] font-bold text-ink">MCP</p>
                <CopyCode code={mcpConfig} label="MCP configuration for an agent" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-[28px] bg-surface p-7">
                  <p className="text-[18px] font-bold text-ink">GitHub</p>
                  <p className="mt-2 text-[16.5px] leading-relaxed text-ink-2">Role Cards live in your repo. Fixes arrive as pull requests, and the proof loop runs as a GitHub Action.</p>
                </div>
                <div className="rounded-[28px] bg-surface p-7">
                  <p className="text-[18px] font-bold text-ink">Slack</p>
                  <p className="mt-2 text-[16.5px] leading-relaxed text-ink-2">Alerts arrive with the score, the reason and Approve, Block or Isolate buttons.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-28">
            <SectionHead title="Built for the six hard cases" intro="Every core challenge of identity drift has a specific answer, not a threshold to tune." />
            <dl className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {challenges.map((c) => (
                <div key={c.name} className="border-t border-line pt-5">
                  <dt className="text-[17px] font-bold text-ink">{c.name}</dt>
                  <dd className="mt-2 text-[16.5px] leading-relaxed text-ink-2">{c.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-16 flex flex-col items-start justify-between gap-8 rounded-[36px] bg-forest p-10 text-white md:flex-row md:items-end lg:p-14">
            <div>
              <h2 className="font-display text-[44px] font-extrabold leading-[0.95] sm:text-[56px]">Watch Tether catch a hijacked agent</h2>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#DCE5DE]">
                The demo follows one poisoned supplier PDF through Northwind Supply&rsquo;s agents, from the first read to the proven fix.
              </p>
            </div>
            <ButtonLink href="/demo" variant="leaf" className="shrink-0">Open the live demo</ButtonLink>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-8 text-[15px] text-ink-3">
          <Logo />
          <p>Identity drift detection for AI agents. The demo uses sample data.</p>
        </footer>
      </div>
    </SmoothScroll>
  );
}
