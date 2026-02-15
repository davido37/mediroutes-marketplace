"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { SearchInput } from "@/components/common/search-input";
import { Tabs } from "@/components/common/tabs";
import { MOCK_FACILITY_TRIPS } from "@/lib/mock-data";
import type { Trip, TripStatus, FulfillmentOption } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type FilterTab = "all" | "active" | "completed" | "cancelled";

const ACTIVE_STATUSES: TripStatus[] = [
  "requested",
  "authorized",
  "assigned",
  "dispatched",
  "en_route_pickup",
  "arrived_pickup",
  "picked_up",
  "in_transit",
];

const COMPLETED_STATUSES: TripStatus[] = ["completed"];
const CANCELLED_STATUSES: TripStatus[] = ["cancelled", "no_show"];

const STATUS_BADGE_VARIANT: Record<string, "info" | "brand" | "success" | "danger" | "warning" | "muted"> = {
  requested: "info",
  authorized: "info",
  assigned: "info",
  dispatched: "brand",
  en_route_pickup: "brand",
  arrived_pickup: "brand",
  picked_up: "brand",
  in_transit: "brand",
  arrived_dropoff: "brand",
  completed: "success",
  cancelled: "danger",
  no_show: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  authorized: "Authorized",
  assigned: "Assigned",
  dispatched: "Dispatched",
  en_route_pickup: "En Route",
  arrived_pickup: "At Pickup",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  arrived_dropoff: "Arriving",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-Show",
};

type SortField = "date" | "patient" | "status" | "cost";
type SortDir = "asc" | "desc";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFulfillmentLabel(f?: FulfillmentOption): { type: string; provider: string; variant: "brand" | "purple" | "info" } {
  if (!f) return { type: "Pending", provider: "--", variant: "info" };
  switch (f.type) {
    case "fleet":
      return { type: "Fleet", provider: f.driverName ?? "Internal", variant: "brand" };
    case "tnc":
      return { type: "TNC", provider: f.providerDisplayName, variant: "purple" };
    case "marketplace":
      return { type: "Marketplace", provider: f.providerName, variant: "info" };
  }
}

function getCost(trip: Trip): number {
  if (!trip.fulfillment) return 0;
  switch (trip.fulfillment.type) {
    case "fleet":
      return trip.fulfillment.internalCost;
    case "tnc":
      return trip.fulfillment.cost;
    case "marketplace":
      return trip.fulfillment.cost;
  }
}

function formatCurrency(amount: number): string {
  if (amount === 0) return "\u2014";
  return `$${amount.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function patientFullName(trip: Trip): string {
  return `${trip.request.patient.firstName} ${trip.request.patient.lastName}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FacilityTrips() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "active":
        return MOCK_FACILITY_TRIPS.filter((t) => ACTIVE_STATUSES.includes(t.status));
      case "completed":
        return MOCK_FACILITY_TRIPS.filter((t) => COMPLETED_STATUSES.includes(t.status));
      case "cancelled":
        return MOCK_FACILITY_TRIPS.filter((t) => CANCELLED_STATUSES.includes(t.status));
      default:
        return MOCK_FACILITY_TRIPS;
    }
  }, [activeTab]);

  // Filter by search
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(
      (t) =>
        patientFullName(t).toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...searchFiltered];
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      switch (sortField) {
        case "date":
          return dir * (new Date(a.request.requestedDate).getTime() - new Date(b.request.requestedDate).getTime());
        case "patient":
          return dir * patientFullName(a).localeCompare(patientFullName(b));
        case "status":
          return dir * a.status.localeCompare(b.status);
        case "cost":
          return dir * (getCost(a) - getCost(b));
        default:
          return 0;
      }
    });
    return list;
  }, [searchFiltered, sortField, sortDir]);

  // Tab counts
  const counts = useMemo(() => {
    const all = MOCK_FACILITY_TRIPS.length;
    const active = MOCK_FACILITY_TRIPS.filter((t) => ACTIVE_STATUSES.includes(t.status)).length;
    const completed = MOCK_FACILITY_TRIPS.filter((t) => COMPLETED_STATUSES.includes(t.status)).length;
    const cancelled = MOCK_FACILITY_TRIPS.filter((t) => CANCELLED_STATUSES.includes(t.status)).length;
    return { all, active, completed, cancelled };
  }, []);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  }

  return (
    <div>
      <PageHeader
        title="Trip History"
        description="View and manage all past and upcoming patient transport requests."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="muted">{MOCK_FACILITY_TRIPS.length} trips</Badge>
            <Button variant="secondary" size="sm">
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by patient name or trip ID..."
        className="mb-4 max-w-md"
      />

      {/* Filter tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All", badge: counts.all },
          { id: "active", label: "Active", badge: counts.active },
          { id: "completed", label: "Completed", badge: counts.completed },
          { id: "cancelled", label: "Cancelled / No-Show", badge: counts.cancelled },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as FilterTab)}
        className="mb-4"
      />

      {/* Trip table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th
                  className="px-4 py-2.5 text-left font-medium text-text-muted cursor-pointer select-none"
                  onClick={() => handleSort("date")}
                >
                  Trip ID{sortIndicator("date")}
                </th>
                <th
                  className="px-4 py-2.5 text-left font-medium text-text-muted cursor-pointer select-none"
                  onClick={() => handleSort("patient")}
                >
                  Patient{sortIndicator("patient")}
                </th>
                <th
                  className="px-4 py-2.5 text-left font-medium text-text-muted cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  Status{sortIndicator("status")}
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden lg:table-cell">
                  Route
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden md:table-cell">
                  Fulfillment
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden sm:table-cell">
                  Date / Time
                </th>
                <th
                  className="px-4 py-2.5 text-right font-medium text-text-muted cursor-pointer select-none"
                  onClick={() => handleSort("cost")}
                >
                  Cost{sortIndicator("cost")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    No trips match your search.
                  </td>
                </tr>
              )}
              {sorted.map((trip) => {
                const fulfillment = getFulfillmentLabel(trip.fulfillment);
                const cost = getCost(trip);
                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-surface-muted/30 transition-colors cursor-pointer"
                  >
                    {/* Trip ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-accent">
                        {trip.id}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {patientFullName(trip)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE_VARIANT[trip.status] ?? "muted"}>
                        {STATUS_LABEL[trip.status] ?? trip.status}
                      </Badge>
                    </td>

                    {/* Route */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="max-w-[220px]">
                        <p className="text-xs text-text-primary truncate">
                          {trip.request.pickup.label}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          &rarr; {trip.request.dropoff.label}
                        </p>
                      </div>
                    </td>

                    {/* Fulfillment */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant={fulfillment.variant} className="mr-1">
                        {fulfillment.type}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        {fulfillment.provider}
                      </span>
                    </td>

                    {/* Date / Time */}
                    <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                      <p className="text-xs text-text-primary">
                        {formatDate(trip.request.requestedDate)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {trip.request.requestedTime}
                      </p>
                    </td>

                    {/* Cost */}
                    <td className="px-4 py-3 text-right font-medium text-text-primary">
                      {formatCurrency(cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-muted/30 text-xs text-text-muted">
          <span>
            Showing {sorted.length} of {MOCK_FACILITY_TRIPS.length} trips
          </span>
          <span>
            Total cost:{" "}
            <span className="font-medium text-text-primary">
              {formatCurrency(
                sorted.reduce((sum, t) => sum + getCost(t), 0)
              )}
            </span>
          </span>
        </div>
      </Card>
    </div>
  );
}
