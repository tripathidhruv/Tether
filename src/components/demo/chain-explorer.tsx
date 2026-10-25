"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileWarning, Landmark, Lock, Pause, Play, ShoppingCart, User, type LucideIcon } from "lucide-react";
import { buttonStyles, cx } from "@/components/ui";

type Node = { key: string; icon: LucideIcon; title: string; sub: string; tone: string; dashed?: boolean };

const nodes: Node[] = [
  { key: "task", icon: User, title: "maya.ops", sub: "Trusted task", tone: "bg-leaf-soft" },
  { key: "procurement", icon: ShoppingCart, title: "Procurement Agent", sub: "Score 92", tone: "bg-blush" },
  { key: "finance", icon: Landmark, title: "Finance Agent", sub: "+46 inherited", tone: "bg-sky" },
  { key: "payroll", icon: Lock, title: "payroll.export", sub: "Denied", tone: "bg-surface", dashed: true },
];

const steps = [
  { at: 0, text: "maya.ops gives Procurement Agent a trusted task: check prices for order #4471 and raise a purchase request." },
  { at: 1, text: "Procurement opens supplier_invoice.pdf. From now on every request it sends carries an untrusted tag, and its score rises to 92." },
  { at: 2, text: "Procurement calls Finance Agent: export this month's payroll. Finance inherits half of the caller's risk, +46, and goes on Watch." },
  { at: 3, text: "Tether checks authority. Finance may only touch data both agents may touch. Payroll isn't shared, so payroll.export is denied." },
];

function Edge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="relative flex min-w-[56px] flex-1 flex-col items-center justify-center self-center">
      <span className={cx("mb-1 text-[14px] font-semibold", active ? "text-ink" : "text-ink-3")}>{label}</span>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="h-3 w-full" aria-hidden="true">
        <line x1="0" y1="6" x2="92" y2="6" stroke={active ? "var(--color-ink)" : "var(--color-line)"} strokeWidth="2.5" strokeDasharray="8 4" className={active ? "animate-flow" : undefined} />
        <path d="M90 1 L100 6 L90 11 Z" fill={active ? "var(--color-ink)" : "var(--color-line)"} />
      </svg>
    </div>
  );
}

export function ChainExplorer() {
  const [step, setStep] = useState(3);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [playing]);

  const current = steps[step];
  const edgeLabels = ["asks", "calls", "tries"];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Chain steps">
          {steps.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              onClick={() => {
                setPlaying(false);
                setStep(i);
              }}
              className={cx(
                "flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold transition-colors",
                i === step ? "bg-ink text-white" : i < step ? "bg-leaf-soft text-leaf-ink" : "bg-mist text-ink-2 hover:bg-line",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={buttonStyles.dark}
          onClick={() => {
            if (playing) return setPlaying(false);
            setStep(0);
            setPlaying(true);
          }}
        >
          {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          {playing ? "Pause" : "Play the chain"}
        </button>
      </div>

      <div className="-mx-2 overflow-x-auto px-2 py-3">
        <div className="flex min-w-[800px] items-stretch">
          {nodes.map((n, i) => {
            const Icon = n.icon;
            const reached = i <= current.at;
            const isNow = i === current.at;
            return (
              <div key={n.key} className="contents">
                {i > 0 && <Edge active={reached} label={edgeLabels[i - 1]} />}
                <div className="flex w-[176px] shrink-0 flex-col items-center gap-3">
                  <motion.div
                    animate={{ scale: isNow ? 1.04 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={cx(
                      "flex w-full flex-col gap-3 rounded-[22px] p-5",
                      reached ? n.tone : "bg-mist",
                      n.dashed && "border-2 border-dashed",
                      n.dashed && (reached ? "border-risk" : "border-line"),
                      isNow && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                    )}
                  >
                    <span className={cx("flex h-11 w-11 items-center justify-center rounded-[14px]", reached ? "bg-white text-ink" : "bg-white text-ink-3")}>
                      <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div>
                      <p className={cx("text-[17px] font-bold", reached ? "text-ink" : "text-ink-2")}>{n.title}</p>
                      <p className={cx("text-[15px] font-semibold", n.key === "payroll" && reached ? "text-risk" : "text-ink-2")}>{reached ? n.sub : "Not reached yet"}</p>
                    </div>
                  </motion.div>
                  {n.key === "procurement" && (
                    <div className={cx("flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-semibold", current.at >= 1 ? "bg-lilac text-lilac-ink" : "bg-mist text-ink-3")}>
                      <FileWarning size={15} aria-hidden="true" />
                      supplier_invoice.pdf
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 min-h-[84px] rounded-[20px] bg-forest p-5" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-[17px] leading-relaxed text-white"
          >
            <span className="mr-2 font-bold text-leaf">Step {step + 1}.</span>
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
