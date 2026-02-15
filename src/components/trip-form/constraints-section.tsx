"use client";

import { TripConstraints, MobilityType } from "@/lib/types";
import { FormField, inputClassName } from "@/components/common/form-field";

interface ConstraintsSectionProps {
  constraints: TripConstraints;
  onChange: (constraints: TripConstraints) => void;
}

const mobilityOptions: { value: MobilityType; label: string }[] = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
  { value: "bariatric", label: "Bariatric" },
  { value: "bls", label: "BLS (Basic Life Support)" },
];

const specialNeedsOptions = [
  { value: "oxygen", label: "Oxygen" },
  { value: "car_seat", label: "Car Seat" },
  { value: "bariatric", label: "Bariatric Equipment" },
  { value: "iv_drip", label: "IV Drip" },
  { value: "monitor", label: "Cardiac Monitor" },
];

export function ConstraintsSection({
  constraints,
  onChange,
}: ConstraintsSectionProps) {
  const toggleSpecialNeed = (need: string) => {
    const needs = constraints.specialNeeds.includes(need)
      ? constraints.specialNeeds.filter((n) => n !== need)
      : [...constraints.specialNeeds, need];
    onChange({ ...constraints, specialNeeds: needs });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        Passenger Requirements
      </h3>
      <div className="space-y-4">
        <FormField label="Mobility Type" required>
          <select
            className={inputClassName}
            value={constraints.mobilityType}
            onChange={(e) =>
              onChange({
                ...constraints,
                mobilityType: e.target.value as MobilityType,
              })
            }
          >
            {mobilityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-border text-brand focus:ring-brand-light h-4 w-4"
              checked={constraints.needsEscort}
              onChange={(e) =>
                onChange({
                  ...constraints,
                  needsEscort: e.target.checked,
                  escortCount: e.target.checked
                    ? Math.max(constraints.escortCount, 1)
                    : 0,
                })
              }
            />
            Needs Escort
          </label>

          {constraints.needsEscort && (
            <FormField label="# Escorts">
              <input
                type="number"
                className={`${inputClassName} w-20`}
                min={1}
                max={3}
                value={constraints.escortCount}
                onChange={(e) =>
                  onChange({
                    ...constraints,
                    escortCount: parseInt(e.target.value) || 1,
                  })
                }
              />
            </FormField>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-text-primary mb-2">
            Special Needs
          </p>
          <div className="flex flex-wrap gap-3">
            {specialNeedsOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="rounded border-border text-brand focus:ring-brand-light h-4 w-4"
                  checked={constraints.specialNeeds.includes(opt.value)}
                  onChange={() => toggleSpecialNeed(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
