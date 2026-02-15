"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";

const fleetStatus = [
  { type: "Wheelchair Van", total: 3, active: 2, available: 1 },
  { type: "Ambulatory Sedan", total: 3, active: 2, available: 1 },
  { type: "Stretcher", total: 1, active: 0, available: 1 },
  { type: "Bariatric", total: 1, active: 0, available: 1 },
];

const marketplaceOpps = [
  {
    id: "MKT-2290",
    los: "Wheelchair",
    losBadge: "brand" as const,
    pickup: "Downtown Medical Plaza",
    dropoff: "Sunrise Senior Living",
    price: "$58.00",
    distance: "8.2 mi",
    countdown: "42 min left",
    countdownUrgent: false,
  },
  {
    id: "MKT-2288",
    los: "Stretcher",
    losBadge: "danger" as const,
    pickup: "Valley General Hospital",
    dropoff: "Home - 2200 Elm Ave",
    price: "$195.00",
    distance: "14.5 mi",
    countdown: "18 min left",
    countdownUrgent: true,
  },
  {
    id: "MKT-2285",
    los: "Ambulatory",
    losBadge: "success" as const,
    pickup: "Oak Street Dialysis",
    dropoff: "Home - 540 Pine Rd",
    price: "$32.00",
    distance: "5.1 mi",
    countdown: "1h 15m left",
    countdownUrgent: false,
  },
];

export default function ProviderDashboard() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Provider Dashboard"
        description="SafeRide Medical Transport -- Fleet management and marketplace opportunities."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/provider/marketplace")}>
              Browse Marketplace
            </Button>
            <Button size="sm" onClick={() => router.push("/provider/dispatch")}>
              View Dispatch Board
            </Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Vehicles"
          value="6 / 8"
          change="75% utilization"
          changeType="positive"
          icon="🚐"
        />
        <StatCard
          label="On-Trip"
          value={4}
          change="2 completing soon"
          changeType="neutral"
          icon="🛣"
        />
        <StatCard
          label="Available Drivers"
          value={5}
          change="1 on break"
          changeType="neutral"
          icon="👤"
        />
        <StatCard
          label="Today's Revenue"
          value="$1,847"
          change="+12% vs avg"
          changeType="positive"
          icon="💰"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Fleet Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Fleet Status</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/provider/vehicles")}
            >
              Manage Fleet
            </Button>
          </div>
          <div className="space-y-4">
            {fleetStatus.map((vehicle) => (
              <div key={vehicle.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">
                    {vehicle.type}
                  </span>
                  <span className="text-xs text-text-muted">
                    {vehicle.active} active / {vehicle.total} total
                  </span>
                </div>
                <ProgressBar
                  value={vehicle.active}
                  max={vehicle.total}
                  color={vehicle.active === vehicle.total ? "success" : "brand"}
                  size="sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-text-muted">Total fleet capacity</span>
            <span className="font-semibold text-text-primary">
              4 on-trip &middot; 4 available
            </span>
          </div>
        </Card>

        {/* Marketplace Opportunities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Marketplace Opportunities
            </h2>
            <Badge variant="info">3 New</Badge>
          </div>
          <div className="space-y-3">
            {marketplaceOpps.map((opp) => (
              <div
                key={opp.id}
                className="rounded-lg border border-border p-3 hover:border-accent-light transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={opp.losBadge}>{opp.los}</Badge>
                    <span className="text-xs text-text-muted">{opp.distance}</span>
                  </div>
                  <span className="text-base font-bold text-text-primary">
                    {opp.price}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-1">
                  {opp.pickup} &rarr; {opp.dropoff}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      opp.countdownUrgent ? "text-danger" : "text-text-muted"
                    }`}
                  >
                    {opp.countdownUrgent && "⏱ "}
                    {opp.countdown}
                  </span>
                  <Button size="sm">Accept</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/provider/dispatch")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
              📊
            </span>
            <div>
              <p className="font-medium text-text-primary">View Dispatch Board</p>
              <p className="text-xs text-text-muted">Live fleet management</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/provider/marketplace")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-lg">
              🏪
            </span>
            <div>
              <p className="font-medium text-text-primary">Browse Marketplace</p>
              <p className="text-xs text-text-muted">Find new trip opportunities</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-muted/50 transition-colors" onClick={() => router.push("/provider/drivers")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-lg">
              📅
            </span>
            <div>
              <p className="font-medium text-text-primary">Driver Schedule</p>
              <p className="text-xs text-text-muted">View and manage shifts</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
