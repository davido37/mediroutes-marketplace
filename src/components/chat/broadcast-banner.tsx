"use client";

export function BroadcastBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning-light/30 px-3 py-2 text-xs text-warning">
      <span className="text-sm">📢</span>
      <span className="font-medium">Broadcast channel — only the sender can post messages</span>
    </div>
  );
}
