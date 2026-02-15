"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { SearchInput } from "@/components/common/search-input";
import { ProgressBar } from "@/components/common/progress-bar";
import { Modal } from "@/components/common/modal";
import { MOCK_HP_MEMBERS, type HealthPlanMember } from "@/lib/mock-data";

// ---------- helpers ----------

type FilterTab = "all" | "eligible" | "pending" | "ineligible_suspended";
type SortKey = "name-az" | "name-za" | "trips-high" | "plan-name";

const STATUS_BADGE_VARIANT: Record<
  HealthPlanMember["eligibilityStatus"],
  "success" | "warning" | "danger"
> = {
  eligible: "success",
  pending: "warning",
  ineligible: "danger",
  suspended: "danger",
};

function usageColor(
  used: number,
  authorized: number,
): "brand" | "warning" | "danger" {
  if (authorized === 0) return "brand";
  const ratio = used / authorized;
  if (ratio > 0.85) return "danger";
  if (ratio > 0.7) return "warning";
  return "brand";
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  return date.toLocaleDateString();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- component ----------

export default function Members() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [sort, setSort] = useState<SortKey>("name-az");
  const [selectedMember, setSelectedMember] =
    useState<HealthPlanMember | null>(null);

  // ---- derived data ----

  const filtered = useMemo(() => {
    let members = MOCK_HP_MEMBERS;

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      members = members.filter(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.memberId.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q),
      );
    }

    // filter tab
    if (filter === "eligible") {
      members = members.filter((m) => m.eligibilityStatus === "eligible");
    } else if (filter === "pending") {
      members = members.filter((m) => m.eligibilityStatus === "pending");
    } else if (filter === "ineligible_suspended") {
      members = members.filter(
        (m) =>
          m.eligibilityStatus === "ineligible" ||
          m.eligibilityStatus === "suspended",
      );
    }

    // sort
    const sorted = [...members];
    switch (sort) {
      case "name-az":
        sorted.sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`,
          ),
        );
        break;
      case "name-za":
        sorted.sort((a, b) =>
          `${b.lastName} ${b.firstName}`.localeCompare(
            `${a.lastName} ${a.firstName}`,
          ),
        );
        break;
      case "trips-high":
        sorted.sort((a, b) => b.tripsUsed - a.tripsUsed);
        break;
      case "plan-name":
        sorted.sort((a, b) => a.healthPlanName.localeCompare(b.healthPlanName));
        break;
    }

    return sorted;
  }, [search, filter, sort]);

  // ---- summary stats ----

  const totalMembers = MOCK_HP_MEMBERS.length;
  const eligibleCount = MOCK_HP_MEMBERS.filter(
    (m) => m.eligibilityStatus === "eligible",
  ).length;
  const pendingCount = MOCK_HP_MEMBERS.filter(
    (m) => m.eligibilityStatus === "pending",
  ).length;
  const atRiskCount = MOCK_HP_MEMBERS.filter(
    (m) => m.tripsAuthorized > 0 && m.tripsUsed / m.tripsAuthorized > 0.85,
  ).length;

  // ---- filter tabs config ----

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "eligible", label: "Eligible" },
    { key: "pending", label: "Pending" },
    { key: "ineligible_suspended", label: "Ineligible / Suspended" },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Member Management"
        description="View member eligibility, trip history, and transportation benefit status."
        actions={
          <>
            <Badge variant="brand">{totalMembers} members</Badge>
            <Button variant="secondary" size="sm">
              Export
            </Button>
          </>
        }
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-xs text-text-muted mb-1">Total Members</p>
          <p className="text-2xl font-bold text-text-primary">{totalMembers}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-text-muted">Eligible</p>
            <Badge variant="success">{eligibleCount}</Badge>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {eligibleCount}
          </p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-text-muted">Pending</p>
            <Badge variant="warning">{pendingCount}</Badge>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {pendingCount}
          </p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-text-muted">At-Risk</p>
            <Badge variant="danger">{atRiskCount}</Badge>
          </div>
          <p className="text-2xl font-bold text-text-primary">{atRiskCount}</p>
        </Card>
      </div>

      {/* Search + filter + sort toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, member ID, or city..."
          className="w-full sm:w-72"
        />

        <div className="flex items-center gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.key
                  ? "bg-accent text-white"
                  : "bg-surface-muted text-text-secondary hover:bg-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="ml-auto rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-text-secondary focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/20"
        >
          <option value="name-az">Name A-Z</option>
          <option value="name-za">Name Z-A</option>
          <option value="trips-high">Trips Used (high)</option>
          <option value="plan-name">Plan Name</option>
        </select>
      </div>

      {/* Member table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Member
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Member ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Trips Used
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Last Trip
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  City
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    No members match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const color = usageColor(m.tripsUsed, m.tripsAuthorized);
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="border-b border-border last:border-0 hover:bg-surface-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                        {m.memberId}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {m.healthPlanName}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {m.productName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={STATUS_BADGE_VARIANT[m.eligibilityStatus]}
                        >
                          {capitalize(m.eligibilityStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-text-secondary text-xs whitespace-nowrap">
                            {m.tripsUsed} / {m.tripsAuthorized}
                          </span>
                          <ProgressBar
                            value={m.tripsUsed}
                            max={m.tripsAuthorized}
                            size="sm"
                            color={color}
                            className="flex-1"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatRelativeDate(m.lastTripDate)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {m.city}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Showing X of Y */}
      <p className="text-xs text-text-muted mt-3">
        Showing {filtered.length} of {totalMembers} members
      </p>

      {/* Member detail modal */}
      {selectedMember && (
        <Modal
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title="Member Details"
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedMember(null)}
              >
                View Trip History
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedMember(null)}
              >
                Update Eligibility
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            {/* Name + ID */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <p className="text-sm text-text-muted font-mono">
                  {selectedMember.memberId}
                </p>
              </div>
              <Badge
                variant={
                  STATUS_BADGE_VARIANT[selectedMember.eligibilityStatus]
                }
              >
                {capitalize(selectedMember.eligibilityStatus)}
              </Badge>
            </div>

            {/* Grid of detail fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Phone</p>
                <p className="text-sm text-text-primary font-medium">
                  {selectedMember.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">City</p>
                <p className="text-sm text-text-primary font-medium">
                  {selectedMember.city}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Health Plan</p>
                <p className="text-sm text-text-primary font-medium">
                  {selectedMember.healthPlanName}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Product</p>
                <p className="text-sm text-text-primary font-medium">
                  {selectedMember.productName}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Mobility Type</p>
                <Badge variant="info">{selectedMember.mobilityType}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Last Trip</p>
                <p className="text-sm text-text-primary font-medium">
                  {formatRelativeDate(selectedMember.lastTripDate)}
                </p>
              </div>
            </div>

            {/* Trip usage */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-text-muted">Trip Usage</p>
                <p className="text-sm font-semibold text-text-primary">
                  {selectedMember.tripsUsed} of {selectedMember.tripsAuthorized}
                </p>
              </div>
              <ProgressBar
                value={selectedMember.tripsUsed}
                max={selectedMember.tripsAuthorized}
                size="md"
                color={usageColor(
                  selectedMember.tripsUsed,
                  selectedMember.tripsAuthorized,
                )}
                showValue
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
