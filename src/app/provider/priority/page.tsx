"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";

interface PriorityRule {
  id: string;
  name: string;
  condition: string;
  priority: number;
  action: string;
  active: boolean;
}

const initialRules: PriorityRule[] = [
  {
    id: "rule-1",
    name: "Fleet First for Wheelchair",
    condition: "Level of service = Wheelchair AND distance < 15 mi",
    priority: 1,
    action: "Use own fleet first",
    active: true,
  },
  {
    id: "rule-2",
    name: "Marketplace for Stretcher",
    condition: "Level of service = Stretcher AND all fleet stretcher vans occupied",
    priority: 2,
    action: "Post to marketplace immediately",
    active: true,
  },
  {
    id: "rule-3",
    name: "TNC for Short Ambulatory",
    condition: "Level of service = Ambulatory AND distance < 8 mi AND no special needs",
    priority: 3,
    action: "Request TNC quote",
    active: true,
  },
  {
    id: "rule-4",
    name: "Auto-Accept High-Value Marketplace",
    condition: "Marketplace trip AND offered price > $75 AND distance < 12 mi AND LOS matches fleet capability",
    priority: 4,
    action: "Auto-accept marketplace trip",
    active: false,
  },
  {
    id: "rule-5",
    name: "Preferred Facility Priority",
    condition: "Facility = Valley Medical Center OR Banner University",
    priority: 5,
    action: "Prioritize over other requests",
    active: true,
  },
  {
    id: "rule-6",
    name: "Reject Low-Margin Trips",
    condition: "Calculated margin < 10% AND distance > 20 mi",
    priority: 6,
    action: "Flag for manual review",
    active: true,
  },
];

export default function PriorityConfig() {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: string) => {
    setRules(
      rules.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  };

  const activeCount = rules.filter((r) => r.active).length;

  return (
    <div>
      <PageHeader
        title="Priority Configuration"
        description="Set trip acceptance priorities, preferred facilities, and auto-accept rules."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Import Rules
            </Button>
            <Button size="sm">+ Add Rule</Button>
          </div>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <Badge variant="brand">{activeCount} Active</Badge>
        <Badge variant="muted">{rules.length - activeCount} Inactive</Badge>
        <span className="text-xs text-text-muted ml-2">
          Rules are evaluated top-to-bottom by priority order
        </span>
      </div>

      <div className="space-y-3">
        {rules
          .sort((a, b) => a.priority - b.priority)
          .map((rule) => (
            <Card
              key={rule.id}
              className={`transition-opacity ${!rule.active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand text-sm font-bold">
                  {rule.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {rule.name}
                    </h3>
                    <Badge variant={rule.active ? "success" : "muted"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mb-2 font-mono bg-surface-muted rounded px-2 py-1 inline-block">
                    IF: {rule.condition}
                  </p>
                  <p className="text-sm text-text-secondary">
                    <span className="text-text-muted">Then:</span>{" "}
                    <span className="font-medium">{rule.action}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.active ? "bg-brand" : "bg-gray-300"
                    }`}
                    onClick={() => toggleRule(rule.id)}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        rule.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Explanation Card */}
      <Card className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary mb-2">How Priority Rules Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div>
            <p className="font-medium text-text-primary mb-1">1. Trip Received</p>
            <p>When a new trip request arrives, the system evaluates it against all active rules in priority order.</p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">2. Condition Match</p>
            <p>The first rule whose condition matches the trip determines the fulfillment strategy.</p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">3. Action Executed</p>
            <p>The matched rule&apos;s action is applied: fleet assignment, marketplace posting, or TNC request.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
