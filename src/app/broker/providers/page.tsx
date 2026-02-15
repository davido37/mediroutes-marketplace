"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { SearchInput } from "@/components/common/search-input";
import { StarRating } from "@/components/common/star-rating";
import { ProgressBar } from "@/components/common/progress-bar";
import {
  MOCK_MARKETPLACE_PROVIDERS,
  type MarketplaceProvider,
} from "@/lib/mock-data";

const CAPABILITY_BADGE_VARIANT: Record<string, "success" | "brand" | "danger" | "warning"> = {
  ambulatory: "success",
  wheelchair: "brand",
  stretcher: "danger",
  bariatric: "warning",
};

const CAPABILITY_LABELS: Record<string, string> = {
  ambulatory: "Ambulatory",
  wheelchair: "Wheelchair",
  stretcher: "Stretcher",
  bariatric: "Bariatric",
};

function computeNetworkCoverage(providers: MarketplaceProvider[]) {
  const capabilities = ["ambulatory", "wheelchair", "stretcher", "bariatric"] as const;
  return capabilities.map((cap) => {
    const matching = providers.filter((p) => p.capabilities.includes(cap));
    const totalVehicles = matching.reduce((sum, p) => sum + p.activeVehicles, 0);
    return {
      capability: cap,
      label: CAPABILITY_LABELS[cap],
      providerCount: matching.length,
      vehicleCount: totalVehicles,
    };
  });
}

export default function BrokerProviders() {
  const [search, setSearch] = useState("");

  const filteredProviders = useMemo(() => {
    if (!search.trim()) return MOCK_MARKETPLACE_PROVIDERS;
    const q = search.toLowerCase();
    return MOCK_MARKETPLACE_PROVIDERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.coverageArea.toLowerCase().includes(q)
    );
  }, [search]);

  const verifiedCount = MOCK_MARKETPLACE_PROVIDERS.filter((p) => p.verified).length;
  const avgOnTime = Math.round(
    MOCK_MARKETPLACE_PROVIDERS.reduce((sum, p) => sum + p.onTimePercent, 0) /
      MOCK_MARKETPLACE_PROVIDERS.length
  );

  const networkCoverage = useMemo(
    () => computeNetworkCoverage(MOCK_MARKETPLACE_PROVIDERS),
    []
  );

  return (
    <div>
      <PageHeader
        title="Provider Network"
        actions={<Button variant="primary">Add Provider</Button>}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-text-muted uppercase tracking-wide">Total Providers</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {MOCK_MARKETPLACE_PROVIDERS.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted uppercase tracking-wide">Verified</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {verifiedCount}{" "}
            <Badge variant="success">Verified</Badge>
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted uppercase tracking-wide">Avg On-Time %</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{avgOnTime}%</p>
        </Card>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by provider name or coverage area..."
        className="mb-6"
      />

      {/* Provider Cards Grid */}
      {filteredProviders.length === 0 ? (
        <Card className="text-center py-12 mb-6">
          <p className="text-text-muted text-sm">
            No providers match your search.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}

      {/* Network Coverage Summary */}
      <Card>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Network Coverage Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-text-muted font-medium">Capability</th>
                <th className="text-right py-2 px-4 text-text-muted font-medium">Providers</th>
                <th className="text-right py-2 pl-4 text-text-muted font-medium">Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {networkCoverage.map((row) => (
                <tr key={row.capability} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4">
                    <Badge variant={CAPABILITY_BADGE_VARIANT[row.capability]}>
                      {row.label}
                    </Badge>
                  </td>
                  <td className="text-right py-2.5 px-4 font-medium text-text-primary">
                    {row.providerCount}
                  </td>
                  <td className="text-right py-2.5 pl-4 font-medium text-text-primary">
                    {row.vehicleCount}
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

/* -------------------------------------------------------------------------- */
/* Provider Card                                                              */
/* -------------------------------------------------------------------------- */

function ProviderCard({ provider }: { provider: MarketplaceProvider }) {
  const onTimeColor =
    provider.onTimePercent >= 95
      ? "success"
      : provider.onTimePercent >= 90
        ? "brand"
        : provider.onTimePercent >= 85
          ? "warning"
          : "danger";

  return (
    <Card>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary">{provider.name}</h3>
          <StarRating rating={provider.rating} size="sm" className="mt-1" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {provider.verified ? (
            <Badge variant="success">Verified</Badge>
          ) : (
            <Badge variant="muted">Unverified</Badge>
          )}
          {provider.verified ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="warning">Pending</Badge>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-text-muted">Trips</p>
          <p className="text-sm font-semibold text-text-primary">
            {provider.completedTrips.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">On-Time</p>
          <p className="text-sm font-semibold text-text-primary mb-1">
            {provider.onTimePercent}%
          </p>
          <ProgressBar value={provider.onTimePercent} size="sm" color={onTimeColor} />
        </div>
        <div>
          <p className="text-xs text-text-muted">Vehicles</p>
          <p className="text-sm font-semibold text-text-primary">
            {provider.activeVehicles}
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {provider.capabilities.map((cap) => (
          <Badge
            key={cap}
            variant={CAPABILITY_BADGE_VARIANT[cap] ?? "default"}
          >
            {CAPABILITY_LABELS[cap] ?? cap}
          </Badge>
        ))}
      </div>

      {/* Coverage area */}
      <p className="text-xs text-text-muted mb-4">{provider.coverageArea}</p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm">
          View Details
        </Button>
        <Button variant="primary" size="sm">
          Assign Trips
        </Button>
      </div>
    </Card>
  );
}
