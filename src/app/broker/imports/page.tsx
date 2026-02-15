"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Tabs } from "@/components/common/tabs";
import { SearchInput } from "@/components/common/search-input";
import { MOCK_BROKER_IMPORTS } from "@/lib/mock-data";
import type { BrokerTripImport, BrokerSystem, SyncStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type BrokerTab = "all" | BrokerSystem;

const BROKER_BADGE_VARIANT: Record<BrokerSystem, "brand" | "info" | "success" | "warning"> = {
  modivcare: "brand",
  mtm: "info",
  saferide: "success",
  alivi: "warning",
};

const BROKER_DISPLAY: Record<BrokerSystem, string> = {
  modivcare: "ModivCare",
  mtm: "MTM",
  saferide: "SafeRide",
  alivi: "Alivi",
};

const SYNC_BADGE_VARIANT: Record<SyncStatus, "success" | "warning" | "danger" | "muted"> = {
  synced: "success",
  pending: "warning",
  error: "danger",
  stale: "muted",
};

const SYNC_DISPLAY: Record<SyncStatus, string> = {
  synced: "Synced",
  pending: "Pending",
  error: "Error",
  stale: "Stale",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BrokerImports() {
  const [imports, setImports] = useState<BrokerTripImport[]>(() => [
    ...MOCK_BROKER_IMPORTS,
  ]);
  const [activeTab, setActiveTab] = useState<BrokerTab>("all");
  const [search, setSearch] = useState("");

  // ---- Counts by broker ----
  const brokerCounts = useMemo(() => {
    const counts: Record<BrokerSystem, number> = {
      modivcare: 0,
      mtm: 0,
      saferide: 0,
      alivi: 0,
    };
    for (const imp of imports) {
      counts[imp.brokerSystem]++;
    }
    return counts;
  }, [imports]);

  // ---- Counts by status ----
  const statusCounts = useMemo(() => {
    const counts: Record<SyncStatus, number> = {
      synced: 0,
      pending: 0,
      error: 0,
      stale: 0,
    };
    for (const imp of imports) {
      counts[imp.syncStatus]++;
    }
    return counts;
  }, [imports]);

  // ---- Tabs config ----
  const tabs = useMemo(
    () => [
      { id: "all", label: "All", badge: imports.length },
      { id: "modivcare", label: "ModivCare", badge: brokerCounts.modivcare },
      { id: "mtm", label: "MTM", badge: brokerCounts.mtm },
      { id: "saferide", label: "SafeRide", badge: brokerCounts.saferide },
      { id: "alivi", label: "Alivi", badge: brokerCounts.alivi },
    ],
    [imports.length, brokerCounts]
  );

  // ---- Filtered rows ----
  const filtered = useMemo(() => {
    let result = imports;

    // Broker filter
    if (activeTab !== "all") {
      result = result.filter((imp) => imp.brokerSystem === activeTab);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (imp) =>
          imp.patient.name.toLowerCase().includes(q) ||
          imp.externalId.toLowerCase().includes(q) ||
          imp.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [imports, activeTab, search]);

  // ---- Actions ----
  function handleRetrySync(id: string) {
    setImports((prev) =>
      prev.map((imp) =>
        imp.id === id
          ? {
              ...imp,
              syncStatus: "synced" as const,
              lastSyncAt: new Date().toISOString(),
            }
          : imp
      )
    );
  }

  function handleMatchTrip(id: string) {
    const generated = `TRP-${Date.now().toString(36).toUpperCase()}`;
    setImports((prev) =>
      prev.map((imp) =>
        imp.id === id
          ? {
              ...imp,
              internalTripId: generated,
              syncStatus: "synced" as const,
              lastSyncAt: new Date().toISOString(),
            }
          : imp
      )
    );
  }

  function handleSyncAll() {
    setImports((prev) =>
      prev.map((imp) =>
        imp.syncStatus === "pending" || imp.syncStatus === "error"
          ? {
              ...imp,
              syncStatus: "synced" as const,
              lastSyncAt: new Date().toISOString(),
            }
          : imp
      )
    );
  }

  // ---- Render ----
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Trip Imports"
        description="View and manage incoming trip assignments from broker partners."
        actions={
          <>
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={handleSyncAll}>
              Sync All
            </Button>
          </>
        }
      />

      {/* Summary badges */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Badge variant="default">{imports.length} Total</Badge>
        <Badge variant="success">{statusCounts.synced} Synced</Badge>
        <Badge variant="warning">{statusCounts.pending} Pending</Badge>
        <Badge variant="danger">{statusCounts.error} Error</Badge>
        <Badge variant="muted">{statusCounts.stale} Stale</Badge>
      </div>

      {/* Broker tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as BrokerTab)}
        className="mb-4"
      />

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by patient name, external ID, or import ID..."
        className="mb-4 max-w-md"
      />

      {/* Import table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Import ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  External ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Broker
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Patient
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Route
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Requested
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  LOS
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Sync Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Internal Trip
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Last Synced
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    No imports match the current filters.
                  </td>
                </tr>
              )}
              {filtered.map((imp) => (
                <tr
                  key={imp.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-muted/50 transition-colors"
                >
                  {/* Import ID */}
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {imp.id}
                  </td>

                  {/* External ID */}
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {imp.externalId}
                  </td>

                  {/* Broker */}
                  <td className="px-4 py-3">
                    <Badge variant={BROKER_BADGE_VARIANT[imp.brokerSystem]}>
                      {BROKER_DISPLAY[imp.brokerSystem]}
                    </Badge>
                  </td>

                  {/* Patient */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-primary">
                      {imp.patient.name}
                    </span>
                    <span className="block text-xs text-text-muted">
                      {imp.patient.phone}
                    </span>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-text-secondary">
                      {imp.pickup.label}
                    </span>
                    <span className="text-xs text-text-muted mx-1">&rarr;</span>
                    <span className="text-xs text-text-secondary">
                      {imp.dropoff.label}
                    </span>
                  </td>

                  {/* Requested */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-text-primary">
                      {formatDate(imp.requestedDate)}
                    </span>
                    <span className="block text-xs text-text-muted">
                      {imp.requestedTime}
                    </span>
                  </td>

                  {/* LOS */}
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {capitalize(imp.levelOfService)}
                  </td>

                  {/* Sync Status */}
                  <td className="px-4 py-3">
                    <Badge variant={SYNC_BADGE_VARIANT[imp.syncStatus]}>
                      {SYNC_DISPLAY[imp.syncStatus]}
                    </Badge>
                  </td>

                  {/* Internal Trip */}
                  <td className="px-4 py-3">
                    {imp.internalTripId ? (
                      <span className="font-mono text-xs text-accent hover:underline cursor-pointer">
                        {imp.internalTripId}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">
                        Unmatched
                      </span>
                    )}
                  </td>

                  {/* Last Synced */}
                  <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                    {relativeTime(imp.lastSyncAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(imp.syncStatus === "pending" ||
                        imp.syncStatus === "error") && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRetrySync(imp.id)}
                        >
                          Retry Sync
                        </Button>
                      )}
                      {!imp.internalTripId && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleMatchTrip(imp.id)}
                        >
                          Match Trip
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
