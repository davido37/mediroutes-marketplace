"use client";

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";

/* ---------- Static data ---------- */

const losData = [
  { name: "Ambulatory", percent: 62, count: 2385, color: "bg-success" },
  { name: "Wheelchair", percent: 24, count: 923, color: "bg-brand" },
  { name: "Stretcher", percent: 8, count: 308, color: "bg-danger" },
  { name: "Bariatric", percent: 4, count: 154, color: "bg-warning" },
  { name: "BLS", percent: 2, count: 77, color: "bg-info" },
];

const monthlyVolume = [
  { month: "Sep", value: 2980 },
  { month: "Oct", value: 3150 },
  { month: "Nov", value: 3420 },
  { month: "Dec", value: 3050 },
  { month: "Jan", value: 3680 },
  { month: "Feb", value: 3847 },
];

const MONTHLY_MAX = Math.max(...monthlyVolume.map((m) => m.value));

const costBreakdown = [
  { source: "Fleet", amount: 68200, percent: 55, color: "brand" as const },
  { source: "Marketplace", amount: 31100, percent: 25, color: "success" as const },
  { source: "TNC", amount: 24800, percent: 20, color: "warning" as const },
];

const topFacilities = [
  { name: "Valley Medical Center", trips: 842, avgCost: "$28.50" },
  { name: "Banner University", trips: 624, avgCost: "$34.20" },
  { name: "St. Joseph's Hospital", trips: 518, avgCost: "$38.80" },
  { name: "Mayo Clinic Phoenix", trips: 412, avgCost: "$42.10" },
  { name: "Desert Springs Dialysis", trips: 389, avgCost: "$24.60" },
];

/* ---------- Component ---------- */

export default function Analytics() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Analytics & Reporting"
        description="Cost trends, utilization metrics, and transportation benefit performance dashboards."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Export PDF
            </Button>
            <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-light">
              <option>Last 90 Days</option>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Trips"
          value="3,847"
          change="+12% vs last quarter"
          changeType="positive"
          icon="🚐"
        />
        <StatCard
          label="Avg Cost / Trip"
          value="$32.40"
          change="-$2.10 vs last quarter"
          changeType="positive"
          icon="💰"
        />
        <StatCard
          label="Member Utilization"
          value="67%"
          change="Of eligible members"
          changeType="neutral"
          icon="👥"
        />
        <StatCard
          label="Authorization Rate"
          value="94.2%"
          change="+1.8% vs last quarter"
          changeType="positive"
          icon="✓"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Utilization by LOS — CSS bar chart */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Utilization by Level of Service
            </h2>
            <div className="space-y-3">
              {losData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-text-secondary">
                    {item.name}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-sm font-medium text-text-primary">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="w-10 shrink-0 text-right text-xs text-text-muted">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-text-muted">
                Based on 3,847 trips this quarter
              </p>
            </div>
          </Card>

          {/* Monthly Trip Volume — CSS vertical bar chart */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Monthly Trip Volume
            </h2>
            <div className="flex items-end justify-between gap-3 px-2" style={{ height: 160 }}>
              {monthlyVolume.map((m) => {
                const barHeight = Math.round((m.value / MONTHLY_MAX) * 120);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-text-primary">
                      {m.value.toLocaleString()}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-accent transition-all duration-500"
                      style={{ height: barHeight }}
                    />
                    <span className="text-xs text-text-muted mt-1">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-text-muted">
                Sep 2025 &ndash; Feb 2026
              </p>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Cost Breakdown
            </h2>
            <div className="space-y-4">
              {costBreakdown.map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {item.source}
                    </span>
                    <span className="text-sm text-text-secondary">
                      ${item.amount.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={item.percent}
                    max={100}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                Total
              </span>
              <span className="text-sm font-semibold text-text-primary">
                $124,100
              </span>
            </div>
          </Card>

          {/* Top Facilities */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Top Facilities
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-text-muted">
                      Facility
                    </th>
                    <th className="pb-2 text-right font-medium text-text-muted">
                      Trips
                    </th>
                    <th className="pb-2 text-right font-medium text-text-muted">
                      Avg Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topFacilities.map((f, i) => (
                    <tr
                      key={f.name}
                      className={`${
                        i < topFacilities.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <td className="py-2.5 text-text-primary">{f.name}</td>
                      <td className="py-2.5 text-right font-medium text-text-primary">
                        {f.trips.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right text-text-secondary">
                        {f.avgCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Full-width Trend Analysis */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Trend Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Cost per mile trend */}
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-text-muted mb-2">Cost per Mile</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-text-primary">
                $1.85
              </span>
              <span className="text-text-muted">&rarr;</span>
              <span className="text-xl font-bold text-text-primary">
                $1.72
              </span>
              {/* Green down arrow */}
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                />
              </svg>
            </div>
            <Badge variant="success">7% decrease</Badge>
          </div>

          {/* Avg trip distance */}
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-text-muted mb-2">Avg Trip Distance</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-text-primary">
                8.2 mi
              </span>
              <span className="text-text-muted">&rarr;</span>
              <span className="text-xl font-bold text-text-primary">
                9.1 mi
              </span>
              {/* Neutral up arrow */}
              <svg
                className="h-5 w-5 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            </div>
            <p className="text-xs text-text-muted">Members traveling farther</p>
          </div>

          {/* Will-call utilization */}
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-text-muted mb-2">Will-Call Utilization</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-text-primary">
                12%
              </span>
              <span className="text-text-muted">&rarr;</span>
              <span className="text-xl font-bold text-text-primary">
                18%
              </span>
              {/* Blue up arrow */}
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            </div>
            <Badge variant="info">Growing adoption</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
