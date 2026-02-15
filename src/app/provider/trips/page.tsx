"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";

type StatusFilter = "all" | "active" | "completed" | "cancelled";

const tripHistory = [
  {
    id: "trip-2002",
    patient: "James Washington",
    status: "In Transit",
    statusVariant: "brand" as const,
    pickup: "Home - 4422 W Glendale Ave",
    dropoff: "Banner University Medical Center",
    driver: "Sarah Johnson",
    vehicle: "V-102 (Mercedes Sprinter)",
    date: "Today",
    time: "10:30 AM",
    cost: 26.0,
    channel: "Marketplace",
    channelVariant: "success" as const,
  },
  {
    id: "trip-2003",
    patient: "Robert Kim",
    status: "En Route",
    statusVariant: "info" as const,
    pickup: "Home - 2100 E Camelback Rd",
    dropoff: "Mayo Clinic Phoenix",
    driver: "Lisa Park",
    vehicle: "V-104 (Toyota Sienna)",
    date: "Today",
    time: "1:00 PM",
    cost: 34.0,
    channel: "TNC",
    channelVariant: "info" as const,
  },
  {
    id: "trip-2004",
    patient: "Dorothy Chen",
    status: "Assigned",
    statusVariant: "info" as const,
    pickup: "Home - 7801 E Osborn Rd",
    dropoff: "St. Joseph's Hospital",
    driver: "Angela Torres",
    vehicle: "V-108 (Stretcher Van)",
    date: "Today",
    time: "2:30 PM",
    cost: 42.0,
    channel: "Fleet",
    channelVariant: "brand" as const,
  },
  {
    id: "trip-2001",
    patient: "Maria Gonzalez",
    status: "Completed",
    statusVariant: "success" as const,
    pickup: "Home - 3155 W Van Buren St",
    dropoff: "Kaiser Permanente Central",
    driver: "Carlos Mendez",
    vehicle: "V-101 (Ford Transit)",
    date: "2 days ago",
    time: "8:00 AM",
    cost: 16.0,
    channel: "Fleet",
    channelVariant: "brand" as const,
  },
  {
    id: "trip-2007",
    patient: "James Washington",
    status: "No Show",
    statusVariant: "danger" as const,
    pickup: "Home - 4422 W Glendale Ave",
    dropoff: "Mayo Clinic Phoenix",
    driver: "Desert Care Rides",
    vehicle: "V-MP-045",
    date: "Yesterday",
    time: "7:30 AM",
    cost: 35.0,
    channel: "Marketplace",
    channelVariant: "success" as const,
  },
  {
    id: "trip-2006",
    patient: "Robert Kim",
    status: "Cancelled",
    statusVariant: "danger" as const,
    pickup: "Home - 2100 E Camelback Rd",
    dropoff: "Banner University Medical Center",
    driver: "—",
    vehicle: "—",
    date: "3 days ago",
    time: "9:00 AM",
    cost: 0,
    channel: "—",
    channelVariant: "muted" as const,
  },
];

export default function ProviderTrips() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = tripHistory.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["In Transit", "En Route", "Assigned"].includes(t.status);
    if (filter === "completed") return t.status === "Completed";
    if (filter === "cancelled")
      return ["Cancelled", "No Show"].includes(t.status);
    return true;
  });

  const activeCount = tripHistory.filter((t) =>
    ["In Transit", "En Route", "Assigned"].includes(t.status)
  ).length;
  const completedCount = tripHistory.filter(
    (t) => t.status === "Completed"
  ).length;

  return (
    <div>
      <PageHeader
        title="Trip History"
        description="View completed, active, and scheduled trips for your organization."
        actions={
          <div className="flex gap-2">
            <Badge variant="brand">{activeCount} Active</Badge>
            <Badge variant="success">{completedCount} Completed</Badge>
            <Button variant="secondary" size="sm">
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { value: "all", label: "All Trips" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled / No Show" },
          ] as { value: StatusFilter; label: string }[]
        ).map((f) => (
          <button
            key={f.value}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filter === f.value
                ? "bg-brand text-white border-brand"
                : "bg-white text-text-secondary border-border hover:bg-surface-muted"
            }`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="pb-2 pr-4 font-medium">Trip ID</th>
                <th className="pb-2 pr-4 font-medium">Patient</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Route</th>
                <th className="pb-2 pr-4 font-medium">Driver / Vehicle</th>
                <th className="pb-2 pr-4 font-medium">Channel</th>
                <th className="pb-2 pr-4 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-border last:border-0 hover:bg-surface-muted/50 cursor-pointer"
                >
                  <td className="py-3 pr-4 font-medium text-accent">{trip.id}</td>
                  <td className="py-3 pr-4 text-text-primary">{trip.patient}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={trip.statusVariant}>{trip.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary text-xs">
                    <p>{trip.pickup}</p>
                    <p className="text-text-muted">&rarr; {trip.dropoff}</p>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary text-xs">
                    <p>{trip.driver}</p>
                    <p className="text-text-muted">{trip.vehicle}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={trip.channelVariant}>{trip.channel}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary text-xs">
                    <p>{trip.date}</p>
                    <p className="text-text-muted">{trip.time}</p>
                  </td>
                  <td className="py-3 text-right font-medium text-text-primary">
                    {trip.cost > 0 ? `$${trip.cost.toFixed(2)}` : "—"}
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
