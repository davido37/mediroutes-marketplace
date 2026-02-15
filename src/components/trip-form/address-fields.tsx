"use client";

import { Address } from "@/lib/types";
import { FormField, inputClassName } from "@/components/common/form-field";

interface AddressFieldsProps {
  label: string;
  address: Address;
  onChange: (address: Address) => void;
  errors?: Record<string, string>;
  prefix: string;
}

export function AddressFields({
  label,
  address,
  onChange,
  errors = {},
  prefix,
}: AddressFieldsProps) {
  const update = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">{label}</h3>
      {address.label && address.label !== "Home" && (
        <p className="text-xs text-text-secondary mb-2">
          {address.label}
        </p>
      )}
      <div className="space-y-3">
        <FormField
          label="Street Address"
          required
          error={errors[`${prefix}.street`]}
        >
          <input
            type="text"
            className={inputClassName}
            value={address.street}
            onChange={(e) => update("street", e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-6 gap-3">
          <FormField
            label="City"
            required
            error={errors[`${prefix}.city`]}
            className="col-span-3"
          >
            <input
              type="text"
              className={inputClassName}
              value={address.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </FormField>

          <FormField
            label="State"
            required
            error={errors[`${prefix}.state`]}
            className="col-span-1"
          >
            <input
              type="text"
              className={inputClassName}
              value={address.state}
              onChange={(e) => update("state", e.target.value)}
              maxLength={2}
            />
          </FormField>

          <FormField
            label="ZIP"
            required
            error={errors[`${prefix}.zip`]}
            className="col-span-2"
          >
            <input
              type="text"
              className={inputClassName}
              value={address.zip}
              onChange={(e) => update("zip", e.target.value)}
              maxLength={10}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
