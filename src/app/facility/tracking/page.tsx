"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Timeline } from "@/components/common/timeline";
import { SearchInput } from "@/components/common/search-input";
import { ProgressBar } from "@/components/common/progress-bar";
import { MOCK_ACTIVE_TRACKINGS } from "@/lib/mock-data";
import type { ActiveTracking } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type TrackingStatus = ActiveTracking["status"];

const STATUS_BADGE_VARIANT: Record<
  TrackingStatus,
  "info" | "brand" | "warning" | "success" | "muted"
> = {
  driver_assigned: "info",
  en_route_pickup: "brand",
  at_pickup: "warning",
  in_transit: "success",
  at_dropoff: "success",
  completed: "muted",
};

const CHANNEL_BADGE_VARIANT: Record<string, "brand" | "success" | "info"> = {
  Fleet: "brand",
  Marketplace: "success",
  TNC: "info",
};

const STATUS_ORDER: TrackingStatus[] = [
  "driver_assigned",
  "en_route_pickup",
  "at_pickup",
  "in_transit",
  "at_dropoff",
  "completed",
];

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ${diffMin % 60}m ago`;
}

function progressForStatus(status: TrackingStatus): number {
  const idx = STATUS_ORDER.indexOf(status);
  if (idx < 0) return 0;
  // 6 stages total -> percentage out of 100
  return Math.round(((idx + 1) / STATUS_ORDER.length) * 100);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function TrackRides() {
  const [search, setSearch] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string>(
    MOCK_ACTIVE_TRACKINGS[0]?.tripId ?? ""
  );

  // ------- filtered list -------
  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_ACTIVE_TRACKINGS;
    const q = search.toLowerCase();
    return MOCK_ACTIVE_TRACKINGS.filter(
      (t) =>
        t.patientName.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.tripId.toLowerCase().includes(q)
    );
  }, [search]);

  // ------- summary counts -------
  const counts = useMemo(() => {
    const all = MOCK_ACTIVE_TRACKINGS;
    return {
      active: all.filter((t) => t.status !== "completed").length,
      enRoute: all.filter((t) => t.status === "en_route_pickup").length,
      atPickup: all.filter((t) => t.status === "at_pickup").length,
      inTransit: all.filter((t) => t.status === "in_transit").length,
    };
  }, []);

  const selected = MOCK_ACTIVE_TRACKINGS.find(
    (t) => t.tripId === selectedTripId
  );

  return (
    <div>
      {/* ---------- header ---------- */}
      <PageHeader
        title="Track Rides"
        description="Real-time tracking for all active patient transports."
      />

      {/* ---------- summary badges ---------- */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Badge variant="brand">{counts.active} Active</Badge>
        <Badge variant="info">{counts.enRoute} En Route</Badge>
        <Badge variant="warning">{counts.atPickup} At Pickup</Badge>
        <Badge variant="success">{counts.inTransit} In Transit</Badge>
      </div>

      {/* ---------- search ---------- */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by patient, driver, or trip ID..."
        className="mb-5"
      />

      {/* ---------- two-column layout ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ====== LEFT: Active rides list ====== */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <Card>
              <p className="text-sm text-text-muted text-center py-4">
                No rides match your search.
              </p>
            </Card>
          )}

          {filtered.map((t) => (
            <Card
              key={t.tripId}
              hover
              onClick={() => setSelectedTripId(t.tripId)}
              className={
                selectedTripId === t.tripId
                  ? "ring-2 ring-accent border-accent"
                  : ""
              }
            >
              {/* patient + trip id */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-bold text-text-primary">
                    {t.patientName}
                  </span>
                  <span className="ml-2 text-xs text-accent font-medium">
                    {t.tripId}
                  </span>
                </div>
                <Badge variant={STATUS_BADGE_VARIANT[t.status]}>
                  {formatStatusLabel(t.status)}
                </Badge>
              </div>

              {/* driver info */}
              <p className="text-xs text-text-secondary mb-1">
                <span className="font-medium">{t.driverName}</span>
                {" \u00B7 "}
                {t.driverPhone}
              </p>
              <p className="text-xs text-text-muted mb-2">
                {t.vehicleDescription}
              </p>

              {/* route */}
              <p className="text-xs text-text-secondary mb-2">
                {t.pickupLabel}{" "}
                <span className="text-text-muted">&rarr;</span>{" "}
                {t.dropoffLabel}
              </p>

              {/* ETA + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-text-primary">
                  {t.etaMinutes < 2 ? "Arriving" : `${t.etaMinutes} min`}
                </span>
                <Badge
                  variant={
                    CHANNEL_BADGE_VARIANT[t.channel] ?? "muted"
                  }
                >
                  {t.channel}
                </Badge>
                <Badge variant="muted">{t.levelOfService}</Badge>
                <span className="ml-auto text-[11px] text-text-muted">
                  {relativeTime(t.lastUpdated)}
                </span>
              </div>

              {/* view details button */}
              <div className="mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTripId(t.tripId);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* ====== RIGHT: Selected ride detail ====== */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card padding="lg">
              {/* map placeholder */}
              <div className="rounded-lg border border-border bg-surface-muted flex items-center justify-center h-[200px] mb-5 text-xs text-text-muted">
                Map: driver at {selected.driverLat.toFixed(4)},{" "}
                {selected.driverLng.toFixed(4)} &rarr; dropoff{" "}
                {selected.dropoffLat.toFixed(4)},{" "}
                {selected.dropoffLng.toFixed(4)}
              </div>

              {/* patient + trip id */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-text-primary">
                  {selected.patientName}
                </h2>
                <span className="text-sm text-accent font-medium">
                  {selected.tripId}
                </span>
              </div>

              {/* ETA countdown + progress */}
              <div className="mb-5">
                <p className="text-2xl font-bold text-text-primary mb-1">
                  {selected.etaMinutes < 2
                    ? "Arriving now"
                    : `${selected.etaMinutes} min`}
                </p>
                <p className="text-xs text-text-muted mb-2">
                  ETA to{" "}
                  {selected.status === "en_route_pickup" ||
                  selected.status === "driver_assigned"
                    ? "pickup"
                    : "dropoff"}
                </p>
                <ProgressBar
                  value={progressForStatus(selected.status)}
                  max={100}
                  label="Trip progress"
                  showValue
                  color="brand"
                />
              </div>

              {/* driver info card */}
              <Card className="mb-5" padding="sm">
                <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">
                  Driver
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {selected.driverName}
                </p>
                <p className="text-xs text-text-secondary">
                  {selected.driverPhone}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {selected.vehicleDescription}
                </p>
              </Card>

              {/* provider & channel */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-text-secondary">
                  Provider:{" "}
                  <span className="font-medium text-text-primary">
                    {selected.providerName}
                  </span>
                </span>
                <Badge
                  variant={
                    CHANNEL_BADGE_VARIANT[selected.channel] ?? "muted"
                  }
                >
                  {selected.channel}
                </Badge>
                <Badge variant="muted">{selected.levelOfService}</Badge>
              </div>

              {/* timeline */}
              <div className="mb-5">
                <p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wide">
                  Status History
                </p>
                <Timeline
                  items={selected.statusHistory.map((entry, idx) => ({
                    id: String(idx),
                    label: entry.status,
                    timestamp: formatTime(entry.timestamp),
                    description: entry.description,
                    status:
                      idx === selected.statusHistory.length - 1
                        ? ("active" as const)
                        : ("completed" as const),
                  }))}
                />
              </div>

              {/* action buttons */}
              <div className="flex gap-3">
                <Button variant="secondary">Contact Driver</Button>
                <Button variant="ghost" className="text-danger">
                  Cancel Trip
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-sm text-text-muted text-center py-12">
                Select a ride to view details.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
