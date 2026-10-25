"use client";

import { useState } from "react";
import { Root as Switch, SwitchThumb } from "@animate-ui/react/primitives/radix-ui/switch";
import { cx } from "@/components/ui";
import { tripwires } from "@/lib/data";

export function TripwireList() {
  const [armed, setArmed] = useState(() => tripwires.map((t) => t.armed));

  return (
    <ul className="divide-y divide-line">
      {tripwires.map((t, i) => {
        const hit = t.touched !== "Never";
        return (
          <li key={t.name} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{t.name}</p>
              <p className="text-[15px] text-ink-3">
                {t.kind}, {t.place}
              </p>
            </div>
            <span className={cx("rounded-full px-3 py-1 text-[14px] font-semibold", hit ? "bg-blush text-blush-ink" : "bg-mist text-ink-3")}>
              {hit ? `Touched by ${t.touched}` : "Never touched"}
            </span>
            <label className="flex items-center gap-3 text-[15px] font-semibold text-ink-2">
              <span className="w-14 text-right">{armed[i] ? "Armed" : "Off"}</span>
              <Switch
                checked={armed[i]}
                onCheckedChange={(v) => setArmed((a) => a.map((x, j) => (j === i ? v : x)))}
                aria-label={`Arm ${t.name}`}
                className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-line p-0.5 transition-colors data-[state=checked]:bg-ink"
              >
                <SwitchThumb className="block h-6 w-6 rounded-full bg-white shadow-sm data-[state=checked]:translate-x-5" />
              </Switch>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
