"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTripFlowContext } from "@/hooks/trip-flow-context";
import { TripForm } from "@/components/trip-form/trip-form";
import { TripConstraints, Patient } from "@/lib/types";

export default function ConfirmPage() {
  const router = useRouter();
  const { state, dispatch } = useTripFlowContext();
  const { tripRequest, errors } = state;

  useEffect(() => {
    if (!tripRequest) {
      router.replace("/facility/new-trip?token=abc123");
    }
  }, [tripRequest, router]);

  if (!tripRequest) return null;

  const handleUpdate = (updates: Partial<typeof tripRequest>) => {
    dispatch({ type: "UPDATE_TRIP", payload: updates });
  };

  const handleUpdatePatient = (updates: Partial<Patient>) => {
    dispatch({ type: "UPDATE_PATIENT", payload: updates });
  };

  const handleUpdateConstraints = (constraints: Partial<TripConstraints>) => {
    dispatch({ type: "UPDATE_CONSTRAINTS", payload: constraints });
  };

  const handleSubmit = () => {
    router.push("/facility/options");
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-1">
        Confirm Trip Details
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Review the trip information below and make any changes before searching
        for fulfillment options.
      </p>

      <TripForm
        trip={tripRequest}
        onUpdate={handleUpdate}
        onUpdatePatient={handleUpdatePatient}
        onUpdateConstraints={handleUpdateConstraints}
        onSubmit={handleSubmit}
        errors={errors}
      />
    </div>
  );
}
