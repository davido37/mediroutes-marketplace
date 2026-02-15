"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Tabs } from "@/components/common/tabs";
import { Modal } from "@/components/common/modal";
import { FormField, inputClassName } from "@/components/common/form-field";
import { StarRating } from "@/components/common/star-rating";
import { Countdown } from "@/components/common/countdown";
import { PriceTag } from "@/components/common/price-tag";
import {
  MOCK_MARKETPLACE_OFFERS,
  MOCK_MARKETPLACE_TRIPS,
} from "@/lib/mock-data";
import type { MarketplaceOffer, MarketplaceOfferStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_BADGE_VARIANT: Record<
  MarketplaceOfferStatus,
  "info" | "success" | "danger" | "warning" | "muted"
> = {
  pending: "info",
  accepted: "success",
  declined: "danger",
  countered: "warning",
  expired: "muted",
};

const STATUS_LABEL: Record<MarketplaceOfferStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  countered: "Countered",
  expired: "Expired",
};

/** IDs of posters that count as "my posted trips" */
const MY_POSTER_IDS = new Set(["org-vmc", "org-bhn"]);

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("my-offers");
  const [localOffers, setLocalOffers] = useState<MarketplaceOffer[]>(() =>
    MOCK_MARKETPLACE_OFFERS.map((o) => ({ ...o }))
  );
  const [counterModal, setCounterModal] = useState<{
    open: boolean;
    offerId: string;
    price: number;
    notes: string;
  }>({ open: false, offerId: "", price: 0, notes: "" });

  // ---- Derived data -------------------------------------------------------

  /** Trips posted by my org */
  const myPostedTrips = useMemo(
    () => MOCK_MARKETPLACE_TRIPS.filter((t) => MY_POSTER_IDS.has(t.posterId)),
    []
  );

  const myPostedTripIds = useMemo(
    () => new Set(myPostedTrips.map((t) => t.id)),
    [myPostedTrips]
  );

  /** Offers I made (provider-001) */
  const myOffers = useMemo(
    () => localOffers.filter((o) => o.providerId === "provider-001"),
    [localOffers]
  );

  /** Offers received on my posted trips */
  const offersReceived = useMemo(
    () => localOffers.filter((o) => myPostedTripIds.has(o.tripId)),
    [localOffers, myPostedTripIds]
  );

  /** Group offers-received by trip */
  const offersReceivedByTrip = useMemo(() => {
    const map = new Map<string, MarketplaceOffer[]>();
    for (const o of offersReceived) {
      const arr = map.get(o.tripId) ?? [];
      arr.push(o);
      map.set(o.tripId, arr);
    }
    return map;
  }, [offersReceived]);

  /** All offers for stats */
  const allRelevant = useMemo(
    () => [...myOffers, ...offersReceived],
    [myOffers, offersReceived]
  );

  const stats = useMemo(() => {
    const total = allRelevant.length;
    const pending = allRelevant.filter((o) => o.status === "pending").length;
    const accepted = allRelevant.filter((o) => o.status === "accepted").length;
    const countered = allRelevant.filter(
      (o) => o.status === "countered"
    ).length;
    return { total, pending, accepted, countered };
  }, [allRelevant]);

  // ---- Trip lookup helper -------------------------------------------------

  function tripFor(tripId: string) {
    return MOCK_MARKETPLACE_TRIPS.find((t) => t.id === tripId);
  }

  // ---- Actions ------------------------------------------------------------

  function updateOfferStatus(offerId: string, status: MarketplaceOfferStatus) {
    setLocalOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? { ...o, status, respondedAt: new Date().toISOString() }
          : o
      )
    );
  }

  function openCounterModal(offer: MarketplaceOffer) {
    setCounterModal({
      open: true,
      offerId: offer.id,
      price: offer.offeredPrice,
      notes: "",
    });
  }

  function sendCounter() {
    setLocalOffers((prev) =>
      prev.map((o) =>
        o.id === counterModal.offerId
          ? {
              ...o,
              status: "countered" as MarketplaceOfferStatus,
              counterPrice: counterModal.price,
              counterNotes: counterModal.notes,
              respondedAt: new Date().toISOString(),
            }
          : o
      )
    );
    setCounterModal({ open: false, offerId: "", price: 0, notes: "" });
  }

  // ---- Tab config ---------------------------------------------------------

  const tabs = [
    { id: "my-offers", label: "My Offers", badge: myOffers.length },
    {
      id: "offers-received",
      label: "Offers Received",
      badge: offersReceived.length,
    },
  ];

  // ---- Render helpers -----------------------------------------------------

  function renderMyOfferCard(offer: MarketplaceOffer) {
    const trip = tripFor(offer.tripId);

    return (
      <Card key={offer.id} className="mb-3">
        {/* Top row: ID + status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-sm font-semibold text-accent">
              {offer.tripId.toUpperCase()}
            </span>
            <div className="mt-1">
              <StarRating rating={offer.providerRating} size="sm" />
            </div>
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[offer.status]}>
            {STATUS_LABEL[offer.status]}
          </Badge>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-3 mb-3">
          <div>
            <span className="text-xs text-text-muted">Your offer</span>
            <div className="font-bold text-lg text-text-primary">
              {formatCurrency(offer.offeredPrice)}
            </div>
          </div>
          {trip && (
            <div>
              <span className="text-xs text-text-muted">Suggested</span>
              <div className="text-sm text-text-muted">
                {formatCurrency(trip.suggestedPrice)}
              </div>
            </div>
          )}
        </div>

        {/* Counter section */}
        {offer.status === "countered" && offer.counterPrice != null && (
          <div className="rounded-lg bg-warning-light/40 border border-amber-200 p-3 mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs font-medium text-amber-800">
                Counter offer:
              </span>
              <span className="font-bold text-amber-900">
                {formatCurrency(offer.counterPrice)}
              </span>
            </div>
            {offer.counterNotes && (
              <p className="text-xs text-amber-800">{offer.counterNotes}</p>
            )}
          </div>
        )}

        {/* Trip details */}
        {trip && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="purple">{trip.levelOfService}</Badge>
            <span className="text-xs text-text-muted">
              {trip.estimatedMiles} mi
            </span>
            <span className="text-xs text-text-muted">
              {trip.posterName}
            </span>
            {trip.expiresAt && (
              <Countdown expiresAt={trip.expiresAt} />
            )}
          </div>
        )}

        {/* Credential indicator */}
        {offer.credentialVerified && (
          <p className="text-xs text-green-700 mb-3 flex items-center gap-1">
            <span className="text-green-600">&#10003;</span>
            Credentials verified
          </p>
        )}

        {/* Submitted at */}
        <p className="text-xs text-text-muted mb-3">
          Submitted {formatRelativeTime(offer.submittedAt)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {offer.status === "countered" && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => updateOfferStatus(offer.id, "accepted")}
              >
                Accept Counter
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => updateOfferStatus(offer.id, "declined")}
              >
                Decline
              </Button>
            </>
          )}
          {offer.status === "pending" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateOfferStatus(offer.id, "expired")}
            >
              Withdraw
            </Button>
          )}
          {offer.status === "accepted" && (
            <Button size="sm" variant="primary">
              View Trip
            </Button>
          )}
        </div>
      </Card>
    );
  }

  function renderReceivedOfferCard(offer: MarketplaceOffer) {
    return (
      <div
        key={offer.id}
        className="flex flex-col gap-2 border-b border-border pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
      >
        {/* Provider info */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-sm font-medium text-text-primary">
              {offer.providerName}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={offer.providerRating} size="sm" />
              {offer.credentialVerified && (
                <Badge variant="success">Verified</Badge>
              )}
            </div>
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[offer.status]}>
            {STATUS_LABEL[offer.status]}
          </Badge>
        </div>

        {/* Price */}
        <div>
          <PriceTag price={offer.offeredPrice} size="sm" />
        </div>

        {/* Submitted */}
        <p className="text-xs text-text-muted">
          Submitted {formatRelativeTime(offer.submittedAt)}
        </p>

        {/* Actions for pending offers */}
        {offer.status === "pending" && (
          <div className="flex items-center gap-2 mt-1">
            <Button
              size="sm"
              variant="primary"
              onClick={() => updateOfferStatus(offer.id, "accepted")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openCounterModal(offer)}
            >
              Counter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateOfferStatus(offer.id, "declined")}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ---- Main render --------------------------------------------------------

  return (
    <div>
      <PageHeader
        title="Offer Management"
        description="Track offers you've made and manage offers received on your posted trips."
        breadcrumbs={[
          { label: "Marketplace", href: "/marketplace/dashboard" },
          { label: "Offers" },
        ]}
      />

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card padding="sm">
          <p className="text-xs text-text-muted mb-1">Total Offers</p>
          <p className="text-xl font-bold text-text-primary">{stats.total}</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-text-muted">Pending</p>
            <Badge variant="info">{stats.pending}</Badge>
          </div>
          <p className="text-xl font-bold text-text-primary">{stats.pending}</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-text-muted">Accepted</p>
            <Badge variant="success">{stats.accepted}</Badge>
          </div>
          <p className="text-xl font-bold text-text-primary">
            {stats.accepted}
          </p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-text-muted">Countered</p>
            <Badge variant="warning">{stats.countered}</Badge>
          </div>
          <p className="text-xl font-bold text-text-primary">
            {stats.countered}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {/* ================================================================
            Tab 1 — My Offers
        ================================================================ */}
        {activeTab === "my-offers" && (
          <div>
            {myOffers.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-muted">
                  You have not submitted any offers yet.
                </p>
              </Card>
            ) : (
              myOffers.map(renderMyOfferCard)
            )}
          </div>
        )}

        {/* ================================================================
            Tab 2 — Offers Received
        ================================================================ */}
        {activeTab === "offers-received" && (
          <div>
            {offersReceivedByTrip.size === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-muted">
                  No offers received on your posted trips.
                </p>
              </Card>
            ) : (
              Array.from(offersReceivedByTrip.entries()).map(
                ([tripId, offers]) => {
                  const trip = tripFor(tripId);
                  if (!trip) return null;

                  return (
                    <Card key={tripId} className="mb-4">
                      {/* Trip header */}
                      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-accent">
                              {trip.id.toUpperCase()}
                            </span>
                            <Badge variant="purple">
                              {trip.levelOfService}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            {trip.posterName} &middot; {trip.estimatedMiles} mi
                            &middot; Suggested{" "}
                            {formatCurrency(trip.suggestedPrice)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <Countdown expiresAt={trip.expiresAt} />
                          <p className="text-xs text-text-muted mt-1">
                            {offers.length} offer
                            {offers.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Offers list */}
                      {offers.map(renderReceivedOfferCard)}
                    </Card>
                  );
                }
              )
            )}
          </div>
        )}
      </div>

      {/* =================================================================
          Counter Modal
      ================================================================= */}
      <Modal
        open={counterModal.open}
        onClose={() =>
          setCounterModal({ open: false, offerId: "", price: 0, notes: "" })
        }
        title="Send Counter Offer"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setCounterModal({
                  open: false,
                  offerId: "",
                  price: 0,
                  notes: "",
                })
              }
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={sendCounter}>
              Send Counter
            </Button>
          </>
        }
      >
        {(() => {
          const targetOffer = localOffers.find(
            (o) => o.id === counterModal.offerId
          );
          return (
            <div className="space-y-4">
              {targetOffer && (
                <div className="rounded-lg bg-surface-muted p-3">
                  <p className="text-xs text-text-muted mb-1">
                    Current offer from {targetOffer.providerName}
                  </p>
                  <PriceTag price={targetOffer.offeredPrice} size="md" />
                </div>
              )}

              <FormField label="Counter Price" required>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={counterModal.price}
                  onChange={(e) =>
                    setCounterModal((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Notes">
                <textarea
                  rows={3}
                  value={counterModal.notes}
                  onChange={(e) =>
                    setCounterModal((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Explain your counter offer..."
                  className={inputClassName}
                />
              </FormField>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
