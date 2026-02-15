"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Tabs } from "@/components/common/tabs";

const brokerTabs = [
  { id: "modivcare", label: "Modivcare", badge: 8 },
  { id: "mtm", label: "MTM", badge: 6 },
  { id: "saferide", label: "SafeRide", badge: 5 },
  { id: "alivi", label: "Alivi", badge: 4 },
];

const recentImports = [
  {
    id: "IMP-5520",
    broker: "Modivcare",
    brokerBadge: "brand" as const,
    patient: "Maria Gonzalez",
    pickup: "Feb 10, 2:15 PM",
    status: "Matched",
    statusBadge: "success" as const,
    syncStatus: "Synced",
    syncBadge: "success" as const,
  },
  {
    id: "IMP-5519",
    broker: "MTM",
    brokerBadge: "info" as const,
    patient: "James Washington",
    pickup: "Feb 10, 3:00 PM",
    status: "Pending Match",
    statusBadge: "warning" as const,
    syncStatus: "Synced",
    syncBadge: "success" as const,
  },
  {
    id: "IMP-5518",
    broker: "Modivcare",
    brokerBadge: "brand" as const,
    patient: "Dorothy Chen",
    pickup: "Feb 10, 4:30 PM",
    status: "Conflict",
    statusBadge: "danger" as const,
    syncStatus: "Error",
    syncBadge: "danger" as const,
  },
  {
    id: "IMP-5517",
    broker: "SafeRide",
    brokerBadge: "purple" as const,
    patient: "Robert Kim",
    pickup: "Feb 11, 9:00 AM",
    status: "Matched",
    statusBadge: "success" as const,
    syncStatus: "Pending",
    syncBadge: "warning" as const,
  },
  {
    id: "IMP-5516",
    broker: "Alivi",
    brokerBadge: "muted" as const,
    patient: "Susan Martinez",
    pickup: "Feb 11, 10:15 AM",
    status: "Pending Match",
    statusBadge: "warning" as const,
    syncStatus: "Synced",
    syncBadge: "success" as const,
  },
];

export default function BrokerDashboard() {
  const router = useRouter();
  const [activeBroker, setActiveBroker] = useState("modivcare");

  return (
    <div>
      <PageHeader
        title="Broker Integration Dashboard"
        description="Manage trip imports, provider matching, and claims submission across all broker partners."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/broker/providers")}>
              Provider Network
            </Button>
            <Button size="sm" onClick={() => router.push("/broker/claims")}>Submit Claims</Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pending Imports"
          value={23}
          change="12 auto-matchable"
          changeType="positive"
          icon="📥"
        />
        <StatCard
          label="Active Trips"
          value={156}
          change="Across 4 brokers"
          changeType="neutral"
          icon="🚐"
        />
        <StatCard
          label="Claims Submitted"
          value={89}
          change="$12,450 pending"
          changeType="neutral"
          icon="📄"
        />
        <StatCard
          label="Sync Status"
          value="98.7%"
          change="2 errors to resolve"
          changeType="negative"
          icon="🔄"
        />
      </div>

      {/* Broker Tabs */}
      <Card className="mb-6">
        <Tabs
          tabs={brokerTabs}
          activeTab={activeBroker}
          onChange={setActiveBroker}
          className="mb-4"
        />

        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary capitalize">
              {activeBroker} Imports
            </h3>
            <p className="text-xs text-text-muted">
              Showing recent imports from {activeBroker.charAt(0).toUpperCase() + activeBroker.slice(1)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/broker/imports")}>
            View All
          </Button>
        </div>

        {/* Recent Imports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="pb-2 pr-4 font-medium">Import ID</th>
                <th className="pb-2 pr-4 font-medium">Broker</th>
                <th className="pb-2 pr-4 font-medium">Patient</th>
                <th className="pb-2 pr-4 font-medium">Pickup</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Sync</th>
              </tr>
            </thead>
            <tbody>
              {recentImports.map((imp) => (
                <tr
                  key={imp.id}
                  className="border-b border-border last:border-0 hover:bg-surface-muted/50"
                >
                  <td className="py-3 pr-4 font-medium text-accent">{imp.id}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={imp.brokerBadge}>{imp.broker}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-text-primary">{imp.patient}</td>
                  <td className="py-3 pr-4 text-text-secondary">{imp.pickup}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={imp.statusBadge}>{imp.status}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={imp.syncBadge}>{imp.syncStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/broker/imports")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
              📥
            </span>
            <div>
              <p className="font-medium text-text-primary">View Imports</p>
              <p className="text-xs text-text-muted">Process pending trip imports</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/broker/providers")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-lg">
              🏥
            </span>
            <div>
              <p className="font-medium text-text-primary">Provider Network</p>
              <p className="text-xs text-text-muted">Manage matching rules</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/broker/claims")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-lg">
              📄
            </span>
            <div>
              <p className="font-medium text-text-primary">Submit Claims</p>
              <p className="text-xs text-text-muted">Batch claims processing</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
