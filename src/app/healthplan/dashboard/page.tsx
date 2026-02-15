"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";

const losBreakdown = [
  { type: "Ambulatory", percent: 62, color: "success" as const },
  { type: "Wheelchair", percent: 24, color: "brand" as const },
  { type: "Stretcher", percent: 8, color: "danger" as const },
  { type: "Gurney", percent: 4, color: "warning" as const },
  { type: "BLS Ambulance", percent: 2, color: "info" as const },
];

const authRequests = [
  {
    id: "AUTH-8821",
    member: "Maria Gonzalez",
    memberId: "MBR-44210",
    los: "Wheelchair",
    losBadge: "brand" as const,
    status: "Pending Review",
    statusBadge: "warning" as const,
    requestDate: "Feb 10, 2026",
    trips: 12,
    reason: "Dialysis (recurring 3x/week)",
  },
  {
    id: "AUTH-8820",
    member: "James Washington",
    memberId: "MBR-33108",
    los: "Ambulatory",
    losBadge: "success" as const,
    status: "Approved",
    statusBadge: "success" as const,
    requestDate: "Feb 9, 2026",
    trips: 4,
    reason: "Cardiac rehab (post-discharge)",
  },
  {
    id: "AUTH-8819",
    member: "Dorothy Chen",
    memberId: "MBR-51402",
    los: "Stretcher",
    losBadge: "danger" as const,
    status: "Pending Review",
    statusBadge: "warning" as const,
    requestDate: "Feb 9, 2026",
    trips: 2,
    reason: "Hospital transfer (bariatric)",
  },
  {
    id: "AUTH-8818",
    member: "Robert Kim",
    memberId: "MBR-22905",
    los: "Ambulatory",
    losBadge: "success" as const,
    status: "Denied",
    statusBadge: "danger" as const,
    requestDate: "Feb 8, 2026",
    trips: 8,
    reason: "Non-covered benefit",
  },
  {
    id: "AUTH-8817",
    member: "Susan Martinez",
    memberId: "MBR-60317",
    los: "Wheelchair",
    losBadge: "brand" as const,
    status: "Approved",
    statusBadge: "success" as const,
    requestDate: "Feb 8, 2026",
    trips: 20,
    reason: "Oncology treatment (ongoing)",
  },
];

export default function HealthPlanDashboard() {
  const router = useRouter();
  return (
    <div>
      <PageHeader
        title="Health Plan Dashboard"
        description="Desert Health Partners -- Member transportation benefit management and utilization analytics."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/healthplan/authorizations")}>
              Manage Auth Rules
            </Button>
            <Button size="sm" onClick={() => router.push("/healthplan/analytics")}>View Analytics</Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Members"
          value="24,500"
          change="+320 this month"
          changeType="positive"
          icon="👥"
        />
        <StatCard
          label="Trips This Month"
          value="3,847"
          change="+5% vs last month"
          changeType="neutral"
          icon="🚐"
        />
        <StatCard
          label="Avg Cost / Trip"
          value="$32.40"
          change="-$1.20 vs target"
          changeType="positive"
          icon="💰"
        />
        <StatCard
          label="Auth Approval Rate"
          value="94.2%"
          change="Above 90% target"
          changeType="positive"
          icon="✓"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Utilization by LOS */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Utilization by Level of Service
          </h2>
          <div className="space-y-4">
            {losBreakdown.map((item) => (
              <ProgressBar
                key={item.type}
                value={item.percent}
                max={100}
                label={item.type}
                showValue
                color={item.color}
              />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Based on 3,847 trips this month
            </p>
          </div>
        </Card>

        {/* Recent Auth Requests */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Authorization Requests
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/healthplan/authorizations")}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {authRequests.map((auth) => (
              <div
                key={auth.id}
                className="flex items-start justify-between rounded-lg border border-border p-3 hover:bg-surface-muted/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-accent">{auth.id}</span>
                    <Badge variant={auth.statusBadge}>{auth.status}</Badge>
                  </div>
                  <p className="text-sm text-text-primary">
                    {auth.member}{" "}
                    <span className="text-text-muted">({auth.memberId})</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={auth.losBadge}>{auth.los}</Badge>
                    <span className="text-xs text-text-muted">
                      {auth.trips} trips &middot; {auth.reason}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-text-muted">{auth.requestDate}</p>
                  {auth.status === "Pending Review" && (
                    <Button size="sm" className="mt-2">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/healthplan/benefits")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
              ⚙
            </span>
            <div>
              <p className="font-medium text-text-primary">Configure Benefits</p>
              <p className="text-xs text-text-muted">Set NEMT coverage rules</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/healthplan/authorizations")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-lg">
              📋
            </span>
            <div>
              <p className="font-medium text-text-primary">Manage Auth Rules</p>
              <p className="text-xs text-text-muted">Auto-approve conditions</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/healthplan/analytics")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-lg">
              📊
            </span>
            <div>
              <p className="font-medium text-text-primary">View Analytics</p>
              <p className="text-xs text-text-muted">Cost trends and utilization</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
