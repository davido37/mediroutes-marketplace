"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { Banner } from "@/components/common/banner";
import { PriceTag } from "@/components/common/price-tag";
import { getMockPricingResult } from "@/lib/mock-data";

const SPECIAL_REQUIREMENTS = [
  { key: "wheelchair_ramp", label: "Wheelchair Ramp" },
  { key: "escort", label: "Escort" },
  { key: "oxygen", label: "Oxygen" },
  { key: "stretcher", label: "Stretcher" },
  { key: "bariatric", label: "Bariatric" },
  { key: "monitor", label: "Monitor" },
  { key: "iv_drip", label: "IV Drip" },
] as const;

interface FormState {
  patientName: string;
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation: string;
  dropoffAddress: string;
  levelOfService: string;
  estimatedMiles: number;
  appointmentDate: string;
  appointmentTimeStart: string;
  appointmentTimeEnd: string;
  specialRequirements: string[];
  notes: string;
  askingPrice: number;
  floorPrice: number;
  listingDuration: string;
  autoAcceptThreshold: number | "";
}

export default function PostTrip() {
  const [form, setForm] = useState<FormState>({
    patientName: "",
    pickupLocation: "",
    pickupAddress: "",
    dropoffLocation: "",
    dropoffAddress: "",
    levelOfService: "ambulatory",
    estimatedMiles: 8,
    appointmentDate: "",
    appointmentTimeStart: "",
    appointmentTimeEnd: "",
    specialRequirements: [],
    notes: "",
    askingPrice: 0,
    floorPrice: 0,
    listingDuration: "2h",
    autoAcceptThreshold: "",
  });

  const [posted, setPosted] = useState(false);

  // Compute pricing directly from current form values
  const pricing = getMockPricingResult(form.estimatedMiles, form.levelOfService);

  // Sync asking/floor prices with pricing when they are at their initial 0 values
  const askingPrice =
    form.askingPrice === 0 ? pricing.suggestedBuyerRate : form.askingPrice;
  const floorPrice =
    form.floorPrice === 0 ? pricing.percentile25 : form.floorPrice;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRequirement(req: string) {
    setForm((prev) => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(req)
        ? prev.specialRequirements.filter((r) => r !== req)
        : [...prev.specialRequirements, req],
    }));
  }

  function getImpactArrow(impact: "increases" | "decreases" | "neutral") {
    if (impact === "increases") return { symbol: "\u2191", color: "text-danger" };
    if (impact === "decreases") return { symbol: "\u2193", color: "text-success" };
    return { symbol: "\u2192", color: "text-text-muted" };
  }

  return (
    <div>
      <PageHeader
        title="Post a Trip"
        description="Create a new marketplace listing for providers to bid on."
        breadcrumbs={[
          { label: "Marketplace", href: "/marketplace/dashboard" },
          { label: "Post Trip" },
        ]}
      />

      {posted && (
        <div className="mb-6">
          <Banner variant="success" dismissible>
            Trip posted successfully! Providers in the Phoenix metro area will be notified. You can track offers on the{" "}
            <a href="/marketplace/offers" className="font-semibold underline">
              Offers
            </a>{" "}
            page.
          </Banner>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================================================================
            Section 1: Trip Details
            ================================================================ */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Trip Details
            </h2>

            <div className="space-y-4">
              <FormField label="Patient Name" required>
                <input
                  type="text"
                  className={inputClassName}
                  placeholder="Patient name"
                  value={form.patientName}
                  onChange={(e) => updateField("patientName", e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Pickup Location" required>
                  <input
                    type="text"
                    className={inputClassName}
                    placeholder="e.g. Patient Home"
                    value={form.pickupLocation}
                    onChange={(e) =>
                      updateField("pickupLocation", e.target.value)
                    }
                  />
                </FormField>
                <FormField label="Pickup Address" required>
                  <input
                    type="text"
                    className={inputClassName}
                    placeholder="Street address, city, state, zip"
                    value={form.pickupAddress}
                    onChange={(e) =>
                      updateField("pickupAddress", e.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Dropoff Location" required>
                  <input
                    type="text"
                    className={inputClassName}
                    placeholder="e.g. Kaiser Permanente Central"
                    value={form.dropoffLocation}
                    onChange={(e) =>
                      updateField("dropoffLocation", e.target.value)
                    }
                  />
                </FormField>
                <FormField label="Dropoff Address" required>
                  <input
                    type="text"
                    className={inputClassName}
                    placeholder="Street address, city, state, zip"
                    value={form.dropoffAddress}
                    onChange={(e) =>
                      updateField("dropoffAddress", e.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Level of Service" required>
                  <select
                    className={inputClassName}
                    value={form.levelOfService}
                    onChange={(e) =>
                      updateField("levelOfService", e.target.value)
                    }
                  >
                    <option value="ambulatory">Ambulatory</option>
                    <option value="wheelchair">Wheelchair</option>
                    <option value="stretcher">Stretcher</option>
                    <option value="bariatric">Bariatric</option>
                  </select>
                </FormField>
                <FormField label="Estimated Miles" required>
                  <input
                    type="number"
                    className={inputClassName}
                    min={0}
                    step={0.1}
                    value={form.estimatedMiles}
                    onChange={(e) =>
                      updateField(
                        "estimatedMiles",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Appointment Date" required>
                  <input
                    type="date"
                    className={inputClassName}
                    value={form.appointmentDate}
                    onChange={(e) =>
                      updateField("appointmentDate", e.target.value)
                    }
                  />
                </FormField>
                <FormField label="Appointment Time Start" required>
                  <input
                    type="time"
                    className={inputClassName}
                    value={form.appointmentTimeStart}
                    onChange={(e) =>
                      updateField("appointmentTimeStart", e.target.value)
                    }
                  />
                </FormField>
                <FormField label="Appointment Time End" required>
                  <input
                    type="time"
                    className={inputClassName}
                    value={form.appointmentTimeEnd}
                    onChange={(e) =>
                      updateField("appointmentTimeEnd", e.target.value)
                    }
                  />
                </FormField>
              </div>

              <FormField label="Special Requirements">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SPECIAL_REQUIREMENTS.map((req) => {
                    const isSelected = form.specialRequirements.includes(
                      req.key
                    );
                    return (
                      <label
                        key={req.key}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? "border-accent bg-accent/5 text-accent"
                            : "border-border bg-white text-text-secondary hover:bg-surface-muted"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => toggleRequirement(req.key)}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                            isSelected
                              ? "border-accent bg-accent text-white"
                              : "border-border bg-white"
                          }`}
                        >
                          {isSelected && "\u2713"}
                        </span>
                        {req.label}
                      </label>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Notes">
                <textarea
                  className={`${inputClassName} min-h-[80px] resize-y`}
                  placeholder="Additional notes for providers (optional)"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                />
              </FormField>
            </div>
          </Card>

          {/* ================================================================
              Section 3: Listing Configuration
              ================================================================ */}
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Listing Configuration
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Your Asking Price ($)" required>
                  <input
                    type="number"
                    className={inputClassName}
                    min={0}
                    step={0.01}
                    value={askingPrice}
                    onChange={(e) =>
                      updateField(
                        "askingPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </FormField>
                <FormField label="Floor Price (Minimum You'll Accept) ($)" required>
                  <input
                    type="number"
                    className={inputClassName}
                    min={0}
                    step={0.01}
                    value={floorPrice}
                    onChange={(e) =>
                      updateField(
                        "floorPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Listing Duration" required>
                  <select
                    className={inputClassName}
                    value={form.listingDuration}
                    onChange={(e) =>
                      updateField("listingDuration", e.target.value)
                    }
                  >
                    <option value="1h">1 hour</option>
                    <option value="2h">2 hours</option>
                    <option value="4h">4 hours</option>
                    <option value="8h">8 hours</option>
                  </select>
                </FormField>
                <FormField label="Auto-Accept Threshold ($)">
                  <input
                    type="number"
                    className={inputClassName}
                    min={0}
                    step={0.01}
                    placeholder="Auto-accept offers at or above this price"
                    value={form.autoAcceptThreshold}
                    onChange={(e) =>
                      updateField(
                        "autoAcceptThreshold",
                        e.target.value === ""
                          ? ""
                          : parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* ================================================================
              Bottom Actions
              ================================================================ */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button variant="secondary">Save as Draft</Button>
            <Button variant="primary" onClick={() => setPosted(true)}>
              Post to Marketplace
            </Button>
          </div>
        </div>

        {/* ================================================================
            Section 2: Pricing (sidebar on lg)
            ================================================================ */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-text-primary">
                ML Pricing Suggestion
              </h2>
              <Badge variant="purple">AI</Badge>
            </div>

            <div className="space-y-5">
              {/* Suggested Rates */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Suggested Buyer Rate
                  </p>
                  <PriceTag
                    price={pricing.suggestedBuyerRate}
                    marketIndicator={pricing.marketIndicator}
                    size="lg"
                  />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Suggested Seller Rate
                  </p>
                  <PriceTag price={pricing.suggestedSellerRate} size="md" />
                </div>
              </div>

              <hr className="border-border" />

              {/* Market Rates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Median Market Rate</span>
                  <span className="font-semibold text-text-primary">
                    ${pricing.medianRate.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">25th - 75th Percentile</span>
                  <span className="font-medium text-text-secondary">
                    ${pricing.percentile25.toFixed(2)} &ndash; $
                    {pricing.percentile75.toFixed(2)}
                  </span>
                </div>
              </div>

              <hr className="border-border" />

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-text-muted">Confidence</span>
                  <span className="font-semibold text-text-primary">
                    {Math.round(pricing.confidence * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pricing.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Sample Size */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Sample Size</span>
                <span className="font-medium text-text-secondary">
                  {pricing.sampleSize.toLocaleString()} trips
                </span>
              </div>

              {/* Acceptance Probability */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Acceptance Probability</span>
                <Badge variant="success">
                  {Math.round(pricing.acceptanceProbability * 100)}%
                </Badge>
              </div>

              <hr className="border-border" />

              {/* Explainability */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">
                  How was this calculated?
                </p>
                <p className="text-xs text-text-muted leading-relaxed">
                  {pricing.explainabilityText}
                </p>
              </div>

              <hr className="border-border" />

              {/* Pricing Factors */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2">
                  Pricing Factors
                </p>
                <div className="space-y-2">
                  {pricing.factors.map((factor) => {
                    const arrow = getImpactArrow(factor.impact);
                    return (
                      <div
                        key={factor.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-base font-bold ${arrow.color}`}
                          >
                            {arrow.symbol}
                          </span>
                          <span className="text-text-secondary">
                            {factor.name}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {Math.round(factor.weight * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
