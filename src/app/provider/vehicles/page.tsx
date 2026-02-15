"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";

type VehicleStatus = "available" | "on_trip" | "maintenance" | "off_duty";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  type: string;
  plate: string;
  status: VehicleStatus;
  fuelPercent: number;
  mileage: number;
  capacity: { amb: number; wc: number; str: number };
  credentials: { total: number; current: number; expiring: number; expired: number };
}

const vehicles: Vehicle[] = [
  {
    id: "V-101",
    year: 2022,
    make: "Ford",
    model: "Transit",
    type: "WAV Van",
    plate: "NMT-4821",
    status: "available",
    fuelPercent: 75,
    mileage: 34200,
    capacity: { amb: 3, wc: 1, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-102",
    year: 2023,
    make: "Mercedes",
    model: "Sprinter",
    type: "WAV Van",
    plate: "NMT-5910",
    status: "on_trip",
    fuelPercent: 60,
    mileage: 22100,
    capacity: { amb: 4, wc: 2, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-103",
    year: 2021,
    make: "Dodge",
    model: "Grand Caravan",
    type: "Minivan",
    plate: "NMT-3347",
    status: "available",
    fuelPercent: 90,
    mileage: 45800,
    capacity: { amb: 5, wc: 0, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-104",
    year: 2023,
    make: "Toyota",
    model: "Sienna",
    type: "Minivan",
    plate: "NMT-6203",
    status: "on_trip",
    fuelPercent: 45,
    mileage: 18300,
    capacity: { amb: 5, wc: 0, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-105",
    year: 2022,
    make: "Chevrolet",
    model: "Express",
    type: "Stretcher Van",
    plate: "NMT-7785",
    status: "available",
    fuelPercent: 80,
    mileage: 28500,
    capacity: { amb: 2, wc: 0, str: 1 },
    credentials: { total: 3, current: 2, expiring: 1, expired: 0 },
  },
  {
    id: "V-106",
    year: 2024,
    make: "Ford",
    model: "E-350",
    type: "Bariatric Van",
    plate: "NMT-1190",
    status: "off_duty",
    fuelPercent: 55,
    mileage: 8200,
    capacity: { amb: 2, wc: 1, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-107",
    year: 2022,
    make: "Toyota",
    model: "Camry",
    type: "Sedan",
    plate: "NMT-8456",
    status: "on_trip",
    fuelPercent: 35,
    mileage: 52100,
    capacity: { amb: 2, wc: 0, str: 0 },
    credentials: { total: 3, current: 3, expiring: 0, expired: 0 },
  },
  {
    id: "V-108",
    year: 2023,
    make: "Honda",
    model: "Odyssey",
    type: "Minivan",
    plate: "NMT-2674",
    status: "maintenance",
    fuelPercent: 70,
    mileage: 31400,
    capacity: { amb: 5, wc: 0, str: 0 },
    credentials: { total: 3, current: 2, expiring: 0, expired: 1 },
  },
];

const statusConfig: Record<
  VehicleStatus,
  { label: string; badge: "success" | "brand" | "warning" | "muted" }
> = {
  available: { label: "Available", badge: "success" },
  on_trip: { label: "On Trip", badge: "brand" },
  maintenance: { label: "Maintenance", badge: "warning" },
  off_duty: { label: "Off Duty", badge: "muted" },
};

function fuelColor(percent: number): "success" | "warning" | "danger" | "brand" {
  if (percent >= 70) return "success";
  if (percent >= 40) return "warning";
  return "danger";
}

function formatMileage(miles: number): string {
  return miles.toLocaleString() + " mi";
}

function CredentialSummary({ creds }: { creds: Vehicle["credentials"] }) {
  if (creds.expired > 0) {
    return (
      <span className="text-xs font-medium text-danger">
        {creds.expired} expired
      </span>
    );
  }
  if (creds.expiring > 0) {
    return (
      <span className="text-xs font-medium text-warning">
        {creds.expiring} expiring
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-success">
      {creds.current}/{creds.total} current
    </span>
  );
}

export default function VehiclesPage() {
  const totalCount = vehicles.length;
  const availableCount = vehicles.filter((v) => v.status === "available").length;
  const onTripCount = vehicles.filter((v) => v.status === "on_trip").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length;
  const offDutyCount = vehicles.filter((v) => v.status === "off_duty").length;

  return (
    <div>
      <PageHeader
        title="Vehicle Inventory"
        description="Manage your fleet vehicles, credentials, and maintenance."
        actions={
          <Button size="sm">+ Add Vehicle</Button>
        }
      />

      {/* Summary Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="default">{totalCount} Total</Badge>
        <Badge variant="success">{availableCount} Available</Badge>
        <Badge variant="brand">{onTripCount} On Trip</Badge>
        <Badge variant="warning">{maintenanceCount} Maintenance</Badge>
        <Badge variant="muted">{offDutyCount} Off Duty</Badge>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => {
          const config = statusConfig[vehicle.status];

          return (
            <Card key={vehicle.id} hover>
              {/* Top row: icon + name + status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lightest text-lg">
                    🚐
                  </span>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-text-muted">
                      {vehicle.id} &middot; {vehicle.plate}
                    </p>
                  </div>
                </div>
                <Badge variant={config.badge}>{config.label}</Badge>
              </div>

              {/* Vehicle type + capacity */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">{vehicle.type}</span>
                <span className="text-xs text-text-muted">
                  {vehicle.capacity.amb} amb / {vehicle.capacity.wc} wc / {vehicle.capacity.str} str
                </span>
              </div>

              {/* Fuel bar */}
              <ProgressBar
                value={vehicle.fuelPercent}
                max={100}
                label="Fuel"
                showValue
                size="sm"
                color={fuelColor(vehicle.fuelPercent)}
                className="mb-3"
              />

              {/* Bottom row: mileage, credentials, action */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">
                    {formatMileage(vehicle.mileage)}
                  </span>
                  <CredentialSummary creds={vehicle.credentials} />
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
