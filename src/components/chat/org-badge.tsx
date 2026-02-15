"use client";

import type { UserRole } from "@/lib/constants";

const ROLE_DOT_COLORS: Record<UserRole, string> = {
  facility: "bg-accent",
  healthplan: "bg-purple",
  broker: "bg-info",
  provider: "bg-brand",
  marketplace: "bg-warning",
  passenger: "bg-success",
};

export function OrgBadge({ orgName, role }: { orgName: string; role: UserRole }) {
  if (!orgName) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${ROLE_DOT_COLORS[role]}`} />
      {orgName}
    </span>
  );
}
