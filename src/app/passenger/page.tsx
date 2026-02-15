"use client";

import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { StarRating } from "@/components/common/star-rating";

const upcomingRide = {
  destination: "Valley Dialysis Center",
  address: "2200 N Central Ave, Phoenix, AZ",
  date: "Today, Feb 10",
  time: "2:15 PM",
  status: "Driver En Route",
  statusBadge: "info" as const,
  driver: "Carlos M.",
  vehicle: "White Toyota Sienna",
  eta: "8 min",
};

const quickActions = [
  {
    label: "Book a Ride",
    description: "Schedule a new trip",
    icon: "🚐",
    bg: "bg-brand-lightest",
  },
  {
    label: "My Rides",
    description: "View upcoming trips",
    icon: "📅",
    bg: "bg-info-light",
  },
  {
    label: "Profile",
    description: "Update your info",
    icon: "👤",
    bg: "bg-success-light",
  },
  {
    label: "Eligibility",
    description: "Check your coverage",
    icon: "✓",
    bg: "bg-warning-light",
  },
];

const recentTrips = [
  {
    id: "TR-3310",
    destination: "Valley Dialysis Center",
    date: "Feb 7, 2026",
    driver: "Carlos M.",
    rating: 5,
    status: "Completed",
    statusBadge: "success" as const,
  },
  {
    id: "TR-3288",
    destination: "Banner Health - Cardiology",
    date: "Feb 5, 2026",
    driver: "Sarah K.",
    rating: 4,
    status: "Completed",
    statusBadge: "success" as const,
  },
  {
    id: "TR-3265",
    destination: "Valley Dialysis Center",
    date: "Feb 3, 2026",
    driver: "Mike R.",
    rating: 5,
    status: "Completed",
    statusBadge: "success" as const,
  },
];

export default function PassengerHome() {
  return (
    <div className="max-w-md mx-auto pb-8">
      {/* Welcome Header */}
      <div className="mb-6 pt-2">
        <p className="text-sm text-text-muted">Good afternoon,</p>
        <h1 className="text-2xl font-bold text-text-primary">Maria</h1>
      </div>

      {/* Upcoming Ride */}
      <Card className="mb-6 border-accent/30 bg-gradient-to-b from-brand-lightest/30 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Upcoming Ride</h2>
          <Badge variant={upcomingRide.statusBadge}>{upcomingRide.status}</Badge>
        </div>
        <div className="mb-3">
          <p className="text-base font-medium text-text-primary">
            {upcomingRide.destination}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{upcomingRide.address}</p>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <p className="text-text-secondary">
              {upcomingRide.date} at {upcomingRide.time}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-accent">ETA: {upcomingRide.eta}</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white border border-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lightest text-lg font-semibold text-accent">
              {upcomingRide.driver.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{upcomingRide.driver}</p>
              <p className="text-xs text-text-muted">{upcomingRide.vehicle}</p>
            </div>
          </div>
          <Button size="sm">Track</Button>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-4 text-center hover:bg-surface-muted/50 transition-colors"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full ${action.bg} text-xl`}
            >
              {action.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">{action.label}</p>
              <p className="text-xs text-text-muted">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text-primary">Recent Trips</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentTrips.map((trip) => (
            <Card key={trip.id} hover>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {trip.destination}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {trip.date} &middot; {trip.driver}
                  </p>
                  <StarRating rating={trip.rating} size="sm" className="mt-1.5" />
                </div>
                <Badge variant={trip.statusBadge}>{trip.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
