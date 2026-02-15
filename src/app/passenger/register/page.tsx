"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { Banner } from "@/components/common/banner";
import { ProgressBar } from "@/components/common/progress-bar";

const STEP_LABELS = ["Personal Info", "Insurance", "Accessibility", "Confirmation"];

const LANGUAGES = ["English", "Spanish", "Mandarin", "Vietnamese", "Other"];

const MOBILITY_TYPES = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
];

const SPECIAL_NEEDS = [
  { value: "oxygen", label: "Oxygen" },
  { value: "escort", label: "Escort Required" },
  { value: "iv_drip", label: "IV Drip" },
  { value: "monitor", label: "Monitor" },
  { value: "bariatric", label: "Bariatric" },
];

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  preferredLanguage: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  mobilityType: string;
  specialNeeds: string[];
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  preferredLanguage: "English",
  planName: "",
  memberId: "",
  groupNumber: "",
  mobilityType: "ambulatory",
  specialNeeds: [],
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [ocrScanned, setOcrScanned] = useState(false);
  const [registered, setRegistered] = useState(false);

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSpecialNeed(need: string) {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter((n) => n !== need)
        : [...prev.specialNeeds, need],
    }));
  }

  function handleNext() {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setRegistered(true);
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="Register"
        description="Create your MediRoutes passenger account to book rides."
      />

      {/* Progress */}
      <ProgressBar value={step} max={4} className="mb-2" />
      <div className="grid grid-cols-4 gap-1 mb-6">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-[11px] text-center font-medium ${
              i + 1 <= step ? "text-brand" : "text-text-muted"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {registered && (
        <Banner variant="success" dismissible={false}>
          Registration complete! Your passenger account has been created.
        </Banner>
      )}

      {!registered && (
        <>
          {/* Step 1 - Personal Info */}
          {step === 1 && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="First Name" required>
                    <input
                      className={inputClassName}
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <input
                      className={inputClassName}
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField label="Phone" required>
                  <input
                    className={inputClassName}
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </FormField>

                <FormField label="Email">
                  <input
                    className={inputClassName}
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </FormField>

                <FormField label="Date of Birth" required>
                  <input
                    className={inputClassName}
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  />
                </FormField>

                <div className="pt-2">
                  <p className="text-sm font-medium text-text-primary mb-2">Home Address</p>
                  <div className="space-y-3">
                    <FormField label="Street">
                      <input
                        className={inputClassName}
                        placeholder="123 Main St"
                        value={formData.street}
                        onChange={(e) => updateField("street", e.target.value)}
                      />
                    </FormField>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="City" className="col-span-1">
                        <input
                          className={inputClassName}
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                        />
                      </FormField>
                      <FormField label="State">
                        <input
                          className={inputClassName}
                          placeholder="CA"
                          maxLength={2}
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                        />
                      </FormField>
                      <FormField label="ZIP">
                        <input
                          className={inputClassName}
                          placeholder="90210"
                          maxLength={5}
                          value={formData.zip}
                          onChange={(e) => updateField("zip", e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                <FormField label="Preferred Language">
                  <select
                    className={inputClassName}
                    value={formData.preferredLanguage}
                    onChange={(e) => updateField("preferredLanguage", e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </Card>
          )}

          {/* Step 2 - Insurance */}
          {step === 2 && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Insurance Information
              </h2>
              <div className="space-y-3">
                <FormField label="Plan Name">
                  <input
                    className={inputClassName}
                    placeholder="e.g. Blue Cross PPO"
                    value={formData.planName}
                    onChange={(e) => updateField("planName", e.target.value)}
                  />
                </FormField>

                <FormField label="Member ID">
                  <input
                    className={inputClassName}
                    placeholder="Member ID"
                    value={formData.memberId}
                    onChange={(e) => updateField("memberId", e.target.value)}
                  />
                </FormField>

                <FormField label="Group Number">
                  <input
                    className={inputClassName}
                    placeholder="Group number"
                    value={formData.groupNumber}
                    onChange={(e) => updateField("groupNumber", e.target.value)}
                  />
                </FormField>

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setOcrScanned(true)}
                  >
                    Scan Insurance Card
                  </Button>
                </div>

                {ocrScanned && (
                  <Banner variant="info">
                    OCR scan simulated — card data would auto-populate fields above.
                  </Banner>
                )}
              </div>
            </Card>
          )}

          {/* Step 3 - Accessibility */}
          {step === 3 && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Accessibility & Emergency
              </h2>
              <div className="space-y-4">
                <FormField label="Mobility Type" required>
                  <select
                    className={inputClassName}
                    value={formData.mobilityType}
                    onChange={(e) => updateField("mobilityType", e.target.value)}
                  >
                    {MOBILITY_TYPES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">
                    Special Needs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SPECIAL_NEEDS.map((need) => {
                      const checked = formData.specialNeeds.includes(need.value);
                      return (
                        <label
                          key={need.value}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                            checked
                              ? "border-brand bg-brand-lightest text-brand-dark"
                              : "border-border bg-white text-text-secondary hover:bg-surface-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggleSpecialNeed(need.value)}
                          />
                          {checked && <span className="text-brand">&#10003;</span>}
                          {need.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-text-primary mb-3">
                    Emergency Contact
                  </p>
                  <div className="space-y-3">
                    <FormField label="Contact Name">
                      <input
                        className={inputClassName}
                        placeholder="Full name"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          updateField("emergencyContactName", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Relationship">
                      <input
                        className={inputClassName}
                        placeholder="e.g. Spouse, Child, Caregiver"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) =>
                          updateField("emergencyContactRelationship", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Phone">
                      <input
                        className={inputClassName}
                        type="tel"
                        placeholder="(555) 987-6543"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          updateField("emergencyContactPhone", e.target.value)
                        }
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4 - Confirmation */}
          {step === 4 && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Review & Confirm
              </h2>
              <div className="space-y-4 text-sm">
                {/* Personal Info Summary */}
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Personal Info
                  </p>
                  <div className="space-y-1">
                    <Row label="Name" value={`${formData.firstName} ${formData.lastName}`.trim() || "---"} />
                    <Row label="Phone" value={formData.phone || "---"} />
                    <Row label="Email" value={formData.email || "---"} />
                    <Row label="Date of Birth" value={formData.dateOfBirth || "---"} />
                    <Row
                      label="Address"
                      value={
                        [formData.street, formData.city, formData.state, formData.zip]
                          .filter(Boolean)
                          .join(", ") || "---"
                      }
                    />
                    <Row label="Language" value={formData.preferredLanguage} />
                  </div>
                </div>

                {/* Insurance Summary */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Insurance
                  </p>
                  <div className="space-y-1">
                    <Row label="Plan" value={formData.planName || "---"} />
                    <Row label="Member ID" value={formData.memberId || "---"} />
                    <Row label="Group #" value={formData.groupNumber || "---"} />
                  </div>
                </div>

                {/* Accessibility Summary */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Accessibility
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Mobility</span>
                      <Badge variant="brand">
                        {MOBILITY_TYPES.find((m) => m.value === formData.mobilityType)?.label}
                      </Badge>
                    </div>
                    {formData.specialNeeds.length > 0 && (
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-text-muted shrink-0">Needs</span>
                        <div className="flex flex-wrap justify-end gap-1">
                          {formData.specialNeeds.map((n) => (
                            <Badge key={n} variant="info">
                              {SPECIAL_NEEDS.find((s) => s.value === n)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact Summary */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Emergency Contact
                  </p>
                  <div className="space-y-1">
                    <Row label="Name" value={formData.emergencyContactName || "---"} />
                    <Row label="Relationship" value={formData.emergencyContactRelationship || "---"} />
                    <Row label="Phone" value={formData.emergencyContactPhone || "---"} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === 4 ? "Complete Registration" : "Next"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* Small helper for summary rows */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="text-text-primary text-right">{value}</span>
    </div>
  );
}
