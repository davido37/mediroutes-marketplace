"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTripFlowContext } from "@/hooks/trip-flow-context";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { TripSummary } from "@/components/common/trip-summary";
import {
  formatCurrency,
  formatTime,
  getOptionLabel,
  getOptionCost,
} from "@/lib/utils";

export default function ConfirmationPage() {
  const router = useRouter();
  const { state, dispatch } = useTripFlowContext();
  const { booking, tripRequest } = state;

  useEffect(() => {
    if (!booking) {
      router.replace("/facility/new-trip?token=abc123");
    }
  }, [booking, router]);

  if (!booking || !tripRequest) return null;

  const handleCreateAnother = () => {
    dispatch({ type: "RESET" });
    router.push("/facility/new-trip?token=abc123");
  };

  return (
    <div>
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-light mb-4">
          <span className="text-success text-3xl">&#10003;</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Trip Booked Successfully
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          The trip has been created and the provider has been notified.
        </p>
      </div>

      {/* Confirmation details */}
      <div className="rounded-lg border-2 border-success bg-success-light p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-green-700">Trip ID</p>
            <p className="text-lg font-bold text-green-900">
              {booking.tripId}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700">Confirmation Number</p>
            <p className="text-lg font-bold text-green-900">
              {booking.confirmationNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700">Provider</p>
            <p className="font-semibold text-green-900">
              {getOptionLabel(booking.selectedOption)}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700">Cost</p>
            <p className="font-semibold text-green-900">
              {formatCurrency(getOptionCost(booking.selectedOption))}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700">Estimated Pickup</p>
            <p className="font-semibold text-green-900">
              {formatTime(booking.estimatedPickupTime)}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700">Channel</p>
            <Badge
              variant={
                booking.selectedOption.type === "fleet"
                  ? "brand"
                  : booking.selectedOption.type === "tnc"
                    ? "info"
                    : "success"
              }
            >
              {booking.selectedOption.type === "fleet"
                ? "Internal Fleet"
                : booking.selectedOption.type === "tnc"
                  ? "TNC"
                  : "Marketplace"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-lg border border-border bg-white p-5 mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Next Steps
        </h3>
        <ol className="space-y-2">
          {booking.nextSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-text-secondary"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand text-xs font-semibold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Trip summary */}
      <div className="mb-6">
        <TripSummary trip={tripRequest} />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="primary" onClick={handleCreateAnother}>
          Create Another Trip
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/facility/dashboard")}
        >
          View Dashboard
        </Button>
      </div>
    </div>
  );
}
