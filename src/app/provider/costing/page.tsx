"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { FormField, inputClassName } from "@/components/common/form-field";

const defaultConfig = {
  mileageRate: 1.85,
  hourlyRate: 28.0,
  fuelCostPerGallon: 3.45,
  avgMPG: 14.2,
  overheadPercent: 22,
  minimumFare: 18.0,
};

const losMultipliers = [
  { los: "Ambulatory", multiplier: 1.0, minFare: 18.0 },
  { los: "Wheelchair", multiplier: 1.35, minFare: 28.0 },
  { los: "Stretcher", multiplier: 2.1, minFare: 85.0 },
  { los: "Bariatric", multiplier: 2.5, minFare: 95.0 },
  { los: "BLS", multiplier: 3.0, minFare: 150.0 },
];

const recentCalculations = [
  { trip: "trip-2002", miles: 8.2, los: "Ambulatory", cost: 33.17, margin: 27 },
  { trip: "trip-2004", miles: 4.2, los: "Stretcher", cost: 96.39, margin: 14 },
  { trip: "trip-2001", miles: 6.1, los: "Wheelchair", cost: 43.28, margin: 22 },
];

export default function CostingEngine() {
  const [config, setConfig] = useState(defaultConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const estimateCost = (miles: number, losMultiplier: number) => {
    const fuelCost = (miles / config.avgMPG) * config.fuelCostPerGallon;
    const mileageCost = miles * config.mileageRate;
    const timeCost = (miles / 25) * 60 * (config.hourlyRate / 60); // assume 25mph avg
    const baseCost = (fuelCost + mileageCost + timeCost) * losMultiplier;
    return baseCost * (1 + config.overheadPercent / 100);
  };

  return (
    <div>
      <PageHeader
        title="Costing Engine"
        description="Configure pricing rules, base rates, and distance-based cost calculations."
        actions={
          <Button size="sm" onClick={handleSave}>
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Base Rate Configuration */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Base Rate Configuration</h2>
          <div className="space-y-4">
            <FormField label="Mileage Rate ($/mile)">
              <input
                type="number"
                step="0.01"
                className={inputClassName}
                value={config.mileageRate}
                onChange={(e) => setConfig({ ...config, mileageRate: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Hourly Rate ($/hr)">
              <input
                type="number"
                step="0.50"
                className={inputClassName}
                value={config.hourlyRate}
                onChange={(e) => setConfig({ ...config, hourlyRate: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Fuel Cost ($/gallon)">
              <input
                type="number"
                step="0.01"
                className={inputClassName}
                value={config.fuelCostPerGallon}
                onChange={(e) => setConfig({ ...config, fuelCostPerGallon: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Average MPG">
              <input
                type="number"
                step="0.1"
                className={inputClassName}
                value={config.avgMPG}
                onChange={(e) => setConfig({ ...config, avgMPG: parseFloat(e.target.value) || 1 })}
              />
            </FormField>
            <FormField label="Overhead %">
              <input
                type="number"
                step="1"
                className={inputClassName}
                value={config.overheadPercent}
                onChange={(e) => setConfig({ ...config, overheadPercent: parseInt(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Minimum Fare ($)">
              <input
                type="number"
                step="1"
                className={inputClassName}
                value={config.minimumFare}
                onChange={(e) => setConfig({ ...config, minimumFare: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
          </div>
        </Card>

        {/* Level of Service Multipliers */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Level of Service Multipliers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-muted">
                  <th className="pb-2 pr-4 font-medium">Level of Service</th>
                  <th className="pb-2 pr-4 font-medium">Multiplier</th>
                  <th className="pb-2 pr-4 font-medium">Min Fare</th>
                  <th className="pb-2 font-medium text-right">10 mi Est.</th>
                </tr>
              </thead>
              <tbody>
                {losMultipliers.map((los) => (
                  <tr key={los.los} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-text-primary">{los.los}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="brand">{los.multiplier}x</Badge>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">${los.minFare.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-text-primary">
                      ${Math.max(los.minFare, estimateCost(10, los.multiplier)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-surface-muted rounded-lg">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Cost Formula</h3>
            <p className="text-xs text-text-secondary font-mono">
              Cost = (FuelCost + MileageCost + TimeCost) &times; LOS_Multiplier &times; (1 + Overhead%)
            </p>
            <p className="text-xs text-text-muted mt-1">
              FuelCost = (miles / MPG) &times; fuelPrice &nbsp;|&nbsp;
              MileageCost = miles &times; mileageRate &nbsp;|&nbsp;
              TimeCost = (estHours) &times; hourlyRate
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Cost Calculations */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Cost Calculations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="pb-2 pr-4 font-medium">Trip</th>
                <th className="pb-2 pr-4 font-medium">Miles</th>
                <th className="pb-2 pr-4 font-medium">Level of Service</th>
                <th className="pb-2 pr-4 font-medium">Calculated Cost</th>
                <th className="pb-2 font-medium text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {recentCalculations.map((calc) => (
                <tr key={calc.trip} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 font-medium text-accent">{calc.trip}</td>
                  <td className="py-3 pr-4 text-text-secondary">{calc.miles} mi</td>
                  <td className="py-3 pr-4">
                    <Badge variant="default">{calc.los}</Badge>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-text-primary">${calc.cost.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <Badge variant={calc.margin >= 20 ? "success" : "warning"}>
                      {calc.margin}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
