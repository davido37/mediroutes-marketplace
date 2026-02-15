"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { StarRating } from "@/components/common/star-rating";

type TripStatus = "upcoming" | "completed" | "in_progress" | "cancelled";
type FilterTab = "all" | "upcoming" | "completed" | "cancelled";

interface Trip {
  id: string;
  date: string;
  time: string;
  status: TripStatus;
  pickup: string;
  dropoff: string;
  driver: string;
  vehicle: string;
  cost: number;
  costLabel?: string;
  defaultRating?: number;
}

const statusConfig: Record<
  TripStatus,
  { label: string; variant: "info" | "success" | "brand" | "danger" }
> = {
  upcoming: { label: "Upcoming", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In Progress", variant: "brand" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

function getRelativeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const today = getRelativeDate(0);

const trips: Trip[] = [
  {
    id: "t1",
    date: today,
    time: "2:30 PM",
    status: "upcoming",
    pickup: "Home",
    dropoff: "Mayo Clinic",
    driver: "Lisa Park",
    vehicle: "Toyota Sienna",
    cost: 0,
    costLabel: "Covered",
  },
  {
    id: "t2",
    date: today,
    time: "10:30 AM",
    status: "completed",
    pickup: "Home",
    dropoff: "Banner University Medical Center",
    driver: "Sarah Johnson",
    vehicle: "Mercedes Sprinter",
    cost: 5,
    costLabel: "$5 copay",
    defaultRating: 5,
  },
  {
    id: "t3",
    date: getRelativeDate(1),
    time: "3:15 PM",
    status: "completed",
    pickup: "Kaiser Permanente",
    dropoff: "Home",
    driver: "Carlos Mendez",
    vehicle: "Ford Transit",
    cost: 0,
    costLabel: "Covered",
    defaultRating: 4,
  },
  {
    id: "t4",
    date: getRelativeDate(3),
    time: "7:00 AM",
    status: "completed",
    pickup: "Home",
    dropoff: "Desert Springs Dialysis Center",
    driver: "Angela Torres",
    vehicle: "Honda Odyssey",
    cost: 0,
    costLabel: "Covered",
    defaultRating: 5,
  },
  {
    id: "t5",
    date: getRelativeDate(5),
    time: "9:45 AM",
    status: "cancelled",
    pickup: "Home",
    dropoff: "St Joseph's Hospital",
    driver: "\u2014",
    vehicle: "\u2014",
    cost: 0,
    costLabel: "Covered",
  },
  {
    id: "t6",
    date: getRelativeDate(7),
    time: "1:00 PM",
    status: "completed",
    pickup: "Banner University Medical Center",
    dropoff: "Home",
    driver: "David Nguyen",
    vehicle: "Chrysler Pacifica",
    cost: 0,
    costLabel: "Covered",
    defaultRating: 4,
  },
];

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function TripHistory() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    trips.forEach((t) => {
      if (t.defaultRating) initial[t.id] = t.defaultRating;
    });
    return initial;
  });
  const [cancelledTrips, setCancelledTrips] = useState<Set<string>>(new Set());

  const filtered =
    filter === "all"
      ? trips
      : trips.filter((t) => {
          if (cancelledTrips.has(t.id)) return filter === "cancelled";
          return t.status === filter;
        });

  const effectiveStatus = (trip: Trip): TripStatus =>
    cancelledTrips.has(trip.id) ? "cancelled" : trip.status;

  function handleCancel(tripId: string) {
    setCancelledTrips((prev) => new Set(prev).add(tripId));
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="Trip History"
        description={`${trips.length} trips`}
      />

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 bg-surface-muted rounded-lg p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trip Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-text-muted">
              No {filter === "all" ? "" : filter} trips to display.
            </p>
          </Card>
        )}

        {filtered.map((trip) => {
          const status = effectiveStatus(trip);
          const config = statusConfig[status];

          return (
            <Card key={trip.id} padding="md">
              {/* Header row: date/time + status badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">
                  {trip.date} at {trip.time}
                </span>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">{trip.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                    <span className="truncate">{trip.dropoff}</span>
                  </div>
                </div>
              </div>

              {/* Driver + vehicle + cost */}
              {status !== "cancelled" && (
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span>
                    {trip.driver} &middot; {trip.vehicle}
                  </span>
                  <span className="font-medium">
                    {trip.cost === 0 ? (
                      <span className="text-green-700">$0 (Covered)</span>
                    ) : (
                      <span className="text-text-primary">
                        ${trip.cost.toFixed(2)} copay
                      </span>
                    )}
                  </span>
                </div>
              )}

              {status === "cancelled" && (
                <div className="text-xs text-text-muted mb-2">
                  Trip was cancelled
                </div>
              )}

              {/* Rating for completed trips */}
              {status === "completed" && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-text-muted">Your rating:</span>
                  <StarRating
                    rating={ratings[trip.id] ?? 0}
                    size="sm"
                    showValue={false}
                    interactive
                    onChange={(r) =>
                      setRatings((prev) => ({ ...prev, [trip.id]: r }))
                    }
                  />
                </div>
              )}

              {/* Cancel button for upcoming trips */}
              {status === "upcoming" && (
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:text-red-700"
                    onClick={() => handleCancel(trip.id)}
                  >
                    Cancel Trip
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
