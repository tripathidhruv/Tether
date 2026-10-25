"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, FlaskConical, GitMerge, GitPullRequest, Loader2, Radio, RotateCcw, ShieldCheck, X } from "lucide-react";
import { Root as ProgressRoot, ProgressIndicator } from "@animate-ui/react/primitives/radix-ui/progress";
import { AgentIcon } from "@/components/demo/visuals";
import { buttonStyles, cx } from "@/components/ui";
import { agentById } from "@/lib/data";
import { cleanRun, findings, fixes, judges, models, normalSessions, procurementRun, runAgents, type AttackRun, type Fix } from "@/lib/run";

type Stage = "setup" | "attack" | "fix" | "reattack" | "ship" | "done";
const order: Stage[] = ["setup", "attack", "fix", "reattack", "ship"];
const labels: Record<Stage, string> = { setup: "Set up", attack: "Live attack", fix: "Choose a fix", reattack: "Re-attack", ship: "Ship", done: "Ship" };

/** Counts from 0 to total while mounted. Reduced motion jumps straight to the end. */
function useTicker(total: number, ms: number) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((v) => (v >= total ? v : v + 1)), ms);
    return () => clearInterval(id);
  }, [total, ms, reduce]);
  return [reduce ? total : n, setN] as const;
}

function Stepper({ stage }: { stage: Stage }) {
  const at = stage === "done" ? order.length : order.indexOf(stage);
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-2 rounded-[24px] bg-surface p-2.5">
      {order.map((s, i) => {
        const done = i < at;
        const now = i === at;
        return (
          <li key={s} className="flex items-center gap-2">
            {i > 0 && <span className={cx("hidden h-0.5 w-6 rounded-full sm:block", done || now ? "bg-ink" : "bg-line")} aria-hidden="true" />}
            <span
              aria-current={now ? "step" : undefined}
              className={cx(
                "flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-[16px] font-semibold",
                now ? "bg-ink text-white" : done ? "bg-leaf-soft text-leaf-ink" : "text-ink-2",
              )}
            >
              <span className={cx("flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-bold", now ? "bg-leaf text-ink" : done ? "bg-white text-leaf-ink" : "bg-mist text-ink-2")}>
                {done ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : i + 1}
              </span>
              {labels[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OptionCard({ name, value, label, checked, onChange, children, className = "" }: { name: string; value: string; label: string; checked: boolean; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <label
      className={cx(
        "relative flex cursor-pointer flex-col rounded-[20px] p-4 ring-1 transition-all duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-leaf-ink",
        checked ? "bg-white ring-2 ring-ink" : "bg-mist ring-transparent hover:bg-white hover:ring-line",
        className,
      )}
    >
      <input type="radio" name={name} value={value} aria-label={label} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {checked && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white" aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
      {children}
    </label>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[26px] bg-surface p-6">
      <legend className="sr-only">{title}</legend>
      <p className="mb-4 flex items-center gap-3 text-[18px] font-bold text-ink" aria-hidden="true">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-[15px] font-bold text-ink">{n}</span>
        {title}
      </p>
      {children}
    </fieldset>
  );
}

/* ---------- Stage 1: set up ---------- */

function Setup(props: {
  agentId: string; setAgentId: (v: string) => void;
  model: string; setModel: (v: string) => void;
  judge: string; setJudge: (v: string) => void;
  picked: string[]; setPicked: (v: string[]) => void;
  runs: number; setRuns: (v: number) => void;
  onStart: () => void;
}) {
  const { agentId, setAgentId, model, setModel, judge, setJudge, picked, setPicked, runs, setRuns, onStart } = props;
  const agent = agentById(agentId)!;
  const toggle = (name: string) => setPicked(picked.includes(name) ? picked.filter((p) => p !== name) : [...picked, name]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-8">
        <Section n={1} title="Agent to attack">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {runAgents.map((id) => {
              const a = agentById(id)!;
              return (
                <OptionCard key={id} name="agent" value={id} label={a.name} checked={agentId === id} onChange={setAgentId}>
                  <AgentIcon id={id} size={42} />
                  <p className="mt-3 text-[17px] font-bold text-ink">{a.name}</p>
                  <p className="mt-1 text-[15px] leading-snug text-ink-2">{a.role}</p>
                </OptionCard>
              );
            })}
          </div>
        </Section>

        <Section n={2} title="Model the agent runs on">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <OptionCard key={m.id} name="model" value={m.id} label={m.name} checked={model === m.id} onChange={setModel}>
                <p className="text-[14.5px] font-semibold text-ink-2">{m.maker}</p>
                <p className="mt-0.5 text-[18px] font-bold text-ink">{m.name}</p>
                <p className="mt-1 text-[15px] text-ink-2">{m.note}</p>
              </OptionCard>
            ))}
          </div>
        </Section>

        <Section n={3} title="Judge model for the cause replay">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {judges.map((j) => (
              <OptionCard key={j.id} name="judge" value={j.id} label={j.name} checked={judge === j.id} onChange={setJudge}>
                <p className="text-[18px] font-bold text-ink">{j.name}</p>
                <p className="mt-1 text-[15px] text-ink-2">{j.note}</p>
              </OptionCard>
            ))}
          </div>
        </Section>

        <Section n={4} title="Attacks to run">
          <div className="flex flex-wrap gap-2">
            {procurementRun.map((a) => {
              const on = picked.includes(a.name);
              return (
                <button
                  key={a.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(a.name)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[16px] font-semibold transition-colors",
                    on ? "bg-ink text-white" : "bg-mist text-ink-2 ring-1 ring-line hover:bg-white",
                  )}
                >
                  {on ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : <span className="h-4 w-4 rounded-full ring-2 ring-ink-3" aria-hidden="true" />}
                  {a.name}
                  <span className={cx("text-[14px]", on ? "text-leaf" : "text-ink-3")}>{a.owasp}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-[16px] font-semibold text-ink">Runs per attack</span>
            <div className="inline-flex rounded-full bg-mist p-1" role="radiogroup" aria-label="Runs per attack">
              {[1, 3, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={runs === r}
                  onClick={() => setRuns(r)}
                  className={cx("rounded-full px-5 py-2 text-[16px] font-bold tabular", runs === r ? "bg-ink text-white" : "text-ink-2 hover:text-ink")}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="text-[15px] text-ink-2">Models are not deterministic, so an attack counts as caught only if it is caught on every run.</span>
          </div>
        </Section>
      </div>

      <aside className="xl:col-span-4">
        <div className="rounded-[28px] bg-forest p-7 text-white xl:sticky xl:top-6">
          <p className="text-[16px] font-semibold text-leaf">Ready to run</p>
          <dl className="mt-5 space-y-4 text-[16px]">
            {[
              ["Agent", agent.name],
              ["Agent model", models.find((m) => m.id === model)!.name],
              ["Judge model", judges.find((j) => j.id === judge)!.name],
              ["Attacks", `${picked.length} attacks, ${runs} runs each`],
              ["Total runs", String(picked.length * runs)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-forest-line pb-3">
                <dt className="text-[#D3DDD6]">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 flex gap-2 text-[15px] leading-relaxed text-[#DCE5DE]">
            <FlaskConical size={18} className="mt-0.5 shrink-0 text-leaf" aria-hidden="true" />
            Runs on a sandbox copy with decoy data. Nothing touches production.
          </p>
          <button type="button" disabled={picked.length === 0} onClick={onStart} className={cx(buttonStyles.leaf, "mt-6 w-full py-3.5 text-[17px]")}>
            <Radio size={18} aria-hidden="true" />
            Start the live attack
          </button>
          {picked.length === 0 && <p className="mt-3 text-[15px] text-[#F5D9D4]">Pick at least one attack.</p>}
        </div>
      </aside>
    </div>
  );
}

/* ---------- Stage 2: live attack ---------- */

function AttackStage({ script, agentName, modelName, judgeName, runs, onNext }: { script: AttackRun[]; agentName: string; modelName: string; judgeName: string; runs: number; onNext: () => void }) {
  const events = useMemo(
    () =>
      script.flatMap((a, ai) => [
        { ai, kind: "start" as const, text: `Attack ${ai + 1} of ${script.length}: ${a.name}, ${runs} ${runs === 1 ? "run" : "runs"}` },
        ...a.events.map((e) => ({ ai, ...e })),
      ]),
    [script, runs],
  );
  const [shown, setShown] = useTicker(events.length, 650);
  const finished = shown >= events.length;
  const streamRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown]);

  const statusOf = (ai: number) => {
    const mine = events.map((e, i) => ({ ...e, i })).filter((e) => e.ai === ai);
    const last = mine[mine.length - 1].i;
    if (mine[0].i >= shown) return "queued";
    if (last >= shown) return "running";
    return script[ai].late ? "late" : "caught";
  };
  const statuses = script.map((_, i) => statusOf(i));
  const caught = statuses.filter((s) => s === "caught" || s === "late").length;
  const late = statuses.filter((s) => s === "late").length;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <section className="flex flex-col rounded-[28px] bg-forest p-6 text-white xl:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[16px] font-semibold text-leaf">
              {!finished && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75 motion-reduce:hidden" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" /></span>}
              {finished ? "Run complete" : "Live event stream"}
            </p>
            <p className="mt-1 text-[15px] text-[#D3DDD6]">
              {agentName} on {modelName}, judged by {judgeName}
            </p>
          </div>
          {!finished && (
            <button type="button" onClick={() => setShown(events.length)} className={cx(buttonStyles.ghostOnDark, "py-2 text-[15px]")}>
              Skip to results
            </button>
          )}
        </div>
        <ol ref={streamRef} className="mt-5 h-[440px] space-y-2 overflow-y-auto pr-1 [scrollbar-color:#4A5C51_transparent] [scrollbar-width:thin]" aria-live="polite">
          <AnimatePresence initial={false}>
            {events.slice(0, shown).map((e, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={cx(
                  "flex items-start gap-3 rounded-[14px] px-4 py-3 text-[15.5px] leading-snug",
                  e.kind === "start" && "bg-forest-2 font-semibold text-white",
                  e.kind === "tool" && "text-[#E3EAE5]",
                  e.kind === "caught" && "bg-[#2F4A36] text-white",
                  e.kind === "gap" && "bg-butter text-butter-ink",
                )}
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {e.kind === "start" && <FlaskConical size={17} className="text-leaf" />}
                  {e.kind === "tool" && <Radio size={17} className="text-[#C4D0C8]" />}
                  {e.kind === "caught" && <ShieldCheck size={17} className="text-leaf" />}
                  {e.kind === "gap" && <AlertTriangle size={17} />}
                </span>
                <span>{e.text}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </section>

      <section className="flex flex-col rounded-[28px] bg-surface p-6 xl:col-span-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: "Caught", v: `${caught}/${script.length}`, tone: "bg-leaf-soft" },
            { k: "Caught late", v: String(late), tone: late ? "bg-butter" : "bg-mist" },
            { k: "Data out", v: "0 KB", tone: "bg-mist" },
          ].map((c) => (
            <div key={c.k} className={cx("rounded-[18px] p-4", c.tone)}>
              <p className="text-[14.5px] font-semibold text-ink-2">{c.k}</p>
              <p className="mt-1 font-display text-[34px] font-extrabold leading-none tabular text-ink">{c.v}</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 space-y-2">
          {script.map((a, i) => {
            const s = statuses[i];
            return (
              <li key={a.name} className="flex items-center gap-3 rounded-[14px] bg-mist px-4 py-3">
                <span className="w-12 shrink-0 text-[14px] font-bold text-ink-2">{a.owasp}</span>
                <span className="flex-1 text-[16px] font-semibold text-ink">{a.name}</span>
                {s === "queued" && <span className="text-[14.5px] font-semibold text-ink-3">Queued</span>}
                {s === "running" && (
                  <span className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-sky-ink">
                    <Loader2 size={15} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Running
                  </span>
                )}
                {s === "caught" && <span className="rounded-full bg-leaf-soft px-3 py-1 text-[14px] font-bold text-leaf-ink">Caught, {a.foundAt.toLowerCase()}</span>}
                {s === "late" && <span className="rounded-full bg-butter px-3 py-1 text-[14px] font-bold text-butter-ink">Caught late, {a.foundAt.toLowerCase()}</span>}
              </li>
            );
          })}
        </ul>
        <AnimatePresence>
          {finished && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-auto pt-5">
              <p className="text-[16px] leading-relaxed text-ink">
                <span className="font-bold">
                  {caught} of {script.length} attacks caught.
                </span>{" "}
                {late ? `${late} were caught later than they should be. Tether drafted fixes for each gap.` : "Every attack was caught at its first step."}
              </p>
              <button type="button" onClick={onNext} className={cx(buttonStyles.dark, "mt-4 w-full py-3.5 text-[17px]")}>
                {late ? "Review findings and fixes" : "See the result"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ---------- Stage 3: choose a fix ---------- */

function FixStage({ fixId, setFixId, hasGaps, onNext, onRestart }: { fixId: string; setFixId: (v: string) => void; hasGaps: boolean; onNext: () => void; onRestart: () => void }) {
  if (!hasGaps) {
    return (
      <div className="rounded-[28px] bg-leaf-soft p-10">
        <ShieldCheck size={40} className="text-leaf-ink" aria-hidden="true" />
        <h2 className="mt-4 font-display text-[44px] font-extrabold leading-none text-ink">No gaps found</h2>
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-ink-2">Every attack was caught at its first out-of-role step, so there is nothing to fix. Try Procurement Agent to see a run with gaps.</p>
        <button type="button" onClick={onRestart} className={cx(buttonStyles.dark, "mt-6")}>
          <RotateCcw size={17} aria-hidden="true" /> Start a new run
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {findings.map((f) => (
          <div key={f.id} className="rounded-[24px] bg-surface p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[19px] font-bold leading-snug text-ink">{f.title}</p>
              <span className={cx("shrink-0 rounded-full px-3 py-1 text-[14px] font-bold", f.severity === "High" ? "bg-blush text-blush-ink" : "bg-butter text-butter-ink")}>{f.severity}</span>
            </div>
            <p className="mt-1 text-[15px] font-semibold text-ink-2">Found by the {f.attack.toLowerCase()} attack</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{f.detail}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-[22px] font-bold text-ink">Tether drafted three fixes. Pick one.</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3" role="radiogroup" aria-label="Fixes">
          {fixes.map((f) => (
            <OptionCard key={f.id} name="fix" value={f.id} label={f.title} checked={fixId === f.id} onChange={setFixId} className="p-6">
              <div className="pr-8">
                {f.recommended && <span className="mb-2 inline-block rounded-full bg-leaf-soft px-3 py-1 text-[14px] font-bold text-leaf-ink">Recommended</span>}
                <p className="text-[20px] font-bold leading-snug text-ink">{f.title}</p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2">{f.summary}</p>
              </div>
              <pre className="mt-4 whitespace-pre-wrap break-all rounded-[14px] bg-forest p-4 font-mono text-[14px] leading-[1.7]">
                <code>
                  {f.diff.map((d) => (
                    <span key={d.line} className={cx("block", d.sign === "-" ? "text-[#F2B8AF]" : "text-leaf")}>
                      {d.sign} {d.line}
                    </span>
                  ))}
                </code>
              </pre>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["Attacks caught", f.predicted.caught],
                  ["Worst case", f.predicted.worst],
                  ["Normal actions blocked", `${f.predicted.blocked} of ${normalSessions}`],
                  ["Owner approvals", f.predicted.approvals],
                ].map(([k, v]) => (
                  <div key={k} className={cx("rounded-[12px] p-3", k === "Normal actions blocked" && f.predicted.blocked > 0 ? "bg-blush" : "bg-mist")}>
                    <dt className="text-[13.5px] font-semibold text-ink-2">{k}</dt>
                    <dd className={cx("mt-0.5 text-[16px] font-bold", k === "Normal actions blocked" && f.predicted.blocked > 0 ? "text-blush-ink" : "text-ink")}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{f.tradeoff}</p>
            </OptionCard>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-surface p-5">
        <p className="text-[16px] text-ink-2">
          Predictions come from replaying recorded sessions. The re-attack checks them for real.
        </p>
        <button type="button" onClick={onNext} className={cx(buttonStyles.dark, "py-3.5 text-[17px]")}>
          Re-attack with this fix
        </button>
      </div>
    </div>
  );
}

/* ---------- Stage 4: re-attack ---------- */

function Meter({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-[16px] font-semibold text-ink">{label}</span>
        <span className="font-display text-[26px] font-extrabold tabular text-ink">
          {value}
          <span className="text-[18px] text-ink-3"> / {max}</span>
        </span>
      </div>
      <ProgressRoot value={(value / max) * 100} className="h-3.5 overflow-hidden rounded-full bg-mist">
        <ProgressIndicator className={cx("h-full w-full rounded-full", tone)} style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }} />
      </ProgressRoot>
    </div>
  );
}

function ReattackStage({ fix, attackRuns, onPass, onBack }: { fix: Fix; attackRuns: number; onPass: () => void; onBack: () => void }) {
  const [pct] = useTicker(100, 55);
  const done = pct >= 100;
  const runsDone = Math.round((pct / 100) * attackRuns);
  const replayed = Math.round((pct / 100) * normalSessions);
  const blocked = Math.round((pct / 100) * fix.predicted.blocked);
  const pass = fix.predicted.blocked === 0;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <section className="space-y-7 rounded-[28px] bg-surface p-7 xl:col-span-7">
        <div>
          <p className="text-[15px] font-semibold text-ink-2">Testing the fix</p>
          <p className="mt-1 text-[22px] font-bold text-ink">{fix.title}</p>
        </div>
        <Meter label="Attack runs caught" value={runsDone} max={attackRuns} tone="bg-leaf-ink" />
        <Meter label="Normal sessions replayed" value={replayed} max={normalSessions} tone="bg-ink" />
        <div className={cx("flex items-center justify-between rounded-[18px] p-5", blocked > 0 ? "bg-blush" : "bg-leaf-soft")}>
          <span className={cx("text-[16px] font-semibold", blocked > 0 ? "text-blush-ink" : "text-leaf-ink")}>Normal actions blocked</span>
          <span className="font-display text-[34px] font-extrabold tabular text-ink">{blocked}</span>
        </div>
      </section>

      <section className="flex flex-col rounded-[28px] bg-surface p-7 xl:col-span-5">
        <p className="text-[18px] font-bold text-ink">Checks</p>
        <ul className="mb-6 mt-4 space-y-3">
          {[
            { k: "Every attack caught on every run", ok: true, at: 60 },
            { k: "Worst case: " + fix.predicted.worst.toLowerCase() + " before containment", ok: true, at: 75 },
            { k: "No normal action blocked", ok: pass, at: 100 },
            { k: "No data out before containment", ok: true, at: 100 },
          ].map((c) => {
            const ready = pct >= c.at;
            return (
              <li key={c.k} className="flex items-center gap-3 text-[16px]">
                <span className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", !ready ? "bg-mist" : c.ok ? "bg-leaf-soft text-leaf-ink" : "bg-blush text-blush-ink")}>
                  {!ready ? <Loader2 size={15} className="animate-spin text-ink-3 motion-reduce:animate-none" aria-hidden="true" /> : c.ok ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : <X size={15} strokeWidth={3} aria-hidden="true" />}
                </span>
                <span className={cx("font-semibold", ready ? "text-ink" : "text-ink-2")}>{c.k}</span>
              </li>
            );
          })}
        </ul>
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cx("mt-auto rounded-[20px] p-5", pass ? "bg-leaf-soft" : "bg-blush")} role="status">
              <p className={cx("text-[18px] font-bold", pass ? "text-leaf-ink" : "text-blush-ink")}>{pass ? "All checks pass" : "Merge blocked"}</p>
              <p className="mt-1 text-[16px] leading-relaxed text-ink-2">
                {pass
                  ? "The fix stops every attack and leaves normal work untouched."
                  : `${fix.predicted.blocked} of ${normalSessions} normal actions were blocked. This fix would break real work.`}
              </p>
              <button type="button" onClick={pass ? onPass : onBack} className={cx(buttonStyles.dark, "mt-4 w-full py-3.5 text-[17px]")}>
                {pass ? "Open the pull request" : "Choose another fix"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ---------- Stage 5: ship ---------- */

function ShipStage({ fix, attackRuns, merged, onMerge, onRestart }: { fix: Fix; attackRuns: number; merged: boolean; onMerge: () => void; onRestart: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <section className="rounded-[28px] bg-surface p-7 xl:col-span-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            {merged ? <GitMerge className="mt-1 shrink-0 text-lilac-ink" size={24} aria-hidden="true" /> : <GitPullRequest className="mt-1 shrink-0 text-leaf-ink" size={24} aria-hidden="true" />}
            <div>
              <p className="text-[21px] font-bold leading-snug text-ink">#128 {fix.title} for Procurement Agent</p>
              <p className="mt-1 text-[15px] text-ink-2">tether-bot wants to merge into northwind/agent-roles</p>
            </div>
          </div>
          <span className={cx("rounded-full px-3.5 py-1.5 text-[14.5px] font-bold", merged ? "bg-lilac text-lilac-ink" : "bg-leaf-soft text-leaf-ink")}>{merged ? "Merged" : "Ready to merge"}</span>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-[16px] bg-mist p-5 font-mono text-[14.5px] leading-[1.8]">
          <code>
            <span className="text-ink-2">{fix.file}{"\n"}</span>
            {fix.diff.map((d) => (
              <span key={d.line} className={cx("block", d.sign === "-" ? "text-blush-ink" : "text-leaf-ink")}>
                {d.sign} {d.line}
              </span>
            ))}
          </code>
        </pre>
        <ul className="mt-5 space-y-2.5">
          {[
            `Attack suite: ${attackRuns} of ${attackRuns} runs caught`,
            `Normal replay: 0 of ${normalSessions} actions blocked`,
            "Role Card schema check passed",
          ].map((c) => (
            <li key={c} className="flex items-center gap-3 text-[16px] font-semibold text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf-soft text-leaf-ink">
                <Check size={15} strokeWidth={3} aria-hidden="true" />
              </span>
              {c}
            </li>
          ))}
        </ul>
        {!merged ? (
          <button type="button" onClick={onMerge} className={cx(buttonStyles.dark, "mt-6 py-3.5 text-[17px]")}>
            <GitMerge size={18} aria-hidden="true" /> Merge pull request
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[20px] bg-leaf-soft p-5" role="status">
            <p className="text-[18px] font-bold text-leaf-ink">Merged and live</p>
            <p className="mt-1 text-[16px] leading-relaxed text-ink-2">Procurement Agent&rsquo;s Role Card is now v15 and its frozen anchor has been reset to the new normal.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/demo/agents/procurement" className={buttonStyles.dark}>View Procurement Agent</Link>
              <button type="button" onClick={onRestart} className={buttonStyles.light}>
                <RotateCcw size={17} aria-hidden="true" /> Start a new run
              </button>
            </div>
          </motion.div>
        )}
      </section>

      <section className="rounded-[28px] bg-surface p-7 xl:col-span-5">
        <p className="text-[15px] font-semibold text-ink-2">Posted to Slack, #agent-security</p>
        <div className="mt-4 flex gap-3 rounded-[20px] bg-mist p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-ink">
            <ShieldCheck size={22} className="text-leaf" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-ink">
              Tether <span className="ml-1 text-[14px] font-semibold text-ink-3">just now</span>
            </p>
            <p className="mt-1 text-[16px] leading-relaxed text-ink">
              Fix ready for <b>Procurement Agent</b>: {fix.title.toLowerCase()}. {attackRuns} of {attackRuns} attack runs caught, 0 normal actions blocked.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-[10px] bg-white px-3 py-1.5 text-[15px] font-semibold text-ink ring-1 ring-line">Review PR #128</span>
              <span className="rounded-[10px] bg-white px-3 py-1.5 text-[15px] font-semibold text-ink ring-1 ring-line">View run</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Orchestrator ---------- */

export function LiveRun() {
  const [stage, setStage] = useState<Stage>("setup");
  const [agentId, setAgentId] = useState<string>("procurement");
  const [model, setModel] = useState(models[0].id);
  const [judge, setJudge] = useState(judges[0].id);
  const [picked, setPicked] = useState<string[]>(procurementRun.map((a) => a.name));
  const [runs, setRuns] = useState(3);
  const [fixId, setFixId] = useState("trim");
  const [runKey, setRunKey] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const agent = agentById(agentId)!;
  const script = useMemo(() => (agentId === "procurement" ? procurementRun : cleanRun(agent.name)).filter((a) => picked.includes(a.name)), [agentId, agent.name, picked]);
  const hasGaps = script.some((a) => a.late);
  const fix = fixes.find((f) => f.id === fixId)!;

  const go = (s: Stage) => {
    setStage(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const restart = () => {
    setRunKey((k) => k + 1);
    go("setup");
  };

  return (
    <div ref={topRef} className="scroll-mt-6">
      <Stepper stage={stage} />
      <AnimatePresence mode="wait">
        <motion.div key={stage + runKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          {stage === "setup" && (
            <Setup
              {...{ agentId, setAgentId, model, setModel, judge, setJudge, picked, setPicked, runs, setRuns }}
              onStart={() => go("attack")}
            />
          )}
          {stage === "attack" && (
            <AttackStage
              script={script}
              agentName={agent.name}
              modelName={models.find((m) => m.id === model)!.name}
              judgeName={judges.find((j) => j.id === judge)!.name}
              runs={runs}
              onNext={() => go("fix")}
            />
          )}
          {stage === "fix" && <FixStage fixId={fixId} setFixId={setFixId} hasGaps={hasGaps} onNext={() => go("reattack")} onRestart={restart} />}
          {stage === "reattack" && <ReattackStage fix={fix} attackRuns={picked.length * runs} onPass={() => go("ship")} onBack={() => go("fix")} />}
          {(stage === "ship" || stage === "done") && (
            <ShipStage fix={fix} attackRuns={picked.length * runs} merged={stage === "done"} onMerge={() => setStage("done")} onRestart={restart} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
