"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { MOCK_FACILITY_TRIPS } from "@/lib/mock-data";
import { formatCurrency, formatTime, getOptionLabel, getOptionCost } from "@/lib/utils";
import { TripStatus } from "@/lib/types";

const statusConfig: Record<
  TripStatus,
  { label: string; variant: "success" | "info" | "warning" | "danger" | "brand" | "muted" | "default" }
> = {
  requested: { label: "Requested", variant: "warning" },
  authorized: { label: "Authorized", variant: "brand" },
  assigned: { label: "Assigned", variant: "info" },
  dispatched: { label: "Dispatched", variant: "info" },
  en_route_pickup: { label: "En Route", variant: "info" },
  arrived_pickup: { label: "At Pickup", variant: "info" },
  picked_up: { label: "Picked Up", variant: "brand" },
  in_transit: { label: "In Transit", variant: "brand" },
  arrived_dropoff: { label: "At Dropoff", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  no_show: { label: "No Show", variant: "danger" },
};

function getProviderName(trip: (typeof MOCK_FACILITY_TRIPS)[number]): string {
  if (trip.fulfillment) return getOptionLabel(trip.fulfillment);
  return "Unassigned";
}

function getCost(trip: (typeof MOCK_FACILITY_TRIPS)[number]): string {
  if (trip.fulfillment) return formatCurrency(getOptionCost(trip.fulfillment));
  return "\u2014";
}

export default function FacilityDashboard() {
  const router = useRouter();
  const trips = MOCK_FACILITY_TRIPS;

  const activeStatuses: TripStatus[] = [
    "dispatched",
    "en_route_pickup",
    "arrived_pickup",
    "picked_up",
    "in_transit",
    "arrived_dropoff",
  ];
  const pendingStatuses: TripStatus[] = ["requested", "authorized"];

  const todayTrips = trips.length;
  const pendingCount = trips.filter((t) => pendingStatuses.includes(t.status)).length;
  const activeCount = trips.filter((t) => activeStatuses.includes(t.status)).length;

  const dischargeAlerts = [
    {
      id: "DC-1102",
      patient: "Helen Park",
      room: "Room 412B",
      time: "3:30 PM",
      destination: "Sunrise Assisted Living",
      los: "Wheelchair",
    },
    {
      id: "DC-1103",
      patient: "William Turner",
      room: "Room 208A",
      time: "4:15 PM",
      destination: "Home - 1425 Oak Street",
      los: "Stretcher",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Facility Dashboard"
        description="Valley Medical Center — Manage patient transportation and discharge coordination."
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/facility/ehr")}
            >
              EHR Discharge Queue
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/facility/new-trip?token=abc123")}
            >
              + New Trip
            </Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today's Trips"
          value={todayTrips}
          change="+3 from yesterday"
          changeType="positive"
          icon="🚐"
        />
        <StatCard
          label="Pending Bookings"
          value={pendingCount}
          change={pendingCount > 2 ? `${pendingCount - 1} expiring soon` : "All on track"}
          changeType={pendingCount > 2 ? "negative" : "positive"}
          icon="⏳"
        />
        <StatCard
          label="Active Transports"
          value={activeCount}
          change="All on time"
          changeType="positive"
          icon="📍"
        />
        <StatCard
          label="Avg Wait Time"
          value="14 min"
          change="-2 min vs last week"
          changeType="positive"
          icon="⏱"
        />
      </div>

      {/* Recent Trips */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Trips</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/facility/trips")}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="pb-2 pr-4 font-medium">Trip ID</th>
                <th className="pb-2 pr-4 font-medium">Patient</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Pickup Time</th>
                <th className="pb-2 pr-4 font-medium">Provider</th>
                <th className="pb-2 pr-4 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const { label, variant } = statusConfig[trip.status];
                return (
                  <tr
                    key={trip.id}
                    className="border-b border-border last:border-0 hover:bg-surface-muted/50 cursor-pointer"
                    onClick={() => router.push(`/facility/trips/${trip.id}`)}
                  >
                    <td className="py-3 pr-4 font-medium text-accent">
                      {trip.id}
                    </td>
                    <td className="py-3 pr-4 text-text-primary">
                      {trip.request.patient.firstName} {trip.request.patient.lastName}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={variant}>{label}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {formatTime(trip.request.requestedTime)}
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {getProviderName(trip)}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">
                      {getCost(trip)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EHR Discharge Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">EHR Discharge Alerts</h2>
            <Badge variant="warning">{dischargeAlerts.length} Pending</Badge>
          </div>
          <div className="space-y-3">
            {dischargeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between rounded-lg border border-warning-light bg-warning-light/20 p-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary">{alert.patient}</span>
                    <Badge variant="muted">{alert.room}</Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    Discharge {alert.time} &rarr; {alert.destination}
                  </p>
                  <Badge variant="brand" className="mt-1.5">
                    {alert.los}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/facility/new-trip?token=abc123")}
                >
                  Book Transport
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors"
              onClick={() => router.push("/facility/new-trip?token=abc123")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
                +
              </span>
              <div>
                <p className="font-medium text-text-primary">New Trip</p>
                <p className="text-xs text-text-muted">
                  Create a new patient transport request
                </p>
              </div>
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors"
              onClick={() => router.push("/facility/ehr")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-lg">
                📋
              </span>
              <div>
                <p className="font-medium text-text-primary">EHR Discharge Queue</p>
                <p className="text-xs text-text-muted">
                  View pending discharges and auto-book transports
                </p>
              </div>
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors"
              onClick={() => router.push("/facility/tracking")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-lg">
                📍
              </span>
              <div>
                <p className="font-medium text-text-primary">Track All Rides</p>
                <p className="text-xs text-text-muted">
                  Real-time tracking for all active transports
                </p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
