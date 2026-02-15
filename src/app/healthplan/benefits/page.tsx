"use client";

import { useState, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Tabs } from "@/components/common/tabs";
import { ToggleSwitch } from "@/components/common/toggle-switch";
import { FormField, inputClassName } from "@/components/common/form-field";
import { MOCK_HEALTH_PLANS } from "@/lib/mock-data";
import type { BenefitConfig, LevelOfService, HealthPlanType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ALL_LOS: { value: LevelOfService; label: string }[] = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
  { value: "bariatric", label: "Bariatric" },
  { value: "bls", label: "BLS" },
];

const PLAN_TYPE_BADGE: Record<
  HealthPlanType,
  { variant: "success" | "brand" | "info"; label: string }
> = {
  medicaid_mco: { variant: "success", label: "Medicaid MCO" },
  medicare_advantage: { variant: "brand", label: "Medicare Advantage" },
  commercial: { variant: "info", label: "Commercial" },
};

/** Deep-clone the benefit configs for a plan, keyed by product id. */
function buildInitialState(planId: string): Record<string, BenefitConfig> {
  const plan = MOCK_HEALTH_PLANS.find((p) => p.id === planId);
  if (!plan) return {};
  const state: Record<string, BenefitConfig> = {};
  for (const product of plan.products) {
    state[product.id] = { ...product.benefitConfig, coveredLOS: [...product.benefitConfig.coveredLOS] };
  }
  return state;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Benefits() {
  const [activePlanId, setActivePlanId] = useState(MOCK_HEALTH_PLANS[0].id);
  const [configs, setConfigs] = useState<Record<string, BenefitConfig>>(() =>
    buildInitialState(MOCK_HEALTH_PLANS[0].id),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  // Re-initialise local state when the user switches plans
  useEffect(() => {
    setConfigs(buildInitialState(activePlanId));
    setSaveState("idle");
  }, [activePlanId]);

  const activePlan = MOCK_HEALTH_PLANS.find((p) => p.id === activePlanId)!;

  // Generic updater for a specific product's config field
  const updateConfig = useCallback(
    (productId: string, field: keyof BenefitConfig, value: BenefitConfig[keyof BenefitConfig]) => {
      setConfigs((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], [field]: value },
      }));
      setSaveState("idle");
    },
    [],
  );

  // Toggle a single LOS value in coveredLOS
  const toggleLOS = useCallback(
    (productId: string, los: LevelOfService) => {
      setConfigs((prev) => {
        const current = prev[productId].coveredLOS;
        const next = current.includes(los)
          ? current.filter((l) => l !== los)
          : [...current, los];
        return {
          ...prev,
          [productId]: { ...prev[productId], coveredLOS: next },
        };
      });
      setSaveState("idle");
    },
    [],
  );

  // Simulate saving
  const handleSave = useCallback(() => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 600);
  }, []);

  // -------------------------------------------------------------------------
  // Tabs config
  // -------------------------------------------------------------------------

  const tabs = MOCK_HEALTH_PLANS.map((plan) => ({
    id: plan.id,
    label: plan.name,
    badge: PLAN_TYPE_BADGE[plan.type].label,
  }));

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      <PageHeader
        title="Benefits Configuration"
        description="Define NEMT coverage rules, trip limits, and eligible services by plan type."
      />

      {/* Plan selector tabs */}
      <Tabs tabs={tabs} activeTab={activePlanId} onChange={setActivePlanId} className="mb-6" />

      {/* Plan type badge */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-text-secondary">Plan type:</span>
        <Badge variant={PLAN_TYPE_BADGE[activePlan.type].variant}>
          {PLAN_TYPE_BADGE[activePlan.type].label}
        </Badge>
      </div>

      {/* Product cards */}
      <div className="space-y-6">
        {activePlan.products.map((product) => {
          const cfg = configs[product.id];
          if (!cfg) return null;

          return (
            <Card key={product.id} padding="lg">
              <h2 className="text-base font-semibold text-text-primary mb-5">
                {product.name}
              </h2>

              {/* ---- Trip Limits ---- */}
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Trip Limits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Max Trips Per Year">
                    <input
                      type="number"
                      min={0}
                      className={inputClassName}
                      value={cfg.maxTripsPerYear}
                      onChange={(e) =>
                        updateConfig(product.id, "maxTripsPerYear", Number(e.target.value))
                      }
                    />
                  </FormField>
                  <FormField label="Max Miles Per Trip">
                    <input
                      type="number"
                      min={0}
                      className={inputClassName}
                      value={cfg.maxMilesPerTrip}
                      onChange={(e) =>
                        updateConfig(product.id, "maxMilesPerTrip", Number(e.target.value))
                      }
                    />
                  </FormField>
                </div>
              </section>

              {/* ---- Covered Levels of Service ---- */}
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Covered Levels of Service
                </h3>
                <div className="flex flex-wrap gap-4">
                  {ALL_LOS.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-accent focus:ring-brand-light"
                        checked={cfg.coveredLOS.includes(value)}
                        onChange={() => toggleLOS(product.id, value)}
                      />
                      <span className="text-sm text-text-primary">{label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* ---- Authorization ---- */}
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Authorization
                </h3>
                <ToggleSwitch
                  checked={cfg.requiresAuthorization}
                  onChange={(checked) =>
                    updateConfig(product.id, "requiresAuthorization", checked)
                  }
                  label="Requires prior authorization"
                />
              </section>

              {/* ---- Cost Sharing ---- */}
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Cost Sharing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Copay">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className={`${inputClassName} pl-7`}
                        value={cfg.copay}
                        onChange={(e) =>
                          updateConfig(product.id, "copay", Number(e.target.value))
                        }
                      />
                    </div>
                  </FormField>
                  <FormField label="Coinsurance">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className={`${inputClassName} pr-7`}
                        value={cfg.coinsurancePercent}
                        onChange={(e) =>
                          updateConfig(product.id, "coinsurancePercent", Number(e.target.value))
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        %
                      </span>
                    </div>
                  </FormField>
                </div>
              </section>

              {/* ---- Escort ---- */}
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Escort
                </h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={cfg.escortCovered}
                    onChange={(checked) => {
                      updateConfig(product.id, "escortCovered", checked);
                      if (!checked) {
                        updateConfig(product.id, "maxEscorts", 0);
                      }
                    }}
                    label="Escort covered"
                  />
                  <FormField label="Max Escorts">
                    <input
                      type="number"
                      min={0}
                      className={inputClassName}
                      value={cfg.maxEscorts}
                      disabled={!cfg.escortCovered}
                      onChange={(e) =>
                        updateConfig(product.id, "maxEscorts", Number(e.target.value))
                      }
                    />
                  </FormField>
                </div>
              </section>

              {/* ---- Scheduling ---- */}
              <section>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Scheduling
                </h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={cfg.willCallAllowed}
                    onChange={(checked) =>
                      updateConfig(product.id, "willCallAllowed", checked)
                    }
                    label="Will-call allowed"
                  />
                  <ToggleSwitch
                    checked={cfg.roundTripAllowed}
                    onChange={(checked) =>
                      updateConfig(product.id, "roundTripAllowed", checked)
                    }
                    label="Round trip allowed"
                  />
                </div>
              </section>
            </Card>
          );
        })}
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={handleSave}
          loading={saveState === "saving"}
          disabled={saveState === "saving"}
        >
          {saveState === "saved" ? "Saved!" : "Save Changes"}
        </Button>
        {saveState === "saved" && (
          <span className="text-sm text-success font-medium">
            Changes saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}
