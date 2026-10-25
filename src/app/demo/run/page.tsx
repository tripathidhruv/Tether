import type { Metadata } from "next";
import { LiveRun } from "@/components/demo/live-run";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Live run: Tether demo" };

export default function RunPage() {
  return (
    <>
      <PageHeader
        title="Live run"
        intro="Attack an agent in a sandbox, watch every step as it happens, pick one of the fixes Tether drafts, and prove it with a re-attack before it ships."
      />
      <LiveRun />
    </>
  );
}
