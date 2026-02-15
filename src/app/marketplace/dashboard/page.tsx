"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";

const marketplaceTrips = [
  {
    id: "MKT-2290",
    origin: "Phoenix, AZ",
    destination: "Scottsdale, AZ",
    los: "Wheelchair",
    losBadge: "brand" as const,
    suggestedPrice: "$58.00",
    expires: "42 min",
    expiresUrgent: false,
    offers: 3,
    postedBy: "Valley Medical Center",
  },
  {
    id: "MKT-2289",
    origin: "Mesa, AZ",
    destination: "Tempe, AZ",
    los: "Ambulatory",
    losBadge: "success" as const,
    suggestedPrice: "$28.00",
    expires: "1h 20m",
    expiresUrgent: false,
    offers: 5,
    postedBy: "Desert Springs Dialysis",
  },
  {
    id: "MKT-2288",
    origin: "Chandler, AZ",
    destination: "Gilbert, AZ",
    los: "Stretcher",
    losBadge: "danger" as const,
    suggestedPrice: "$195.00",
    expires: "18 min",
    expiresUrgent: true,
    offers: 1,
    postedBy: "Chandler Regional Hospital",
  },
  {
    id: "MKT-2287",
    origin: "Glendale, AZ",
    destination: "Peoria, AZ",
    los: "Wheelchair",
    losBadge: "brand" as const,
    suggestedPrice: "$44.00",
    expires: "2h 5m",
    expiresUrgent: false,
    offers: 2,
    postedBy: "Banner Health Clinic",
  },
  {
    id: "MKT-2286",
    origin: "Scottsdale, AZ",
    destination: "Phoenix, AZ",
    los: "Ambulatory",
    losBadge: "success" as const,
    suggestedPrice: "$35.00",
    expires: "55 min",
    expiresUrgent: false,
    offers: 4,
    postedBy: "HonorHealth Outpatient",
  },
];

export default function MarketplaceDashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div>
      <PageHeader
        title="Marketplace"
        description="Browse open trip opportunities and manage your posted trips."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/marketplace/pricing")}>
              Pricing Engine
            </Button>
            <Button size="sm" onClick={() => router.push("/marketplace/post")}>Post a Trip</Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Open Trips"
          value={67}
          change="+8 in last hour"
          changeType="positive"
          icon="📋"
        />
        <StatCard
          label="My Posted"
          value={4}
          change="2 with offers"
          changeType="neutral"
          icon="📤"
        />
        <StatCard
          label="Accepted Today"
          value={12}
          change="+3 from yesterday"
          changeType="positive"
          icon="✓"
        />
        <StatCard
          label="Avg Fill Time"
          value="18 min"
          change="-4 min vs last week"
          changeType="positive"
          icon="⏱"
        />
      </div>

      {/* View Toggle + Trip List */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Open Trips</h2>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-accent text-white"
                  : "bg-white text-text-secondary hover:bg-surface-muted"
              }`}
              onClick={() => setViewMode("list")}
            >
              List View
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-accent text-white"
                  : "bg-white text-text-secondary hover:bg-surface-muted"
              }`}
              onClick={() => setViewMode("map")}
            >
              Map View
            </button>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="rounded-lg border border-border bg-surface-muted h-64 flex items-center justify-center">
            <p className="text-text-muted text-sm">
              Map view with 67 open trips in your service area
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {marketplaceTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-accent-light transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-accent">{trip.id}</span>
                    <Badge variant={trip.losBadge}>{trip.los}</Badge>
                    <span className="text-xs text-text-muted">
                      {trip.offers} offer{trip.offers !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">
                    {trip.origin} &rarr; {trip.destination}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Posted by {trip.postedBy}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">
                      {trip.suggestedPrice}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        trip.expiresUrgent ? "text-danger" : "text-text-muted"
                      }`}
                    >
                      {trip.expiresUrgent && "⏱ "}
                      {trip.expires}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => router.push("/marketplace/browse")}>Make Offer</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border text-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/marketplace/browse")}>
            View All 67 Open Trips
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/marketplace/post")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
              📤
            </span>
            <div>
              <p className="font-medium text-text-primary">Post a Trip</p>
              <p className="text-xs text-text-muted">List a trip for provider bids</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/marketplace/browse")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-lg">
              🔍
            </span>
            <div>
              <p className="font-medium text-text-primary">Browse Trips</p>
              <p className="text-xs text-text-muted">Find trips matching your fleet</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/marketplace/pricing")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-lg">
              💲
            </span>
            <div>
              <p className="font-medium text-text-primary">Pricing Engine</p>
              <p className="text-xs text-text-muted">Suggested pricing and analysis</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
