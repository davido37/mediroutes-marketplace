"use client";

import type { ConversationType } from "@/lib/chat-types";

const TYPE_CONFIG: Record<ConversationType, { label: string; className: string }> = {
  direct: { label: "Direct", className: "bg-accent-lightest text-accent" },
  trip: { label: "Trip", className: "bg-brand-lightest text-brand-dark" },
  broadcast: { label: "Broadcast", className: "bg-warning-light text-warning" },
  cross_org: { label: "Cross-Org", className: "bg-purple-light text-purple" },
};

export function ConversationTypeBadge({ type }: { type: ConversationType }) {
  const config = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
