"use client";

import { useState } from "react";
import {
  FulfillmentOption,
  FleetOption,
  TNCOption,
  MarketplaceOption,
  TripConstraints,
} from "@/lib/types";
import { formatCurrency, formatETA, formatTime, isCompatible } from "@/lib/utils";
import type { OptionBadge } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { VendorLogo } from "@/components/common/vendor-logo";

// === Helper: get vendor for logo ===
function getVendor(option: FulfillmentOption): "mediroutes" | "uber" | "lyft" | "marketplace" {
  if (option.type === "fleet") return "mediroutes";
  if (option.type === "tnc") return option.provider === "uber" ? "uber" : "lyft";
  return "marketplace";
}

function getProviderLabel(option: FulfillmentOption): string {
  if (option.type === "fleet") return option.feasible ? `${option.driverName}` : "Fleet";
  if (option.type === "tnc") return option.serviceLevel;
  return option.providerName;
}

function getTypeLabel(option: FulfillmentOption): string {
  if (option.type === "fleet") return "Your Fleet";
  if (option.type === "tnc") return option.providerDisplayName;
  return "Marketplace";
}

// === Badge config ===
const badgeConfig: Record<OptionBadge, { label: string; colors: string }> = {
  recommended: { label: "Recommended", colors: "bg-accent text-white" },
  fastest: { label: "Fastest", colors: "bg-brand text-white" },
  cheapest: { label: "Best Price", colors: "bg-amber-500 text-white" },
};

// =================================================================
// TOP PICK CARD — compact card for the 3 featured options
// =================================================================

interface TopPickCardProps {
  option: FulfillmentOption;
  constraints: TripConstraints;
  badge: OptionBadge;
  onSelect: (option: FulfillmentOption) => void;
}

export function TopPickCard({ option, constraints, badge, onSelect }: TopPickCardProps) {
  const cost =
    option.type === "fleet" ? option.internalCost
    : option.type === "tnc" ? option.cost
    : option.cost;
  const eta =
    option.type === "fleet" ? option.additionalMinutes
    : option.type === "tnc" ? option.etaMinutes
    : option.etaMinutes;

  const { label, colors } = badgeConfig[badge];

  return (
    <div
      className={`relative flex flex-col rounded-xl border-2 bg-white transition-all hover:shadow-md cursor-pointer ${
        badge === "recommended"
          ? "border-accent ring-1 ring-accent-lightest"
          : "border-border hover:border-accent-light"
      }`}
      onClick={() => onSelect(option)}
    >
      {/* Badge ribbon */}
      <div className={`${colors} text-xs font-semibold px-3 py-1 rounded-t-[10px] text-center`}>
        {label}
      </div>

      <div className="flex flex-col items-center p-4 flex-1">
        {/* Vendor logo */}
        <VendorLogo vendor={getVendor(option)} size={40} />

        {/* Provider / type */}
        <p className="mt-2 text-xs text-text-muted">{getTypeLabel(option)}</p>
        <p className="text-sm font-semibold text-text-primary text-center leading-tight mt-0.5">
          {getProviderLabel(option)}
        </p>

        {/* Cost */}
        <p className="mt-3 text-2xl font-bold text-text-primary">
          {formatCurrency(cost)}
        </p>
        {option.type === "fleet" && (
          <p className="text-[10px] text-text-muted -mt-0.5">internal cost</p>
        )}

        {/* ETA */}
        <p className="mt-2 text-sm text-text-secondary">
          <span className="text-text-muted">ETA:</span>{" "}
          <span className="font-medium">{formatETA(eta)}</span>
        </p>

        {/* Key stat */}
        {option.type === "fleet" && option.tripsImpacted.length > 0 && (
          <p className="mt-1 text-xs text-warning">
            {option.tripsImpacted.length} trip{option.tripsImpacted.length > 1 ? "s" : ""} impacted
          </p>
        )}
        {option.type === "tnc" && option.surgeMultiplier > 1 && (
          <Badge variant="warning" className="mt-1">{option.surgeMultiplier}x surge</Badge>
        )}
        {option.type === "marketplace" && (
          <p className="mt-1 text-xs text-text-muted">
            <span className="text-amber-500">{"★".repeat(Math.round(option.providerRating))}</span>{" "}
            {option.providerRating.toFixed(1)}
          </p>
        )}
      </div>

      {/* Select button */}
      <div className="px-4 pb-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
}

// =================================================================
// DETAIL CARD — used in the "Other Options" expandable section
// =================================================================

interface OptionCardProps {
  option: FulfillmentOption;
  constraints: TripConstraints;
  onSelect: (option: FulfillmentOption) => void;
}

export function OptionCard({ option, constraints, onSelect }: OptionCardProps) {
  const compatible = isCompatible(option, constraints);

  return (
    <div
      className={`rounded-lg border bg-white transition-all ${
        !compatible
          ? "border-border opacity-60"
          : "border-border hover:border-accent-light"
      }`}
    >
      <div className="p-3">
        {option.type === "fleet" && (
          <FleetCardContent
            option={option}
            compatible={compatible}
            onSelect={() => onSelect(option)}
          />
        )}
        {option.type === "tnc" && (
          <TNCCardContent
            option={option}
            compatible={compatible}
            onSelect={() => onSelect(option)}
          />
        )}
        {option.type === "marketplace" && (
          <MarketplaceCardContent
            option={option}
            compatible={compatible}
            onSelect={() => onSelect(option)}
          />
        )}
      </div>
    </div>
  );
}

// === Fleet Card ===

function FleetCardContent({
  option,
  compatible,
  onSelect,
}: {
  option: FleetOption;
  compatible: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3">
        <VendorLogo vendor="mediroutes" size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">
              {option.feasible ? `${option.driverName} — ${option.vehicleType}` : "Fleet"}
            </span>
            {option.feasible ? (
              <Badge variant="success">Feasible</Badge>
            ) : (
              <Badge variant="danger">Not Feasible</Badge>
            )}
          </div>
        </div>
        {option.feasible && (
          <span className="text-base font-bold text-text-primary whitespace-nowrap">
            {formatCurrency(option.internalCost)}
          </span>
        )}
      </div>

      {option.feasible ? (
        <>
          <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
            <span>ETA: <strong>{formatETA(option.additionalMinutes)}</strong></span>
            <span>+{option.additionalMiles} mi</span>
            <span className={option.tripsImpacted.length > 0 ? "text-warning" : "text-success"}>
              {option.tripsImpacted.length} trips impacted
            </span>
          </div>

          {option.tripsImpacted.length > 0 && (
            <div className="mt-1.5">
              <button
                className="text-xs text-brand hover:underline"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Hide" : "Show"} schedule impact
              </button>
              {expanded && (
                <div className="mt-1.5 space-y-1.5">
                  {option.tripsImpacted.map((impact) => (
                    <div key={impact.tripId} className="rounded bg-warning-light px-2.5 py-1.5 text-xs">
                      <p className="font-medium text-amber-800">
                        {impact.tripId}: {impact.patientName}
                      </p>
                      <p className="text-amber-700">{impact.description}</p>
                    </div>
                  ))}
                  {option.scheduleChanges.map((change, i) => (
                    <p key={i} className="text-xs text-text-secondary pl-1">
                      &bull; {change}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-2.5 flex justify-end">
            <Button variant="primary" size="sm" onClick={onSelect}>
              Select Fleet
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-2 space-y-0.5">
          {option.reasons?.map((reason, i) => (
            <p key={i} className="text-xs text-text-secondary">
              &bull; {reason}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// === TNC Card ===

function TNCCardContent({
  option,
  compatible,
  onSelect,
}: {
  option: TNCOption;
  compatible: boolean;
  onSelect: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <VendorLogo vendor={option.provider === "uber" ? "uber" : "lyft"} size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{option.serviceLevel}</span>
            {!compatible && <Badge variant="danger">Not Compatible</Badge>}
            {option.surgeMultiplier > 1 && (
              <Badge variant="warning">{option.surgeMultiplier}x surge</Badge>
            )}
          </div>
        </div>
        <span className="text-base font-bold text-text-primary whitespace-nowrap">
          {formatCurrency(option.cost)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
        <span>ETA: <strong>{formatETA(option.etaMinutes)}</strong></span>
        <span>Pickup: <strong>{formatTime(option.estimatedPickupTime)}</strong></span>
        {option.capabilities.length > 0 && (
          <span className="flex gap-1">
            {option.capabilities.map((cap) => (
              <Badge key={cap} variant="default">{cap.replace(/_/g, " ")}</Badge>
            ))}
          </span>
        )}
      </div>

      {compatible && (
        <div className="mt-2.5 flex justify-end">
          <Button variant="primary" size="sm" onClick={onSelect}>
            Select {option.serviceLevel}
          </Button>
        </div>
      )}
    </div>
  );
}

// === Marketplace Card ===

function MarketplaceCardContent({
  option,
  compatible,
  onSelect,
}: {
  option: MarketplaceOption;
  compatible: boolean;
  onSelect: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <VendorLogo vendor="marketplace" size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{option.providerName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="text-amber-500">
              {"★".repeat(Math.round(option.providerRating))}
            </span>
            <span>{option.providerRating.toFixed(1)}</span>
            <span>&bull;</span>
            <span>{option.completedTrips.toLocaleString()} trips</span>
          </div>
        </div>
        <span className="text-base font-bold text-text-primary whitespace-nowrap">
          {formatCurrency(option.cost)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
        <span>ETA: <strong>{formatETA(option.etaMinutes)}</strong></span>
        <span className="flex items-center gap-1">
          Reliability:
          <span className="inline-block h-1.5 w-12 rounded-full bg-surface-muted overflow-hidden">
            <span
              className={`block h-full rounded-full ${
                option.reliabilityScore >= 90
                  ? "bg-success"
                  : option.reliabilityScore >= 80
                    ? "bg-warning"
                    : "bg-danger"
              }`}
              style={{ width: `${option.reliabilityScore}%` }}
            />
          </span>
          <strong>{option.reliabilityScore}%</strong>
        </span>
      </div>

      {compatible && (
        <div className="mt-2.5 flex justify-end">
          <Button variant="primary" size="sm" onClick={onSelect}>
            Select Provider
          </Button>
        </div>
      )}
    </div>
  );
}
