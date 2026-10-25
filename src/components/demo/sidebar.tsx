"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, Bot, Crosshair, FileCode2, LayoutGrid, Network, Play, Plug, Repeat } from "lucide-react";
import { Logo, cx } from "@/components/ui";
import { alerts, workspace } from "@/lib/data";

const nav = [
  { href: "/demo", label: "Overview", icon: LayoutGrid },
  { href: "/demo/run", label: "Live run", icon: Play },
  { href: "/demo/agents", label: "Agents", icon: Bot },
  { href: "/demo/alerts", label: "Alerts", icon: BellRing, count: alerts.length },
  { href: "/demo/chains", label: "Agent chains", icon: Network },
  { href: "/demo/proof-loop", label: "Proof loop", icon: Repeat },
  { href: "/demo/roles", label: "Role Cards", icon: FileCode2 },
  { href: "/demo/tripwires", label: "Tripwires", icon: Crosshair },
  { href: "/demo/integrations", label: "Integrations", icon: Plug },
];

export function Sidebar() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/demo" ? path === "/demo" : path.startsWith(href));

  return (
    <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[248px] lg:shrink-0">
      <div className="flex h-full flex-col rounded-[28px] bg-surface p-4 lg:p-5">
        <div className="flex items-center justify-between px-1 lg:mb-8">
          <Link href="/" aria-label="Tether home">
            <Logo />
          </Link>
        </div>

        <nav aria-label="Demo" className="-mx-1 mt-4 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mt-0 lg:flex-col lg:overflow-visible">
          {nav.map(({ href, label, icon: Icon, count }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[16px] font-semibold transition-colors duration-150",
                  active ? "bg-ink text-white" : "text-ink-2 hover:bg-mist hover:text-ink",
                )}
              >
                <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>{label}</span>
                {count !== undefined && (
                  <span className={cx("ml-auto rounded-full px-2 text-[13.5px] tabular", active ? "bg-forest-2 text-leaf" : "bg-blush text-blush-ink")}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-[20px] bg-mist p-4 lg:block">
          <p className="text-[14.5px] text-ink-3">Demo workspace</p>
          <p className="mt-0.5 font-semibold text-ink">{workspace.name}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-3">All data here is sample data, built around one hijacked agent.</p>
          <Link href="/" className="mt-3 inline-block text-[14.5px] font-semibold text-leaf-ink underline-offset-4 hover:underline">
            Back to the site
          </Link>
        </div>
      </div>
    </aside>
  );
}
