"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Timeline } from "@/components/common/timeline";
import { ProgressBar } from "@/components/common/progress-bar";
import { MOCK_ACTIVE_TRACKINGS } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_HEADLINES: Record<string, string> = {
  driver_assigned: "Driver assigned",
  en_route_pickup: "En route to pickup",
  at_pickup: "Driver arrived!",
  in_transit: "Your ride is on the way!",
  at_dropoff: "Arriving at destination",
  completed: "Trip complete",
};

const STAGE_MAP: Record<string, number> = {
  driver_assigned: 1,
  en_route_pickup: 2,
  at_pickup: 3,
  in_transit: 4,
  at_dropoff: 5,
  completed: 6,
};

const STEP_LABELS = ["Assigned", "Pickup", "In Transit", "Arrived"] as const;
const STEP_STAGE_THRESHOLDS = [1, 3, 4, 5]; // stage values at which each step becomes active

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function driverInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TrackRide() {
  const tracking = MOCK_ACTIVE_TRACKINGS[0]; // James Washington - in_transit
  const [showShareToast, setShowShareToast] = useState(false);

  const stage = STAGE_MAP[tracking.status] ?? 1;
  const headline = STATUS_HEADLINES[tracking.status] ?? "Tracking your ride";

  // Timeline items from statusHistory
  const timelineItems = tracking.statusHistory.map((entry, i) => ({
    id: `sh-${i}`,
    label: entry.status,
    timestamp: formatTime(entry.timestamp),
    description: entry.description,
    status:
      i === tracking.statusHistory.length - 1
        ? ("active" as const)
        : ("completed" as const),
  }));

  function handleShareETA() {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  }

  return (
    <div className="max-w-md mx-auto pb-28">
      <PageHeader
        title="Track My Ride"
        description="Real-time location tracking for your current ride."
      />

      {/* ----------------------------------------------------------------- */}
      {/* Hero card                                                         */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4 text-center" padding="lg">
        <p className="text-lg font-semibold text-text-primary mb-1">
          {headline}
        </p>
        <p className="text-4xl font-bold text-accent">{tracking.etaMinutes} min</p>
        <p className="text-sm text-text-muted mt-1 mb-4">Estimated arrival</p>
        <ProgressBar
          value={stage}
          max={6}
          size="md"
          color="brand"
          className="mt-2"
        />
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Horizontal step indicator                                         */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4" padding="md">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const threshold = STEP_STAGE_THRESHOLDS[i];
            const isCompleted = stage > threshold;
            const isActive = stage === threshold;

            return (
              <div key={label} className="flex flex-col items-center flex-1">
                {/* Dot + connector row */}
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        stage >= threshold ? "bg-success" : "bg-surface-muted"
                      }`}
                    />
                  )}
                  <div
                    className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 ${
                      isCompleted
                        ? "bg-success border-success"
                        : isActive
                          ? "bg-accent border-accent ring-2 ring-accent-lightest"
                          : "bg-white border-border"
                    }`}
                  />
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        stage > threshold ? "bg-success" : "bg-surface-muted"
                      }`}
                    />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-[11px] mt-1.5 font-medium ${
                    isCompleted || isActive
                      ? "text-text-primary"
                      : "text-text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Map placeholder                                                   */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4" padding="none">
        <div className="flex flex-col items-center justify-center rounded-lg bg-surface-muted" style={{ height: 240 }}>
          <svg
            className="w-8 h-8 text-text-muted mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <p className="text-sm font-semibold text-text-primary">Live Map</p>
          <p className="text-xs text-text-muted mt-0.5">
            Driver location updating...
          </p>
          <p className="text-[10px] text-text-muted mt-2">
            {tracking.driverLat.toFixed(4)}, {tracking.driverLng.toFixed(4)}
          </p>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Driver info                                                       */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4" padding="md">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white text-lg font-bold shrink-0">
            {driverInitials(tracking.driverName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              {tracking.driverName}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {tracking.vehicleDescription}
            </p>
            <p className="text-xs text-text-muted">{tracking.providerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            Call Driver
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            Message
          </Button>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Trip details                                                      */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4" padding="md">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Trip Details
        </h3>

        {/* Pickup */}
        <div className="flex items-start gap-2 mb-3">
          <span className="mt-1 block w-2.5 h-2.5 rounded-full bg-success shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted">Pickup</p>
            <p className="text-sm text-text-primary">{tracking.pickupAddress}</p>
          </div>
        </div>

        {/* Dropoff */}
        <div className="flex items-start gap-2 mb-4">
          <span className="mt-1 block w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted">Dropoff</p>
            <p className="text-sm text-text-primary">
              {tracking.dropoffAddress}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-text-muted">Scheduled</p>
            <p className="font-medium text-text-primary">
              {formatDateTime(tracking.scheduledTime)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Level of Service</p>
            <Badge variant="brand">{tracking.levelOfService}</Badge>
          </div>
        </div>

        <p className="text-xs text-text-muted mt-3">
          Trip ID: {tracking.tripId}
        </p>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Status timeline                                                   */}
      {/* ----------------------------------------------------------------- */}
      <Card className="mb-4" padding="md">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Status Timeline
        </h3>
        <Timeline items={timelineItems} />
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Bottom sticky action bar                                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto bg-white border-t border-border px-4 py-3 flex gap-3">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={handleShareETA}
          >
            Share My ETA
          </Button>
          <Button variant="ghost" size="md" className="flex-1 !text-danger">
            Cancel Ride
          </Button>
        </div>
      </div>

      {/* Toast notification */}
      {showShareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-text-primary text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-pulse">
          ETA link copied to clipboard
        </div>
      )}
    </div>
  );
}
