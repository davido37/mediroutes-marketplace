"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { PriceTag } from "@/components/common/price-tag";
import { ProgressBar } from "@/components/common/progress-bar";
import { getMockPricingResult } from "@/lib/mock-data";
import type { PricingResult } from "@/lib/types";

// ============================================================================
// Historical comparison mock data
// ============================================================================

const historicalTrips = [
  { description: "8.5 mi Wheelchair", buyer: 42, seller: 45, actual: 48 },
  { description: "12.1 mi Stretcher", buyer: 158, seller: 145, actual: 152 },
  { description: "5.3 mi Ambulatory", buyer: 24, seller: 21, actual: 23 },
  { description: "10.0 mi Wheelchair", buyer: 52, seller: 48, actual: 50 },
  { description: "15.8 mi Bariatric", buyer: 195, seller: 180, actual: 188 },
];

// ============================================================================
// Helper: format currency
// ============================================================================

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

// ============================================================================
// Market Range Bar component
// ============================================================================

function MarketRangeBar({
  p25,
  median,
  p75,
}: {
  p25: number;
  median: number;
  p75: number;
}) {
  // Map values to percentages within the visual range
  const rangeMin = p25 * 0.85;
  const rangeMax = p75 * 1.15;
  const total = rangeMax - rangeMin;

  const p25Pos = ((p25 - rangeMin) / total) * 100;
  const medianPos = ((median - rangeMin) / total) * 100;
  const p75Pos = ((p75 - rangeMin) / total) * 100;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-text-secondary mb-2">
        Market Range
      </p>
      <div className="relative h-4 rounded-full bg-surface-muted overflow-hidden">
        {/* Left segment (below p25) */}
        <div
          className="absolute top-0 h-full bg-blue-100 rounded-l-full"
          style={{ left: 0, width: `${p25Pos}%` }}
        />
        {/* Middle segment (p25 to p75) */}
        <div
          className="absolute top-0 h-full bg-brand/30"
          style={{ left: `${p25Pos}%`, width: `${p75Pos - p25Pos}%` }}
        />
        {/* Right segment (above p75) */}
        <div
          className="absolute top-0 h-full bg-blue-100 rounded-r-full"
          style={{ left: `${p75Pos}%`, width: `${100 - p75Pos}%` }}
        />

        {/* P25 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-info border-2 border-white shadow-sm"
          style={{ left: `${p25Pos}%`, transform: "translate(-50%, -50%)" }}
        />
        {/* Median marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand border-2 border-white shadow-md"
          style={{ left: `${medianPos}%`, transform: "translate(-50%, -50%)" }}
        />
        {/* P75 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-info border-2 border-white shadow-sm"
          style={{ left: `${p75Pos}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Labels below the bar */}
      <div className="relative h-5 mt-1">
        <span
          className="absolute text-[10px] text-text-muted"
          style={{ left: `${p25Pos}%`, transform: "translateX(-50%)" }}
        >
          P25: {fmt(p25)}
        </span>
        <span
          className="absolute text-[10px] font-semibold text-text-primary"
          style={{ left: `${medianPos}%`, transform: "translateX(-50%)" }}
        >
          Median: {fmt(median)}
        </span>
        <span
          className="absolute text-[10px] text-text-muted"
          style={{ left: `${p75Pos}%`, transform: "translateX(-50%)" }}
        >
          P75: {fmt(p75)}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Main page component
// ============================================================================

export default function PricingEngine() {
  // Form state
  const [pickupZip, setPickupZip] = useState("85004");
  const [dropoffZip, setDropoffZip] = useState("85251");
  const [miles, setMiles] = useState(10);
  const [los, setLos] = useState("wheelchair");
  const [payerType, setPayerType] = useState("medicaid");
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Result state
  const [result, setResult] = useState<PricingResult | null>(null);

  const calculate = useCallback(() => {
    const pricing = getMockPricingResult(miles, los);
    setResult(pricing);
  }, [miles, los]);

  // Auto-calculate on mount
  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div>
      <PageHeader
        title="ML Pricing Engine"
        description="AI-powered suggested pricing based on market data, distance, and level of service."
        breadcrumbs={[
          { label: "Marketplace", href: "/marketplace" },
          { label: "Pricing Engine" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================================================================ */}
        {/* LEFT COLUMN — 2/3 width                                          */}
        {/* ================================================================ */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---- Price Calculator Input ---- */}
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Price Calculator
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Pickup ZIP">
                <input
                  type="text"
                  className={inputClassName}
                  value={pickupZip}
                  onChange={(e) => setPickupZip(e.target.value)}
                  maxLength={5}
                />
              </FormField>

              <FormField label="Dropoff ZIP">
                <input
                  type="text"
                  className={inputClassName}
                  value={dropoffZip}
                  onChange={(e) => setDropoffZip(e.target.value)}
                  maxLength={5}
                />
              </FormField>

              <FormField label="Distance (miles)">
                <input
                  type="number"
                  className={inputClassName}
                  value={miles}
                  onChange={(e) => setMiles(Number(e.target.value))}
                  min={1}
                  step={0.1}
                />
              </FormField>

              <FormField label="Level of Service">
                <select
                  className={inputClassName}
                  value={los}
                  onChange={(e) => setLos(e.target.value)}
                >
                  <option value="ambulatory">Ambulatory</option>
                  <option value="wheelchair">Wheelchair</option>
                  <option value="stretcher">Stretcher</option>
                  <option value="bariatric">Bariatric</option>
                </select>
              </FormField>

              <FormField label="Payer Type">
                <select
                  className={inputClassName}
                  value={payerType}
                  onChange={(e) => setPayerType(e.target.value)}
                >
                  <option value="medicaid">Medicaid</option>
                  <option value="medicare">Medicare</option>
                  <option value="commercial">Commercial</option>
                  <option value="self_pay">Self Pay</option>
                </select>
              </FormField>

              <FormField label="Date / Time">
                <input
                  type="datetime-local"
                  className={inputClassName}
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <Button onClick={calculate}>Calculate</Button>
            </div>
          </Card>

          {/* ---- Pricing Analysis Results ---- */}
          {result && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Pricing Analysis
              </h2>

              {/* Suggested rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Suggested Buyer Rate
                  </p>
                  <PriceTag
                    price={result.suggestedBuyerRate}
                    marketIndicator={result.marketIndicator}
                    size="lg"
                  />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Suggested Seller Rate
                  </p>
                  <PriceTag price={result.suggestedSellerRate} size="md" />
                </div>
              </div>

              {/* Market range bar */}
              <MarketRangeBar
                p25={result.percentile25}
                median={result.medianRate}
                p75={result.percentile75}
              />

              {/* Acceptance probability & confidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <ProgressBar
                  label="Acceptance Probability"
                  value={result.acceptanceProbability * 100}
                  max={100}
                  showValue
                  color="success"
                />
                <ProgressBar
                  label="Confidence"
                  value={result.confidence * 100}
                  max={100}
                  showValue
                  color="info"
                />
              </div>
            </Card>
          )}
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN — 1/3 width                                         */}
        {/* ================================================================ */}
        <div className="lg:col-span-1 space-y-6">
          {/* ---- Explainability ---- */}
          {result && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-3">
                How This Price Was Calculated
              </h2>

              <p className="text-sm text-text-secondary mb-4">
                {result.explainabilityText}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-text-muted">Sample Size:</span>
                <Badge variant="brand">{result.sampleSize} trips</Badge>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Factor Breakdown
                </p>
                {result.factors.map((factor) => (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm font-medium ${
                            factor.impact === "increases"
                              ? "text-green-600"
                              : factor.impact === "decreases"
                                ? "text-red-500"
                                : "text-text-muted"
                          }`}
                        >
                          {factor.impact === "increases"
                            ? "\u2191"
                            : factor.impact === "decreases"
                              ? "\u2193"
                              : "\u2192"}
                        </span>
                        <span className="text-sm text-text-primary">
                          {factor.name}
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      value={factor.weight * 100}
                      max={100}
                      size="sm"
                      color={
                        factor.impact === "increases"
                          ? "success"
                          : factor.impact === "decreases"
                            ? "danger"
                            : "brand"
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ---- Historical Comparison ---- */}
          <Card padding="none">
            <div className="p-4 pb-0">
              <h2 className="text-base font-semibold text-text-primary mb-3">
                Historical Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-2 text-xs font-medium text-text-muted">
                      Trip
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-text-muted text-right">
                      Buyer
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-text-muted text-right">
                      Seller
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-text-muted text-right">
                      Actual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicalTrips.map((trip, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0 hover:bg-surface-muted/50"
                    >
                      <td className="px-4 py-2 text-text-primary whitespace-nowrap">
                        {trip.description}
                      </td>
                      <td className="px-4 py-2 text-right text-text-secondary">
                        {fmt(trip.buyer)}
                      </td>
                      <td className="px-4 py-2 text-right text-text-secondary">
                        {fmt(trip.seller)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-text-primary">
                        {fmt(trip.actual)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM FULL-WIDTH — Market Trends                                */}
        {/* ================================================================ */}
        <div className="lg:col-span-3">
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Market Trends
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Average fill rate */}
              <div>
                <p className="text-xs text-text-muted mb-1">
                  Average Fill Rate
                </p>
                <p className="text-lg font-bold text-text-primary mb-2">87%</p>
                <ProgressBar value={87} max={100} color="success" size="sm" />
              </div>

              {/* Average time to fill */}
              <div>
                <p className="text-xs text-text-muted mb-1">
                  Avg Time to Fill
                </p>
                <p className="text-lg font-bold text-text-primary">22 min</p>
              </div>

              {/* Price trend */}
              <div>
                <p className="text-xs text-text-muted mb-1">Price Trend</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-text-primary">+3.2%</p>
                  <Badge variant="success">vs last month</Badge>
                </div>
              </div>

              {/* Most competitive LOS */}
              <div>
                <p className="text-xs text-text-muted mb-1">
                  Most Competitive LOS
                </p>
                <p className="text-lg font-bold text-text-primary">
                  Ambulatory
                </p>
              </div>

              {/* Highest demand LOS */}
              <div>
                <p className="text-xs text-text-muted mb-1">
                  Highest Demand LOS
                </p>
                <p className="text-lg font-bold text-text-primary">
                  Wheelchair
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
