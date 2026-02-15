"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatCard } from "@/components/common/stat-card";
import { MOCK_COMPLIANCE_METRICS } from "@/lib/mock-data";

const PERIOD_OPTIONS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Year to Date"];

export default function Compliance() {
  const [period, setPeriod] = useState("Last 30 Days");

  const metrics = MOCK_COMPLIANCE_METRICS;
  const totalTrips = metrics.reduce((sum, m) => sum + m.tripsThisMonth, 0);

  // Weighted averages
  const avgOnTime =
    metrics.reduce((sum, m) => sum + m.onTimePercent * m.tripsThisMonth, 0) / totalTrips;
  const avgResponse =
    metrics.reduce((sum, m) => sum + m.avgResponseMinutes * m.tripsThisMonth, 0) / totalTrips;
  const avgCredential =
    metrics.reduce((sum, m) => sum + m.credentialCompliance * m.tripsThisMonth, 0) / totalTrips;

  return (
    <div>
      <PageHeader
        title="SLA Compliance"
        description="Monitor broker on-time performance, complaint rates, and SLA adherence."
        actions={
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-light"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Button variant="secondary" size="sm">
              Export Report
            </Button>
          </div>
        }
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Avg On-Time"
          value={`${avgOnTime.toFixed(1)}%`}
          icon="⏱"
          change="Weighted by trip volume"
          changeType="neutral"
        />
        <StatCard
          label="Total Trips"
          value={totalTrips.toLocaleString()}
          icon="🚐"
          change={`${metrics.length} brokers`}
          changeType="neutral"
        />
        <StatCard
          label="Avg Response Time"
          value={`${avgResponse.toFixed(1)} min`}
          icon="⚡"
          change="Weighted by trip volume"
          changeType="neutral"
        />
        <StatCard
          label="Credential Compliance"
          value={`${Math.round(avgCredential)}%`}
          icon="🛡"
          change="Weighted by trip volume"
          changeType="neutral"
        />
      </div>

      {/* Broker compliance cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {metrics.map((m) => {
          const meetsSla = m.onTimePercent >= m.slaTarget;
          return (
            <Card key={m.broker} padding="lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      meetsSla ? "bg-success" : "bg-danger"
                    }`}
                  />
                  <h3 className="text-lg font-bold text-text-primary">{m.brokerLabel}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Target: {m.slaTarget}%</Badge>
                  {meetsSla ? (
                    <Badge variant="success">Meets SLA</Badge>
                  ) : (
                    <Badge variant="danger">Below SLA</Badge>
                  )}
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* On-Time % */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">On-Time %</span>
                    <span
                      className={`text-sm font-semibold ${
                        meetsSla ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {m.onTimePercent}%
                    </span>
                  </div>
                  <ProgressBar
                    value={m.onTimePercent}
                    color={meetsSla ? "success" : "danger"}
                    size="sm"
                  />
                </div>

                {/* No-Show % */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">No-Show %</span>
                    <span
                      className={`text-sm font-semibold ${
                        m.noShowPercent > 3 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {m.noShowPercent}%
                    </span>
                  </div>
                  <ProgressBar
                    value={m.noShowPercent}
                    max={10}
                    color={m.noShowPercent > 3 ? "danger" : "success"}
                    size="sm"
                  />
                </div>

                {/* Complaint Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Complaint Rate</span>
                    <span
                      className={`text-sm font-semibold ${
                        m.complaintRate > 1.5 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {m.complaintRate}%
                    </span>
                  </div>
                  <ProgressBar
                    value={m.complaintRate}
                    max={5}
                    color={m.complaintRate > 1.5 ? "danger" : "success"}
                    size="sm"
                  />
                </div>

                {/* Avg Response */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Avg Response</span>
                    <span
                      className={`text-sm font-semibold ${
                        m.avgResponseMinutes > 7 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {m.avgResponseMinutes} min
                    </span>
                  </div>
                  <ProgressBar
                    value={m.avgResponseMinutes}
                    max={15}
                    color={m.avgResponseMinutes > 7 ? "danger" : "success"}
                    size="sm"
                  />
                </div>

                {/* Trips This Month */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Trips This Month</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {m.tripsThisMonth.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Credential Compliance */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Credential Compliance</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {m.credentialCompliance}%
                    </span>
                  </div>
                  <ProgressBar
                    value={m.credentialCompliance}
                    color={m.credentialCompliance >= 95 ? "success" : "warning"}
                    size="sm"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Compliance Summary Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Compliance Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-left font-medium text-text-muted">Broker</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">On-Time %</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">SLA Target</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">No-Show %</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">Complaint Rate</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">Response Time</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">Trips</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">Credentials</th>
                <th className="px-4 py-3 text-center font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => {
                const meetsSla = m.onTimePercent >= m.slaTarget;
                return (
                  <tr key={m.broker} className="border-b border-border last:border-b-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{m.brokerLabel}</td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        meetsSla ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {m.onTimePercent}%
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">{m.slaTarget}%</td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        m.noShowPercent > 3 ? "text-red-700" : "text-text-secondary"
                      }`}
                    >
                      {m.noShowPercent}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        m.complaintRate > 1.5 ? "text-red-700" : "text-text-secondary"
                      }`}
                    >
                      {m.complaintRate}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        m.avgResponseMinutes > 7 ? "text-red-700" : "text-text-secondary"
                      }`}
                    >
                      {m.avgResponseMinutes} min
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      {m.tripsThisMonth.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      {m.credentialCompliance}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {meetsSla ? (
                        <Badge variant="success">Pass</Badge>
                      ) : (
                        <Badge variant="danger">Fail</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
