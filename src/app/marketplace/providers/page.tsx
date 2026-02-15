"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { SearchInput } from "@/components/common/search-input";
import { StarRating } from "@/components/common/star-rating";
import { ProgressBar } from "@/components/common/progress-bar";
import { Modal } from "@/components/common/modal";
import {
  MOCK_MARKETPLACE_PROVIDERS,
  type MarketplaceProvider,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CAPABILITY_OPTIONS = [
  "Ambulatory",
  "Wheelchair",
  "Stretcher",
  "Bariatric",
] as const;

type SortOption =
  | "rating"
  | "completedTrips"
  | "onTimePercent"
  | "activeVehicles"
  | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  rating: "Rating (High-Low)",
  completedTrips: "Completed Trips",
  onTimePercent: "On-Time %",
  activeVehicles: "Vehicles",
  newest: "Newest",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CAPABILITY_BADGE_VARIANT: Record<
  string,
  "success" | "brand" | "danger" | "warning"
> = {
  ambulatory: "success",
  wheelchair: "brand",
  stretcher: "danger",
  bariatric: "warning",
};

function formatMemberSince(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function onTimeColor(pct: number): "success" | "warning" | "danger" {
  if (pct >= 93) return "success";
  if (pct >= 88) return "warning";
  return "danger";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MarketplaceProviders() {
  // State
  const [search, setSearch] = useState("");
  const [capabilityFilter, setCapabilityFilter] = useState<Set<string>>(
    new Set(),
  );
  const [sortOption, setSortOption] = useState<SortOption>("rating");
  const [selectedProvider, setSelectedProvider] =
    useState<MarketplaceProvider | null>(null);

  // Derived data
  const providers = MOCK_MARKETPLACE_PROVIDERS;

  const verifiedCount = providers.filter((p) => p.verified).length;
  const averageRating =
    providers.reduce((sum, p) => sum + p.rating, 0) / providers.length;
  const totalVehicles = providers.reduce((sum, p) => sum + p.activeVehicles, 0);

  // Filter + sort
  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.coverageArea.toLowerCase().includes(q),
      );
    }

    // Capability filter
    if (capabilityFilter.size > 0) {
      result = result.filter((p) =>
        Array.from(capabilityFilter).every((cap) =>
          p.capabilities.includes(cap.toLowerCase()),
        ),
      );
    }

    // Sort
    switch (sortOption) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "completedTrips":
        result.sort((a, b) => b.completedTrips - a.completedTrips);
        break;
      case "onTimePercent":
        result.sort((a, b) => b.onTimePercent - a.onTimePercent);
        break;
      case "activeVehicles":
        result.sort((a, b) => b.activeVehicles - a.activeVehicles);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.memberSince).getTime() -
            new Date(a.memberSince).getTime(),
        );
        break;
    }

    return result;
  }, [providers, search, capabilityFilter, sortOption]);

  // Capability toggle
  function toggleCapability(cap: string) {
    setCapabilityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(cap)) {
        next.delete(cap);
      } else {
        next.add(cap);
      }
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        title="Provider Directory"
        description="View rated marketplace providers, coverage areas, and capabilities."
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary stats                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-xs text-text-muted mb-1">Total Providers</p>
          <p className="text-2xl font-bold text-text-primary">
            {providers.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted mb-1">Verified</p>
          <p className="text-2xl font-bold text-text-primary flex items-center gap-2">
            {verifiedCount}
            <Badge variant="success">Verified</Badge>
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted mb-1">Average Rating</p>
          <p className="text-2xl font-bold text-text-primary flex items-center gap-2">
            {averageRating.toFixed(1)}
            <Badge variant="brand">Avg</Badge>
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted mb-1">Total Vehicles</p>
          <p className="text-2xl font-bold text-text-primary">
            {totalVehicles}
          </p>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search + Filters + Sort                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or coverage area..."
          className="flex-1"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
            Capabilities:
          </span>
          {CAPABILITY_OPTIONS.map((cap) => {
            const active = capabilityFilter.has(cap);
            return (
              <button
                key={cap}
                onClick={() => toggleCapability(cap)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  active
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-text-secondary border-border hover:border-accent-light"
                }`}
              >
                {cap}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-xs font-medium text-text-secondary whitespace-nowrap"
          >
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/20"
          >
            {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Provider grid                                                       */}
      {/* ------------------------------------------------------------------ */}
      {filteredProviders.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-text-muted">
            No providers match your current filters.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onViewProfile={() => setSelectedProvider(provider)}
            />
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Detail modal                                                        */}
      {/* ------------------------------------------------------------------ */}
      {selectedProvider && (
        <Modal
          open={!!selectedProvider}
          onClose={() => setSelectedProvider(null)}
          title={selectedProvider.name}
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setSelectedProvider(null)}
              >
                Close
              </Button>
              <Button variant="primary">Request Quote</Button>
            </>
          }
        >
          <ProviderDetail provider={selectedProvider} />
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProviderCard
// ---------------------------------------------------------------------------

function ProviderCard({
  provider,
  onViewProfile,
}: {
  provider: MarketplaceProvider;
  onViewProfile: () => void;
}) {
  return (
    <Card>
      {/* Top row: name + verified */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-text-primary leading-tight">
          {provider.name}
        </h3>
        {provider.verified ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="muted">Unverified</Badge>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={provider.rating} size="sm" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Completed trips */}
        <div>
          <p className="text-xs text-text-muted">Completed</p>
          <p className="text-sm font-semibold text-text-primary">
            {provider.completedTrips.toLocaleString()}
          </p>
        </div>

        {/* On-time */}
        <div>
          <p className="text-xs text-text-muted">On-Time</p>
          <p className="text-sm font-semibold text-text-primary">
            {provider.onTimePercent}%
          </p>
          <ProgressBar
            value={provider.onTimePercent}
            size="sm"
            color={onTimeColor(provider.onTimePercent)}
          />
        </div>

        {/* Vehicles */}
        <div>
          <p className="text-xs text-text-muted">Vehicles</p>
          <p className="text-sm font-semibold text-text-primary">
            {provider.activeVehicles}
          </p>
        </div>
      </div>

      {/* Coverage area */}
      <p className="text-sm text-text-muted mb-3">{provider.coverageArea}</p>

      {/* Capability badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {provider.capabilities.map((cap) => (
          <Badge
            key={cap}
            variant={CAPABILITY_BADGE_VARIANT[cap] ?? "default"}
          >
            {cap.charAt(0).toUpperCase() + cap.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Member since + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="text-xs text-text-muted">
          Member since {formatMemberSince(provider.memberSince)}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button variant="primary" size="sm">
            Request Quote
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ProviderDetail (modal body)
// ---------------------------------------------------------------------------

function ProviderDetail({ provider }: { provider: MarketplaceProvider }) {
  return (
    <div className="space-y-6">
      {/* Verified status */}
      <div className="flex items-center gap-2">
        {provider.verified ? (
          <Badge variant="success">Verified Provider</Badge>
        ) : (
          <Badge variant="muted">Unverified</Badge>
        )}
        <span className="text-xs text-text-muted">
          Member since {formatMemberSince(provider.memberSince)}
        </span>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-1">Rating</p>
        <StarRating rating={provider.rating} size="lg" />
      </div>

      {/* Capabilities */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">
          Capabilities
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.capabilities.map((cap) => (
            <Badge
              key={cap}
              variant={CAPABILITY_BADGE_VARIANT[cap] ?? "default"}
            >
              {cap.charAt(0).toUpperCase() + cap.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Coverage area */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-1">
          Coverage Area
        </p>
        <p className="text-sm text-text-primary">{provider.coverageArea}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm">
          <p className="text-xs text-text-muted mb-1">Active Vehicles</p>
          <p className="text-xl font-bold text-text-primary">
            {provider.activeVehicles}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-muted mb-1">Completed Trips</p>
          <p className="text-xl font-bold text-text-primary">
            {provider.completedTrips.toLocaleString()}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-muted mb-1">On-Time %</p>
          <p className="text-xl font-bold text-text-primary">
            {provider.onTimePercent}%
          </p>
        </Card>
      </div>

      {/* On-time progress bar */}
      <div>
        <ProgressBar
          value={provider.onTimePercent}
          label="On-Time Performance"
          showValue
          color={onTimeColor(provider.onTimePercent)}
        />
      </div>
    </div>
  );
}
