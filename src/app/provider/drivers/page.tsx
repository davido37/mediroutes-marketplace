"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";

type DriverStatus = "available" | "on_trip" | "on_break" | "off_duty";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: DriverStatus;
  rating: number;
  completedTrips: number;
  vehicle: string | null;
  credentialCount: number;
  expiringCredentials: number;
}

const drivers: Driver[] = [
  {
    id: "drv-010",
    firstName: "Carlos",
    lastName: "Mendez",
    phone: "(602) 555-0201",
    status: "available",
    rating: 4.9,
    completedTrips: 342,
    vehicle: "V-101",
    credentialCount: 6,
    expiringCredentials: 0,
  },
  {
    id: "drv-011",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "(602) 555-0202",
    status: "on_trip",
    rating: 4.7,
    completedTrips: 287,
    vehicle: "V-102",
    credentialCount: 6,
    expiringCredentials: 0,
  },
  {
    id: "drv-012",
    firstName: "Michael",
    lastName: "Okafor",
    phone: "(602) 555-0203",
    status: "available",
    rating: 4.8,
    completedTrips: 198,
    vehicle: "V-103",
    credentialCount: 5,
    expiringCredentials: 1,
  },
  {
    id: "drv-013",
    firstName: "Lisa",
    lastName: "Park",
    phone: "(602) 555-0204",
    status: "on_trip",
    rating: 4.6,
    completedTrips: 156,
    vehicle: "V-104",
    credentialCount: 6,
    expiringCredentials: 0,
  },
  {
    id: "drv-014",
    firstName: "James",
    lastName: "Robinson",
    phone: "(602) 555-0205",
    status: "available",
    rating: 4.9,
    completedTrips: 421,
    vehicle: null,
    credentialCount: 6,
    expiringCredentials: 0,
  },
  {
    id: "drv-015",
    firstName: "Angela",
    lastName: "Torres",
    phone: "(602) 555-0206",
    status: "on_trip",
    rating: 4.5,
    completedTrips: 89,
    vehicle: "V-107",
    credentialCount: 4,
    expiringCredentials: 2,
  },
  {
    id: "drv-016",
    firstName: "David",
    lastName: "Nguyen",
    phone: "(602) 555-0207",
    status: "on_break",
    rating: 4.8,
    completedTrips: 267,
    vehicle: null,
    credentialCount: 6,
    expiringCredentials: 0,
  },
  {
    id: "drv-017",
    firstName: "Maria",
    lastName: "Santos",
    phone: "(602) 555-0208",
    status: "off_duty",
    rating: 4.7,
    completedTrips: 312,
    vehicle: null,
    credentialCount: 5,
    expiringCredentials: 1,
  },
];

const credentialAlerts = [
  {
    driverName: "Angela Torres",
    credential: "CPR Certification",
    status: "expired" as const,
    detail: "Expired Jan 28, 2026",
  },
  {
    driverName: "Michael Okafor",
    credential: "Defensive Driving",
    status: "expiring" as const,
    detail: "Expires Feb 22, 2026",
  },
  {
    driverName: "Maria Santos",
    credential: "Background Check",
    status: "expiring" as const,
    detail: "Expires Mar 5, 2026",
  },
];

const statusConfig: Record<
  DriverStatus,
  { label: string; variant: "success" | "brand" | "warning" | "muted" }
> = {
  available: { label: "Available", variant: "success" },
  on_trip: { label: "On Trip", variant: "brand" },
  on_break: { label: "On Break", variant: "warning" },
  off_duty: { label: "Off Duty", variant: "muted" },
};

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`;
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < full ? "text-amber-400" : "text-gray-300"}>
        ★
      </span>
    );
  }
  return stars;
}

const avatarColors: Record<DriverStatus, string> = {
  available: "bg-green-100 text-green-700",
  on_trip: "bg-brand-lightest text-brand-dark",
  on_break: "bg-amber-100 text-amber-700",
  off_duty: "bg-gray-100 text-gray-500",
};

export default function DriversPage() {
  const statusCounts = {
    total: drivers.length,
    available: drivers.filter((d) => d.status === "available").length,
    on_trip: drivers.filter((d) => d.status === "on_trip").length,
    on_break: drivers.filter((d) => d.status === "on_break").length,
    off_duty: drivers.filter((d) => d.status === "off_duty").length,
  };

  return (
    <div>
      <PageHeader
        title="Driver Roster"
        description="Manage drivers, credentials, and shift assignments."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Export Roster
            </Button>
            <Button size="sm">Add Driver</Button>
          </div>
        }
      />

      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge variant="default">{statusCounts.total} Total</Badge>
        <Badge variant="success">{statusCounts.available} Available</Badge>
        <Badge variant="brand">{statusCounts.on_trip} On Trip</Badge>
        <Badge variant="warning">{statusCounts.on_break} On Break</Badge>
        <Badge variant="muted">{statusCounts.off_duty} Off Duty</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver List */}
        <div className="lg:col-span-2 space-y-3">
          {drivers.map((driver) => {
            const cfg = statusConfig[driver.status];
            const initials = getInitials(driver.firstName, driver.lastName);
            const credentialColor =
              driver.expiringCredentials > 0 ? "text-danger" : "text-success";

            return (
              <Card key={driver.id}>
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColors[driver.status]}`}
                  >
                    {initials}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-text-primary truncate">
                        {driver.firstName} {driver.lastName}
                      </span>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                      <span>{driver.phone}</span>
                      <span className="flex items-center gap-1">
                        {renderStars(driver.rating)}
                        <span className="ml-0.5 font-medium text-text-secondary">
                          {driver.rating}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 shrink-0 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-text-primary">
                        {driver.completedTrips}
                      </p>
                      <p className="text-xs text-text-muted">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-text-primary">
                        {driver.vehicle ?? "—"}
                      </p>
                      <p className="text-xs text-text-muted">Vehicle</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold ${credentialColor}`}>
                        {driver.credentialCount - driver.expiringCredentials}/
                        {driver.credentialCount}
                      </p>
                      <p className="text-xs text-text-muted">Credentials</p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <Button variant="secondary" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Mobile stats row */}
                <div className="flex sm:hidden items-center gap-4 mt-3 pt-3 border-t border-border text-sm text-text-muted">
                  <span>{driver.completedTrips} trips</span>
                  <span>Vehicle: {driver.vehicle ?? "None"}</span>
                  <span className={credentialColor}>
                    {driver.credentialCount - driver.expiringCredentials}/
                    {driver.credentialCount} credentials
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Credential Alerts Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Credential Alerts
              </h2>
              <Badge variant="danger">{credentialAlerts.length}</Badge>
            </div>
            <div className="space-y-3">
              {credentialAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        alert.status === "expired"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    />
                    <span className="font-medium text-sm text-text-primary">
                      {alert.driverName}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary ml-4">
                    {alert.credential}
                  </p>
                  <p
                    className={`text-xs ml-4 mt-0.5 font-medium ${
                      alert.status === "expired"
                        ? "text-danger"
                        : "text-warning-dark"
                    }`}
                  >
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full">
                View All Credentials
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
