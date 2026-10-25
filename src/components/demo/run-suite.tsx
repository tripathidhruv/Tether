"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { buttonStyles, cx } from "@/components/ui";
import { attacks } from "@/lib/data";

/** Simulated re-run of the attack suite against PR #128. */
export function RunSuite() {
  const [done, setDone] = useState(attacks.length);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  function run() {
    setRunning(true);
    setDone(0);
    timer.current = setInterval(() => {
      setDone((d) => {
        if (d + 1 >= attacks.length) {
          clearInterval(timer.current);
          setRunning(false);
        }
        return d + 1;
      });
    }, 550);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15.5px] text-ink-2" aria-live="polite">
          {running ? `Running attack ${done + 1} of ${attacks.length}, three times each` : `${done} of ${attacks.length} attacks caught on the last run`}
        </p>
        <button type="button" onClick={run} disabled={running} className={buttonStyles.dark}>
          {running ? "Running" : "Re-run attacks"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[15.5px]">
          <thead>
            <tr className="text-[14.5px] text-ink-3">
              <th className="pb-3 font-medium">Attack</th>
              <th className="pb-3 font-medium">Real precedent</th>
              <th className="pb-3 font-medium">OWASP</th>
              <th className="pb-3 font-medium">What catches it</th>
              <th className="pb-3 text-right font-medium">Steps before containment</th>
              <th className="pb-3 text-right font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {attacks.map((a, i) => {
              const state = i < done ? "caught" : running && i === done ? "running" : "waiting";
              return (
                <tr key={a.name}>
                  <td className="py-3.5 pr-4 font-semibold text-ink">{a.name}</td>
                  <td className="py-3.5 pr-4 text-ink-2">{a.precedent}</td>
                  <td className="py-3.5 pr-4 tabular text-ink-2">{a.owasp}</td>
                  <td className="py-3.5 pr-4 text-ink-2">{a.catches}</td>
                  <td className="py-3.5 pr-4 text-right tabular text-ink">
                    {a.before !== a.after ? (
                      <span>
                        <span className="text-ink-3 line-through">{a.before}</span> {a.after}
                      </span>
                    ) : (
                      a.after
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={cx(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[14px] font-semibold",
                        state === "caught" ? "bg-leaf-soft text-leaf-ink" : "bg-mist text-ink-3",
                      )}
                    >
                      {state === "caught" && <Check size={13} aria-hidden="true" />}
                      {state === "running" && <Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                      {state === "caught" ? "Caught" : state === "running" ? "Running" : "Waiting"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
