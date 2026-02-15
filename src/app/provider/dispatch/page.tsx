"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";

// ---------------------------------------------------------------------------
// Inline mock data
// ---------------------------------------------------------------------------

type ActiveTripStatus = "en_route_pickup" | "in_transit" | "picked_up";

interface ActiveTrip {
  id: string;
  driverName: string;
  vehicleId: string;
  vehicleType: string;
  patientName: string;
  status: ActiveTripStatus;
  pickup: string;
  dropoff: string;
}

const activeTrips: ActiveTrip[] = [
  {
    id: "TRP-4010",
    driverName: "Carlos Mendez",
    vehicleId: "V-101",
    vehicleType: "WAV Van",
    patientName: "Maria Gonzalez",
    status: "en_route_pickup",
    pickup: "Home - 1420 Oak Ave",
    dropoff: "Kaiser Permanente",
  },
  {
    id: "TRP-4011",
    driverName: "Sarah Johnson",
    vehicleId: "V-102",
    vehicleType: "WAV Van",
    patientName: "James Washington",
    status: "in_transit",
    pickup: "Home - 800 Elm St",
    dropoff: "Banner Medical Center",
  },
  {
    id: "TRP-4012",
    driverName: "Lisa Park",
    vehicleId: "V-104",
    vehicleType: "Minivan",
    patientName: "Robert Kim",
    status: "picked_up",
    pickup: "Sunrise Assisted Living",
    dropoff: "Mayo Clinic",
  },
  {
    id: "TRP-4013",
    driverName: "Angela Torres",
    vehicleId: "V-107",
    vehicleType: "Sedan",
    patientName: "Dorothy Chen",
    status: "en_route_pickup",
    pickup: "Home - 555 Maple Dr",
    dropoff: "St. Joseph's Hospital",
  },
];

interface UnassignedTrip {
  id: string;
  patientName: string;
  levelOfService: string;
  pickupTime: string;
  pickup: string;
  dropoff: string;
  note?: string;
}

const unassignedTrips: UnassignedTrip[] = [
  {
    id: "TRP-4020",
    patientName: "Maria Gonzalez",
    levelOfService: "Wheelchair",
    pickupTime: "4:00 PM",
    pickup: "Kaiser Permanente",
    dropoff: "Home - 1420 Oak Ave",
    note: "Return trip",
  },
  {
    id: "TRP-4021",
    patientName: "Helen Park",
    levelOfService: "Stretcher",
    pickupTime: "3:30 PM",
    pickup: "Valley General Hospital",
    dropoff: "Pineview Assisted Living",
    note: "New patient",
  },
];

type VehicleStatusType = "available" | "on_trip" | "maintenance" | "off_duty";

interface VehicleSummary {
  id: string;
  label: string;
  type: string;
  status: VehicleStatusType;
  driver?: string;
}

const vehicleFleet: VehicleSummary[] = [
  { id: "V-101", label: "V-101", type: "WAV Van", status: "on_trip", driver: "Carlos Mendez" },
  { id: "V-102", label: "V-102", type: "WAV Van", status: "on_trip", driver: "Sarah Johnson" },
  { id: "V-103", label: "V-103", type: "WAV Van", status: "available" },
  { id: "V-104", label: "V-104", type: "Minivan", status: "on_trip", driver: "Lisa Park" },
  { id: "V-105", label: "V-105", type: "Sedan", status: "available" },
  { id: "V-106", label: "V-106", type: "Sedan", status: "maintenance" },
  { id: "V-107", label: "V-107", type: "Sedan", status: "on_trip", driver: "Angela Torres" },
  { id: "V-108", label: "V-108", type: "Stretcher Van", status: "off_duty" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusBadge: Record<ActiveTripStatus, { label: string; variant: "info" | "brand" | "success" }> = {
  en_route_pickup: { label: "En Route to Pickup", variant: "info" },
  in_transit: { label: "In Transit", variant: "brand" },
  picked_up: { label: "Picked Up", variant: "success" },
};

const vehicleStatusColor: Record<VehicleStatusType, string> = {
  available: "bg-green-500",
  on_trip: "bg-blue-500",
  maintenance: "bg-red-500",
  off_duty: "bg-gray-400",
};

const vehicleStatusLabel: Record<VehicleStatusType, string> = {
  available: "Available",
  on_trip: "On Trip",
  maintenance: "Maintenance",
  off_duty: "Off Duty",
};

type TabKey = "map" | "list" | "timeline";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DispatchBoard() {
  const [activeTab, setActiveTab] = useState<TabKey>("map");

  return (
    <div>
      <PageHeader
        title="Dispatch Board"
        description="Real-time fleet management and trip assignment."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Refresh
            </Button>
            <Button size="sm">Add Trip</Button>
          </div>
        }
      />

      {/* ----- Tabs Row ----- */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {([
          { key: "map" as TabKey, label: "Map View" },
          { key: "list" as TabKey, label: "List View" },
          { key: "timeline" as TabKey, label: "Timeline" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
              activeTab === tab.key
                ? "border-b-2 border-accent text-accent"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ----- Tab Content Placeholder ----- */}
      {activeTab === "map" && (
        <Card className="mb-6">
          <div className="flex items-center justify-center h-48 bg-surface-muted/40 rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-2xl mb-1">🗺</p>
              <p className="text-sm font-medium text-text-secondary">
                Live Map View
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Vehicle tracking map would render here
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "list" && (
        <Card className="mb-6">
          <div className="flex items-center justify-center h-48 bg-surface-muted/40 rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-2xl mb-1">📋</p>
              <p className="text-sm font-medium text-text-secondary">
                List View
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Sortable trip list would render here
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "timeline" && (
        <Card className="mb-6">
          <div className="flex items-center justify-center h-48 bg-surface-muted/40 rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-2xl mb-1">📅</p>
              <p className="text-sm font-medium text-text-secondary">
                Timeline View
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Gantt-style trip timeline would render here
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ----- Active Trips ----- */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Active Trips
            </h2>
            <Badge variant="brand">{activeTrips.length} Active</Badge>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-text-muted">Driver</th>
                <th className="pb-2 pr-4 font-medium text-text-muted">Vehicle</th>
                <th className="pb-2 pr-4 font-medium text-text-muted">Patient</th>
                <th className="pb-2 pr-4 font-medium text-text-muted">Status</th>
                <th className="pb-2 pr-4 font-medium text-text-muted">Route</th>
                <th className="pb-2 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeTrips.map((trip) => {
                const badge = statusBadge[trip.status];
                return (
                  <tr key={trip.id} className="group hover:bg-surface-muted/30">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-text-primary">
                        {trip.driverName}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-primary">{trip.vehicleId}</span>
                        <span className="text-xs text-text-muted">
                          ({trip.vehicleType})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {trip.patientName}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-text-secondary">
                        {trip.pickup}{" "}
                        <span className="text-text-muted">&rarr;</span>{" "}
                        {trip.dropoff}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Actions &#9662;
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ----- Unassigned Trips ----- */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Unassigned Trips
            </h2>
            <Badge variant="warning">{unassignedTrips.length} Pending</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {unassignedTrips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-lg border border-border p-4 hover:border-accent-light transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary">
                      {trip.patientName}
                    </span>
                    {trip.note && (
                      <Badge variant="muted">{trip.note}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Badge variant="brand">{trip.levelOfService}</Badge>
                    </span>
                    <span>Pickup: {trip.pickupTime}</span>
                    <span>
                      {trip.pickup}{" "}
                      <span className="text-text-muted">&rarr;</span>{" "}
                      {trip.dropoff}
                    </span>
                  </div>
                </div>
                <Button size="sm">Assign</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ----- Vehicle Status Summary ----- */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Vehicle Status
          </h2>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {(
              [
                ["available", "Available"],
                ["on_trip", "On Trip"],
                ["maintenance", "Maintenance"],
                ["off_duty", "Off Duty"],
              ] as const
            ).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${vehicleStatusColor[key]}`}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vehicleFleet.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <span
                className={`inline-block h-3 w-3 rounded-full shrink-0 ${vehicleStatusColor[v.status]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-text-primary text-sm">
                    {v.label}
                  </span>
                  <span className="text-xs text-text-muted">{v.type}</span>
                </div>
                <p className="text-xs text-text-muted truncate">
                  {v.driver
                    ? v.driver
                    : vehicleStatusLabel[v.status]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
          <span className="text-text-muted">Fleet summary</span>
          <span className="font-semibold text-text-primary">
            {vehicleFleet.filter((v) => v.status === "on_trip").length} on trip
            {" "}&middot;{" "}
            {vehicleFleet.filter((v) => v.status === "available").length} available
            {" "}&middot;{" "}
            {vehicleFleet.filter((v) => v.status === "maintenance").length} maintenance
            {" "}&middot;{" "}
            {vehicleFleet.filter((v) => v.status === "off_duty").length} off duty
          </span>
        </div>
      </Card>
    </div>
  );
}
