"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { StatCard } from "@/components/common/stat-card";

// ---------------------------------------------------------------------------
// Inline mock EHR discharge events
// ---------------------------------------------------------------------------

type EHRStatus = "received" | "processing" | "trip_created";

interface EHREvent {
  id: string;
  eventType: "ADT-A03" | "ADT-A04" | "ADT-A08";
  patientName: string;
  department: string;
  description: string;
  status: EHRStatus;
  time: string;
}

const MOCK_EHR_EVENTS: EHREvent[] = [
  {
    id: "ehr-001",
    eventType: "ADT-A03",
    patientName: "Maria Gonzalez",
    department: "Cardiac Floor",
    description: "Discharge to home - wheelchair transport needed",
    status: "trip_created",
    time: "10:15 AM",
  },
  {
    id: "ehr-002",
    eventType: "ADT-A03",
    patientName: "James Washington",
    department: "Oncology",
    description: "Discharge post-chemo - ambulatory",
    status: "processing",
    time: "11:30 AM",
  },
  {
    id: "ehr-003",
    eventType: "ADT-A04",
    patientName: "Dorothy Chen",
    department: "ICU Step-down",
    description: "Transfer to SNF - stretcher required",
    status: "received",
    time: "1:45 PM",
  },
  {
    id: "ehr-004",
    eventType: "ADT-A03",
    patientName: "Robert Kim",
    department: "Orthopedics",
    description: "Discharge post-surgery - ambulatory",
    status: "trip_created",
    time: "9:00 AM",
  },
  {
    id: "ehr-005",
    eventType: "ADT-A08",
    patientName: "Helen Park",
    department: "General Med",
    description: "Updated discharge plan - needs wheelchair",
    status: "received",
    time: "2:30 PM",
  },
];

// ---------------------------------------------------------------------------
// Helper maps
// ---------------------------------------------------------------------------

const statusBadgeVariant: Record<EHRStatus, "success" | "info" | "warning"> = {
  trip_created: "success",
  processing: "info",
  received: "warning",
};

const statusLabel: Record<EHRStatus, string> = {
  trip_created: "Trip Created",
  processing: "Processing",
  received: "Received",
};

const eventTypeBadgeVariant: Record<string, "brand" | "purple" | "muted"> = {
  "ADT-A03": "brand",
  "ADT-A04": "purple",
  "ADT-A08": "muted",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EHRIntegration() {
  const [events] = useState<EHREvent[]>(MOCK_EHR_EVENTS);

  return (
    <div>
      <PageHeader
        title="EHR Integration"
        description="View pending discharges and auto-book transports"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <StatCard
          label="Pending Discharges"
          value={5}
          icon="🏥"
          change="+2 from yesterday"
          changeType="neutral"
        />
        <StatCard
          label="Auto-Booked Today"
          value={8}
          icon="✅"
          change="+3 vs avg"
          changeType="positive"
        />
        <StatCard
          label="Manual Review"
          value={2}
          icon="👁"
          change="1 urgent"
          changeType="negative"
        />
        <StatCard
          label="Avg Response Time"
          value="12 min"
          icon="⏱"
          change="-2 min vs last week"
          changeType="positive"
        />
      </div>

      {/* Discharge events table */}
      <Card padding="none" className="mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            Discharge Events
          </h2>
        </div>

        {/* Desktop table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th className="px-4 py-2.5 text-left font-medium text-text-muted">
                  Event
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted">
                  Patient
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden md:table-cell">
                  Department
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden lg:table-cell">
                  Description
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-text-muted hidden sm:table-cell">
                  Time
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-surface-muted/30 transition-colors"
                >
                  {/* Event type */}
                  <td className="px-4 py-3">
                    <Badge variant={eventTypeBadgeVariant[evt.eventType] ?? "muted"}>
                      {evt.eventType}
                    </Badge>
                  </td>

                  {/* Patient */}
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {evt.patientName}
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    {evt.department}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 text-text-muted hidden lg:table-cell max-w-xs truncate">
                    {evt.description}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant[evt.status]}>
                      {statusLabel[evt.status]}
                    </Badge>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell whitespace-nowrap">
                    {evt.time}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    {evt.status === "received" && (
                      <Button size="sm" variant="primary">
                        Create Trip
                      </Button>
                    )}
                    {evt.status === "processing" && (
                      <Button size="sm" variant="secondary">
                        Review
                      </Button>
                    )}
                    {evt.status === "trip_created" && (
                      <Button size="sm" variant="secondary">
                        View Trip
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* How EHR Integration Works */}
      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          How EHR Integration Works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-info-light text-xl">
              1
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              ADT Message Received
            </h3>
            <p className="text-xs text-text-muted">
              Your EHR sends an ADT discharge or transfer message (A03, A04, A08)
              to MediRoutes in real time via HL7 FHIR.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warning-light text-xl">
              2
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Auto-Assessment
            </h3>
            <p className="text-xs text-text-muted">
              MediRoutes maps the patient, mobility needs, and destination from the
              discharge record and checks eligibility and authorization rules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-xl">
              3
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Trip Created or Manual Review
            </h3>
            <p className="text-xs text-text-muted">
              If all criteria pass, a trip is auto-created and fulfillment options
              are sourced. Otherwise, the event is flagged for manual review.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
