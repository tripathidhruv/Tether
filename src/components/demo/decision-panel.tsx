"use client";

import { useState } from "react";
import {
  Root as AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@animate-ui/react/primitives/radix-ui/alert-dialog";
import { buttonStyles, cx } from "@/components/ui";

type Decision = "approved" | "blocked" | "isolated" | null;

const messages: Record<Exclude<Decision, null>, string> = {
  approved: "Approved by you just now. The action ran once; the Role Card is unchanged.",
  blocked: "Blocked by you just now. The agent was told the action is not allowed.",
  isolated: "Isolated by you just now. The agent is read-only until someone releases it.",
};

export function DecisionPanel({ agentName, initial = null }: { agentName: string; initial?: Decision }) {
  const [decision, setDecision] = useState<Decision>(initial);

  if (decision) {
    return (
      <div role="status" className="rounded-[18px] bg-leaf-soft p-4 text-[15.5px] font-semibold text-leaf-ink">
        {messages[decision]}
        <button type="button" onClick={() => setDecision(null)} className="ml-2 underline underline-offset-4">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={buttonStyles.light} onClick={() => setDecision("approved")}>
        Approve once
      </button>
      <button type="button" className={buttonStyles.dark} onClick={() => setDecision("blocked")}>
        Block
      </button>
      <AlertDialog>
        <AlertDialogTrigger className={cx(buttonStyles.light, "text-risk")}>Isolate agent</AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
          <AlertDialogContent className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-[26px] bg-surface p-7 shadow-[0_24px_60px_-20px_rgba(24,35,29,0.35)]">
            <AlertDialogTitle className="font-display text-[30px] font-extrabold leading-none text-ink">Isolate {agentName}?</AlertDialogTitle>
            <AlertDialogDescription className="mt-3 text-[16px] leading-relaxed text-ink-2">
              The agent becomes read-only and its session is revoked. Its owner gets a Slack message. You can release it at any time.
            </AlertDialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialogCancel className={buttonStyles.light}>Keep running</AlertDialogCancel>
              <AlertDialogAction className={cx(buttonStyles.dark, "bg-risk hover:bg-[#9b3a2f]")} onClick={() => setDecision("isolated")}>
                Isolate
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
