"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTripFlowContext } from "@/hooks/trip-flow-context";
import { SearchProgressView } from "@/components/options/search-progress";
import { TopPickCard, OptionCard } from "@/components/options/option-card";
import { TripMap } from "@/components/common/trip-map";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FulfillmentOption } from "@/lib/types";
import {
  getTopOptions,
  getRemainingOptions,
  calculateMileage,
  formatDate,
  formatTime,
} from "@/lib/utils";

export default function OptionsPage() {
  const router = useRouter();
  const { state, dispatch, simulateSearch } = useTripFlowContext();
  const { tripRequest, options, searchProgress, step } = state;
  const [showOther, setShowOther] = useState(false);
  const [wmrOptIn, setWmrOptIn] = useState(false);
  const searchStarted = useRef(false);

  useEffect(() => {
    if (!tripRequest) {
      router.replace("/facility/new-trip?token=abc123");
      return;
    }

    if (!searchStarted.current && step !== "compare") {
      searchStarted.current = true;
      simulateSearch(tripRequest.constraints);
    }
  }, [tripRequest, step, dispatch, simulateSearch, router]);

  if (!tripRequest) return null;

  const isSearching = step === "searching";
  const mileage = calculateMileage(tripRequest.pickup, tripRequest.dropoff);

  const optionCounts = {
    fleet: options.filter((o) => o.type === "fleet").length,
    tnc: options.filter((o) => o.type === "tnc").length,
    marketplace: options.filter((o) => o.type === "marketplace").length,
  };

  const handleSelect = (option: FulfillmentOption) => {
    dispatch({ type: "SELECT_OPTION", payload: option });
    router.push("/facility/book");
  };

  const topPicks = getTopOptions(options, tripRequest.constraints);
  const topIds = new Set(topPicks.map((t) => t.option.id));
  const { compatible: otherCompatible, incompatible } = getRemainingOptions(
    options,
    topIds,
    tripRequest.constraints
  );
  const otherCount = otherCompatible.length + incompatible.length;

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-1">
        Fulfillment Options
      </h1>
      <p className="text-sm text-text-secondary mb-4">
        Compare available options across fleet, TNC, and marketplace providers.
      </p>

      {/* Trip info + map */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-lg border border-border bg-white p-4 text-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-text-muted text-xs mb-0.5">Patient</p>
              <p className="font-medium">
                {tripRequest.patient.firstName} {tripRequest.patient.lastName}
              </p>
              <p className="text-xs text-text-secondary">
                ID: {tripRequest.patient.memberId}
              </p>
              <p className="text-xs text-text-secondary">
                {tripRequest.patient.phone}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-0.5">Date &amp; Time</p>
              <p className="font-medium">{formatDate(tripRequest.requestedDate)}</p>
              <p className="text-xs text-text-secondary">
                Requested: {formatTime(tripRequest.requestedTime)}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-0.5">Pickup</p>
              <p className="font-medium">{tripRequest.pickup.label}</p>
              <p className="text-xs text-text-secondary">
                {tripRequest.pickup.street}, {tripRequest.pickup.city},{" "}
                {tripRequest.pickup.state} {tripRequest.pickup.zip}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-0.5">Dropoff</p>
              <p className="font-medium">{tripRequest.dropoff.label}</p>
              <p className="text-xs text-text-secondary">
                {tripRequest.dropoff.street}, {tripRequest.dropoff.city},{" "}
                {tripRequest.dropoff.state} {tripRequest.dropoff.zip}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">{tripRequest.constraints.mobilityType}</Badge>
              {tripRequest.constraints.specialNeeds.map((need) => (
                <Badge key={need} variant="warning">{need}</Badge>
              ))}
              <Badge variant="default">{mileage.toFixed(1)} mi</Badge>
              {tripRequest.willCall && <Badge variant="info">Will Call</Badge>}
              <Badge variant="default">{tripRequest.fundingSource}</Badge>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wmrOptIn}
                onChange={(e) => setWmrOptIn(e.target.checked)}
                className="mt-0.5 rounded border-border text-brand focus:ring-brand"
              />
              <span className="text-xs text-text-secondary leading-tight">
                <span className="font-medium text-text-primary">Send ride tracking link</span>
                <br />
                Passenger will receive an SMS with a live &ldquo;Where&apos;s My Ride?&rdquo;
                tracking link at {tripRequest.patient.phone}
              </span>
            </label>
          </div>
        </div>

        <TripMap
          pickup={tripRequest.pickup}
          dropoff={tripRequest.dropoff}
          mileage={mileage}
        />
      </div>

      {isSearching ? (
        <SearchProgressView
          progress={searchProgress}
          optionCounts={optionCounts}
        />
      ) : (
        <div className="space-y-5">
          {topPicks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
                Top Picks
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topPicks.map(({ option, badge }) => (
                  <TopPickCard
                    key={option.id}
                    option={option}
                    constraints={tripRequest.constraints}
                    badge={badge}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {otherCount > 0 && (
            <div>
              <button
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setShowOther(!showOther)}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showOther ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Other Options ({otherCount})
              </button>

              {showOther && (
                <div className="mt-3 space-y-2">
                  {otherCompatible.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      constraints={tripRequest.constraints}
                      onSelect={handleSelect}
                    />
                  ))}

                  {incompatible.length > 0 && (
                    <>
                      <p className="text-xs text-text-muted pt-2 border-t border-border mt-3">
                        Not compatible with current requirements
                      </p>
                      {incompatible.map((option) => (
                        <OptionCard
                          key={option.id}
                          option={option}
                          constraints={tripRequest.constraints}
                          onSelect={handleSelect}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-start mt-2">
            <Button variant="ghost" onClick={() => router.push("/facility/confirm")}>
              &larr; Back to Trip Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
