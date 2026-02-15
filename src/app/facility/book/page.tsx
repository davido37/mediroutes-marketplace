"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripFlowContext } from "@/hooks/trip-flow-context";
import { TripSummary } from "@/components/common/trip-summary";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import {
  formatCurrency,
  formatETA,
  formatTime,
  getOptionLabel,
  getOptionCost,
  getOptionETA,
} from "@/lib/utils";

export default function BookPage() {
  const router = useRouter();
  const { state, confirmBooking } = useTripFlowContext();
  const { tripRequest, selectedOption } = state;
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!tripRequest || !selectedOption) {
      router.replace("/facility/options");
    }
  }, [tripRequest, selectedOption, router]);

  if (!tripRequest || !selectedOption) return null;

  const handleBook = async () => {
    setBooking(true);
    await confirmBooking(selectedOption);
    router.push("/facility/book/confirmation");
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-1">
        Confirm Booking
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Review your selection and confirm the booking.
      </p>

      {/* Selected option detail */}
      <div className="rounded-lg border-2 border-accent bg-white p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="brand">
            {selectedOption.type === "fleet"
              ? "Fleet"
              : selectedOption.type === "tnc"
                ? "TNC"
                : "Marketplace"}
          </Badge>
          <h2 className="text-lg font-semibold text-text-primary">
            {getOptionLabel(selectedOption)}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Cost</p>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(getOptionCost(selectedOption))}
            </p>
          </div>
          <div>
            <p className="text-text-muted">Pickup ETA</p>
            <p className="text-xl font-bold text-text-primary">
              {formatETA(getOptionETA(selectedOption))}
            </p>
          </div>
          <div>
            <p className="text-text-muted">Est. Pickup</p>
            <p className="font-medium">
              {formatTime(selectedOption.estimatedPickupTime)}
            </p>
          </div>
          <div>
            <p className="text-text-muted">Type</p>
            <p className="font-medium capitalize">
              {selectedOption.type === "fleet"
                ? (selectedOption.vehicleType || "Fleet Vehicle")
                : selectedOption.type === "tnc"
                  ? selectedOption.serviceLevel
                  : "NEMT Provider"}
            </p>
          </div>
        </div>

        {selectedOption.type === "fleet" &&
          selectedOption.tripsImpacted.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-warning-light border border-amber-200">
              <p className="text-sm font-medium text-amber-800">
                Schedule Impact
              </p>
              {selectedOption.tripsImpacted.map((impact) => (
                <p
                  key={impact.tripId}
                  className="text-xs text-amber-700 mt-1"
                >
                  {impact.tripId}: {impact.patientName} &mdash;{" "}
                  {impact.description}
                </p>
              ))}
            </div>
          )}
      </div>

      {/* Trip summary */}
      <div className="mb-6">
        <TripSummary trip={tripRequest} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/facility/options")}>
          &larr; Back to Options
        </Button>
        <Button
          variant="primary"
          size="lg"
          loading={booking}
          onClick={handleBook}
        >
          {booking ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
