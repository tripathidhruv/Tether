"use client";

import { Check, Copy } from "lucide-react";
import { CopyButton, CopyButtonIcon, useCopyButton } from "@animate-ui/react/primitives/buttons/copy";

function Label() {
  const { copied } = useCopyButton();
  return <span>{copied ? "Copied" : "Copy"}</span>;
}

export function CopyCode({ code, label, file }: { code: string; label: string; file?: string }) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-forest">
      <div className="flex items-center justify-between gap-4 border-b border-forest-line px-5 py-2.5">
        <span className="text-[14.5px] text-[#C4D0C8]">{file ?? "mcp.json"}</span>
        <CopyButton
          content={code}
          aria-label={`Copy ${label}`}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[14.5px] font-semibold text-white ring-1 ring-forest-line hover:bg-forest-2"
        >
          <CopyButtonIcon icon={<Copy size={14} />} copiedIcon={<Check size={14} />} />
          <Label />
        </CopyButton>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[14.5px] leading-[1.7] text-[#DDE6DF]" aria-label={label}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
