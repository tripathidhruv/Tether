"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AgentIcon, AreaSpark, ScoreRing } from "@/components/demo/visuals";
import { cx } from "@/components/ui";
import { bandFor, bands, type Agent } from "@/lib/data";

export function AgentLeaderboard({ agents }: { agents: Agent[] }) {
  return (
    <ul className="space-y-2.5">
      {agents.map((a) => {
        const band = bandFor(a.score);
        return (
          <li key={a.id}>
            <Link
              href={`/demo/agents/${a.id}`}
              className="group flex items-center gap-4 rounded-[20px] bg-mist px-4 py-3.5 ring-1 ring-transparent transition-all duration-150 hover:bg-white hover:ring-line"
            >
              <AgentIcon id={a.id} score={a.score} />
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-bold text-ink">{a.name}</p>
                <p className="truncate text-[15px] text-ink-2">{a.status}</p>
              </div>
              <AreaSpark values={a.trend} band={band} className="hidden 2xl:block" />
              <div className="flex w-[118px] items-center justify-end gap-3">
                <span className={cx("text-[14.5px] font-bold", bands[band].text === "text-white" ? "text-risk" : bands[band].text)}>{bands[band].label}</span>
                <ScoreRing score={a.score} size={54} stroke={5} />
              </div>
              <ChevronRight size={18} className="hidden text-ink-3 transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
