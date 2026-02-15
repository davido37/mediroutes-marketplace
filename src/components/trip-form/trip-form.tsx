"use client";

import { useState } from "react";
import { TripRequest, Address, TripConstraints, Patient, FundingSource, LevelOfService } from "@/lib/types";
import { validateTripForm } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { Banner } from "@/components/common/banner";
import { Badge } from "@/components/common/badge";
import { FormField, inputClassName } from "@/components/common/form-field";
import { AddressFields } from "./address-fields";
import { ConstraintsSection } from "./constraints-section";

interface TripFormProps {
  trip: TripRequest;
  onUpdate: (updates: Partial<TripRequest>) => void;
  onUpdatePatient: (updates: Partial<Patient>) => void;
  onUpdateConstraints: (constraints: Partial<TripConstraints>) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
}

const fundingSourceOptions: { value: FundingSource; label: string }[] = [
  { value: "medicaid", label: "Medicaid" },
  { value: "medicare", label: "Medicare" },
  { value: "commercial", label: "Commercial Insurance" },
  { value: "self_pay", label: "Self Pay" },
  { value: "grant", label: "Grant" },
  { value: "other", label: "Other" },
];

const levelOfServiceOptions: { value: LevelOfService; label: string }[] = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
  { value: "bariatric", label: "Bariatric" },
  { value: "bls", label: "BLS (Basic Life Support)" },
];

export function TripForm({
  trip,
  onUpdate,
  onUpdatePatient,
  onUpdateConstraints,
  onSubmit,
  errors,
}: TripFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const validationErrors = validateTripForm(trip);
  const isValid = Object.keys(validationErrors).length === 0;
  const allErrors = { ...validationErrors, ...errors };

  // Summarize what's set in advanced options for the collapsed view
  const advancedSummary: string[] = [];
  if (trip.constraints.mobilityType !== "ambulatory") {
    advancedSummary.push(trip.constraints.mobilityType);
  }
  if (trip.constraints.needsEscort) {
    advancedSummary.push(`escort (${trip.constraints.escortCount})`);
  }
  if (trip.constraints.specialNeeds.length > 0) {
    advancedSummary.push(...trip.constraints.specialNeeds);
  }

  return (
    <div className="space-y-6">
      {trip.source.prefilled && trip.source.system === "salesforce" && (
        <Banner variant="info">
          <span className="font-medium">Prefilled from Salesforce</span>
          {trip.source.recordId && (
            <span className="ml-2 text-xs opacity-75">
              Ref: {trip.source.recordId}
            </span>
          )}
          <span className="block text-xs mt-0.5">
            Please review and confirm all details before continuing.
          </span>
        </Banner>
      )}

      {/* Patient info (editable) */}
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Patient Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FormField label="First Name" required>
            <input
              type="text"
              className={inputClassName}
              value={trip.patient.firstName}
              onChange={(e) =>
                onUpdatePatient({ firstName: e.target.value })
              }
            />
          </FormField>
          <FormField label="Last Name" required>
            <input
              type="text"
              className={inputClassName}
              value={trip.patient.lastName}
              onChange={(e) =>
                onUpdatePatient({ lastName: e.target.value })
              }
            />
          </FormField>
          <FormField label="Date of Birth">
            <input
              type="date"
              className={inputClassName}
              value={trip.patient.dateOfBirth}
              onChange={(e) =>
                onUpdatePatient({ dateOfBirth: e.target.value })
              }
            />
          </FormField>
          <FormField label="Member ID">
            <input
              type="text"
              className={inputClassName}
              value={trip.patient.memberId}
              onChange={(e) =>
                onUpdatePatient({ memberId: e.target.value })
              }
            />
          </FormField>
          <FormField label="Phone" className="sm:col-span-2">
            <input
              type="tel"
              className={inputClassName}
              value={trip.patient.phone}
              onChange={(e) =>
                onUpdatePatient({ phone: e.target.value })
              }
            />
          </FormField>
        </div>
      </div>

      {/* Addresses */}
      <div className="rounded-lg border border-border bg-white p-4 space-y-6">
        <AddressFields
          label="Pickup Location"
          address={trip.pickup}
          onChange={(pickup: Address) => onUpdate({ pickup })}
          errors={allErrors}
          prefix="pickup"
        />

        <div className="border-t border-border" />

        <AddressFields
          label="Dropoff Location"
          address={trip.dropoff}
          onChange={(dropoff: Address) => onUpdate({ dropoff })}
          errors={allErrors}
          prefix="dropoff"
        />
      </div>

      {/* Date, Time, Trip Type */}
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Date"
            required
            error={allErrors.requestedDate}
          >
            <input
              type="date"
              className={inputClassName}
              value={trip.requestedDate}
              onChange={(e) =>
                onUpdate({ requestedDate: e.target.value })
              }
            />
          </FormField>

          <FormField
            label="Requested Time"
            required
            error={allErrors.requestedTime}
          >
            <input
              type="time"
              className={inputClassName}
              value={trip.requestedTime}
              onChange={(e) =>
                onUpdate({ requestedTime: e.target.value })
              }
            />
          </FormField>

          <FormField label="Appointment Time">
            <input
              type="time"
              className={inputClassName}
              value={trip.appointmentTime || ""}
              onChange={(e) =>
                onUpdate({ appointmentTime: e.target.value || undefined })
              }
            />
          </FormField>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary mb-2">
              Trip Type
            </p>
            <div className="flex gap-2">
              {(["one_way", "round_trip"] as const).map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    trip.tripType === type
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-text-secondary border-border hover:bg-surface-muted"
                  }`}
                  onClick={() => onUpdate({ tripType: type })}
                >
                  {type === "one_way" ? "One Way" : "Round Trip"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mt-6">
              <input
                type="checkbox"
                className="rounded border-border text-brand focus:ring-brand-light h-4 w-4"
                checked={trip.willCall}
                onChange={(e) => onUpdate({ willCall: e.target.checked })}
              />
              <span>
                <span className="font-medium text-text-primary">Will Call</span>
                <span className="text-text-muted ml-1">(pickup on patient request)</span>
              </span>
            </label>
          </div>
        </div>

        <div className="mt-2">
          <Badge variant="info">
            Default: Today, soonest available
          </Badge>
        </div>
      </div>

      {/* Funding & Level of Service */}
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Funding &amp; Service Level
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Funding Source" required>
            <select
              className={inputClassName}
              value={trip.fundingSource}
              onChange={(e) =>
                onUpdate({ fundingSource: e.target.value as FundingSource })
              }
            >
              {fundingSourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Level of Service" required>
            <select
              className={inputClassName}
              value={trip.levelOfService}
              onChange={(e) =>
                onUpdate({ levelOfService: e.target.value as LevelOfService })
              }
            >
              {levelOfServiceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Authorization #" className="sm:col-span-2">
            <input
              type="text"
              className={inputClassName}
              value={trip.authorizationNumber || ""}
              onChange={(e) =>
                onUpdate({ authorizationNumber: e.target.value || undefined })
              }
              placeholder="Optional — for pre-authorized trips"
            />
          </FormField>
        </div>
      </div>

      {/* Advanced Options (collapsible) */}
      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-muted transition-colors rounded-lg"
          onClick={() => setAdvancedOpen(!advancedOpen)}
        >
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Advanced Options
            </h3>
            {!advancedOpen && advancedSummary.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {advancedSummary.map((item) => (
                  <Badge key={item} variant="brand">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
            {!advancedOpen && advancedSummary.length === 0 && (
              <p className="text-xs text-text-muted mt-0.5">
                Mobility type, escort, special needs
              </p>
            )}
          </div>
          <span className="text-text-muted text-lg shrink-0 ml-4">
            {advancedOpen ? "\u2212" : "+"}
          </span>
        </button>

        {advancedOpen && (
          <div className="px-4 pb-4 border-t border-border pt-4">
            <ConstraintsSection
              constraints={trip.constraints}
              onChange={(c) => onUpdateConstraints(c)}
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-border bg-white p-4">
        <FormField label="Notes / Special Instructions">
          <textarea
            className={`${inputClassName} min-h-[80px]`}
            value={trip.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Any additional instructions for the driver or provider..."
          />
        </FormField>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={!isValid}
        >
          Continue to Options
        </Button>
      </div>
    </div>
  );
}
