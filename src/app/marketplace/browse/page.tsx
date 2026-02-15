"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { SearchInput } from "@/components/common/search-input";
import { Countdown } from "@/components/common/countdown";
import { Modal } from "@/components/common/modal";
import { FormField, inputClassName } from "@/components/common/form-field";
import { MOCK_MARKETPLACE_TRIPS, MOCK_MARKETPLACE_OFFERS } from "@/lib/mock-data";
import type { MarketplaceTrip, LevelOfService } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type LOSFilter = "all" | "ambulatory" | "wheelchair" | "stretcher" | "bariatric";
type StatusFilter = "all" | "open" | "offered" | "expiring";
type SortOption = "price_asc" | "price_desc" | "expiring" | "distance" | "most_offers";

const LOS_FILTERS: { value: LOSFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
  { value: "bariatric", label: "Bariatric" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "offered", label: "With Offers" },
  { value: "expiring", label: "Expiring Soon" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc", label: "Price (low-high)" },
  { value: "price_desc", label: "Price (high-low)" },
  { value: "expiring", label: "Expiring Soon" },
  { value: "distance", label: "Distance" },
  { value: "most_offers", label: "Most Offers" },
];

const LOS_BADGE_MAP: Record<LevelOfService, "success" | "brand" | "danger" | "warning"> = {
  ambulatory: "success",
  wheelchair: "brand",
  stretcher: "danger",
  bariatric: "warning",
  bls: "danger",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function getOfferCountForTrip(tripId: string): number {
  return MOCK_MARKETPLACE_OFFERS.filter((o) => o.tripId === tripId).length;
}

function isExpiringSoon(expiresAt: string): boolean {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < 1000 * 60 * 30; // within 30 minutes
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BrowseTrips() {
  // State
  const [search, setSearch] = useState("");
  const [losFilter, setLosFilter] = useState<LOSFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("expiring");
  const [submittedOffers, setSubmittedOffers] = useState<Set<string>>(new Set());

  // Modal state
  const [modalTrip, setModalTrip] = useState<MarketplaceTrip | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNotes, setOfferNotes] = useState("");

  // Base set: only open or offered
  const activeTrips = useMemo(
    () => MOCK_MARKETPLACE_TRIPS.filter((t) => t.status === "open" || t.status === "offered"),
    []
  );

  // Filtered + sorted
  const filteredTrips = useMemo(() => {
    let results = [...activeTrips];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (t) =>
          t.posterName.toLowerCase().includes(q) ||
          t.cityLevel.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    // LOS filter
    if (losFilter !== "all") {
      results = results.filter((t) => t.levelOfService === losFilter);
    }

    // Status filter
    if (statusFilter === "open") {
      results = results.filter((t) => t.status === "open");
    } else if (statusFilter === "offered") {
      results = results.filter((t) => t.status === "offered");
    } else if (statusFilter === "expiring") {
      results = results.filter((t) => isExpiringSoon(t.expiresAt));
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.suggestedPrice - b.suggestedPrice;
        case "price_desc":
          return b.suggestedPrice - a.suggestedPrice;
        case "expiring":
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        case "distance":
          return a.estimatedMiles - b.estimatedMiles;
        case "most_offers":
          return getOfferCountForTrip(b.id) - getOfferCountForTrip(a.id);
        default:
          return 0;
      }
    });

    return results;
  }, [activeTrips, search, losFilter, statusFilter, sortBy]);

  // Modal handlers
  function openOfferModal(trip: MarketplaceTrip) {
    setModalTrip(trip);
    setOfferAmount(trip.suggestedPrice.toFixed(2));
    setOfferNotes("");
  }

  function handleSubmitOffer() {
    if (!modalTrip) return;
    setSubmittedOffers((prev) => new Set(prev).add(modalTrip.id));
    setModalTrip(null);
    setOfferAmount("");
    setOfferNotes("");
  }

  return (
    <div>
      <PageHeader
        title="Browse Trips"
        description="Search and filter open marketplace trips by location, LOS, and price."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="info">{activeTrips.length} Available</Badge>
            <Badge variant="success">{submittedOffers.size} Offered</Badge>
          </div>
        }
      />

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by poster, city, or trip ID..."
        className="mb-4"
      />

      {/* LOS Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {LOS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              losFilter === f.value
                ? "bg-brand text-white border-brand"
                : "bg-white text-text-secondary border-border hover:bg-surface-muted"
            }`}
            onClick={() => setLosFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Status filter + Sort row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                statusFilter === f.value
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-text-secondary border-border hover:bg-surface-muted"
              }`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted whitespace-nowrap">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-text-primary focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/20"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted mb-4">
        Showing {filteredTrips.length} of {activeTrips.length} trips
      </p>

      {/* Trip cards */}
      <div className="space-y-4">
        {filteredTrips.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">No trips match your current filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setLosFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-2 text-xs text-accent hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </Card>
        )}

        {filteredTrips.map((trip) => {
          const offerCount = getOfferCountForTrip(trip.id);
          const hasSubmitted = submittedOffers.has(trip.id);
          const losVariant = LOS_BADGE_MAP[trip.levelOfService] ?? "default";
          const expiringSoon = isExpiringSoon(trip.expiresAt);

          return (
            <Card
              key={trip.id}
              className={hasSubmitted ? "border-success bg-success-light/20" : ""}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left content */}
                <div className="flex-1 min-w-0">
                  {/* Top row: ID + badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-accent">
                      {trip.id.toUpperCase()}
                    </span>
                    <Badge variant={losVariant}>
                      {trip.levelOfService.charAt(0).toUpperCase() +
                        trip.levelOfService.slice(1)}
                    </Badge>
                    <span className="text-xs text-text-muted">{trip.cityLevel}</span>
                    {expiringSoon && <Badge variant="danger">Expiring</Badge>}
                    {offerCount > 0 && (
                      <Badge variant="info">
                        {offerCount} offer{offerCount !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  {/* Poster + appointment */}
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                    <span className="text-text-secondary">
                      Posted by: <strong className="text-text-primary">{trip.posterName}</strong>
                    </span>
                    <span className="text-text-secondary">
                      Appt: <strong className="text-text-primary">
                        {formatTime(trip.appointmentWindow.start)} &ndash;{" "}
                        {formatTime(trip.appointmentWindow.end)}
                      </strong>
                    </span>
                  </div>

                  {/* Distance + special requirements */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <span>{trip.estimatedMiles} mi</span>
                    {trip.specialRequirements.length > 0 &&
                      trip.specialRequirements.map((req) => (
                        <Badge key={req} variant="warning">
                          {req.replace(/_/g, " ")}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Right side: pricing + actions */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-text-primary">
                    {formatPrice(trip.suggestedPrice)}
                  </p>
                  <p className="text-xs text-text-muted">suggested price</p>
                  <p className="text-xs text-text-muted mt-1">
                    Floor: {formatPrice(trip.floorPrice)}
                  </p>
                  {trip.currentBestOffer !== undefined && (
                    <p className="text-xs text-text-secondary mt-0.5">
                      Best offer: <strong>{formatPrice(trip.currentBestOffer)}</strong>
                    </p>
                  )}

                  <div className="mt-2">
                    <Countdown expiresAt={trip.expiresAt} />
                  </div>

                  <div className="mt-3">
                    {hasSubmitted ? (
                      <Badge variant="success" className="text-center">
                        Offer Submitted
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => openOfferModal(trip)}>
                        Make Offer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Make Offer Modal */}
      {modalTrip && (
        <Modal
          open={!!modalTrip}
          onClose={() => setModalTrip(null)}
          title="Make an Offer"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalTrip(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitOffer}
                disabled={
                  !offerAmount ||
                  isNaN(Number(offerAmount)) ||
                  Number(offerAmount) <= 0
                }
              >
                Submit Offer
              </Button>
            </>
          }
        >
          {/* Trip summary */}
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-muted p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-accent">
                  {modalTrip.id.toUpperCase()}
                </span>
                <Badge variant={LOS_BADGE_MAP[modalTrip.levelOfService] ?? "default"}>
                  {modalTrip.levelOfService.charAt(0).toUpperCase() +
                    modalTrip.levelOfService.slice(1)}
                </Badge>
                <span className="text-xs text-text-muted">{modalTrip.estimatedMiles} mi</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-text-muted text-xs">Poster</p>
                  <p className="text-text-primary font-medium">{modalTrip.posterName}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">City</p>
                  <p className="text-text-primary font-medium">{modalTrip.cityLevel}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Appointment</p>
                  <p className="text-text-primary font-medium">
                    {formatTime(modalTrip.appointmentWindow.start)} &ndash;{" "}
                    {formatTime(modalTrip.appointmentWindow.end)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Expires</p>
                  <Countdown expiresAt={modalTrip.expiresAt} />
                </div>
              </div>
            </div>

            {/* Pricing context */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold text-text-primary">
                  {formatPrice(modalTrip.suggestedPrice)}
                </p>
                <p className="text-xs text-text-muted">Suggested</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold text-text-secondary">
                  {formatPrice(modalTrip.floorPrice)}
                </p>
                <p className="text-xs text-text-muted">Floor</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold text-text-primary">
                  {modalTrip.currentBestOffer !== undefined
                    ? formatPrice(modalTrip.currentBestOffer)
                    : "--"}
                </p>
                <p className="text-xs text-text-muted">Current Best</p>
              </div>
            </div>

            {/* Offer input */}
            <FormField label="Your Offer Amount" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className={`${inputClassName} pl-7`}
                  placeholder="0.00"
                />
              </div>
            </FormField>

            <FormField label="Notes (optional)">
              <textarea
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                className={`${inputClassName} min-h-[80px] resize-y`}
                placeholder="Any additional details for the poster..."
              />
            </FormField>
          </div>
        </Modal>
      )}
    </div>
  );
}
