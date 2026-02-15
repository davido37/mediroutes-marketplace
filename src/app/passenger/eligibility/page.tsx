"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { ProgressBar } from "@/components/common/progress-bar";
import { Banner } from "@/components/common/banner";

export default function Eligibility() {
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  const handleCheckEligibility = () => {
    setEligibilityChecked(true);
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="My Benefits"
        description="View your NEMT benefit details and remaining trip allowances."
      />

      <div className="space-y-4">
        {/* Insurance Info */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">
              Insurance Information
            </h2>
            <Badge variant="success">Eligible</Badge>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Plan</dt>
              <dd className="font-medium text-text-primary text-right">
                Arizona Complete Health
                <span className="block text-xs text-text-muted font-normal">
                  AHCCCS Standard
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Member ID</dt>
              <dd className="font-medium text-text-primary">MBR-44892</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Group</dt>
              <dd className="font-medium text-text-primary">GRP-AZ-2026</dd>
            </div>
          </dl>
        </Card>

        {/* Benefits Summary */}
        <Card>
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Benefits Summary
          </h2>
          <div className="space-y-3">
            {/* Trip Allowance */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Trips Used</span>
                <span className="font-medium text-text-primary">
                  34 of 52
                </span>
              </div>
              <ProgressBar value={34} max={52} color="brand" size="sm" />
              <p className="text-xs text-text-muted mt-1">
                18 trips remaining this year
              </p>
            </div>

            {/* Max Distance */}
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Max distance per trip</span>
              <span className="font-medium text-text-primary">60 miles</span>
            </div>

            {/* Covered Levels */}
            <div>
              <span className="text-sm text-text-muted block mb-1.5">
                Covered levels of service
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="brand">Ambulatory</Badge>
                <Badge variant="brand">Wheelchair</Badge>
                <Badge variant="brand">Stretcher</Badge>
              </div>
            </div>

            {/* Copay */}
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Copay</span>
              <span className="font-semibold text-success">$0</span>
            </div>

            {/* Escort */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Escort coverage</span>
              <Badge variant="success">1 escort covered</Badge>
            </div>

            {/* Will-call */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Will-call</span>
              <Badge variant="success">Allowed</Badge>
            </div>

            {/* Round trip */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Round trip</span>
              <Badge variant="success">Allowed</Badge>
            </div>
          </div>
        </Card>

        {/* Cost Transparency */}
        <Card>
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Your Estimated Costs
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Your copay</span>
              <span className="font-semibold text-success">
                $0{" "}
                <span className="font-normal text-text-muted">
                  (covered by plan)
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Escort</span>
              <span className="font-medium text-text-primary">Covered</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">
                Standard trip (under 60 mi)
              </span>
              <span className="font-medium text-text-primary">
                Fully covered
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">
                Trips beyond benefit limit
              </span>
              <span className="font-medium text-text-secondary">
                Self-pay at market rate
              </span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border">
            Contact your health plan for coverage questions.
          </p>
        </Card>

        {/* Eligibility Check */}
        <Button
          onClick={handleCheckEligibility}
          className="w-full"
          size="lg"
        >
          Check Eligibility
        </Button>

        {eligibilityChecked && (
          <Banner variant="success" dismissible={false}>
            Eligibility verified as of {formattedDate} at {formattedTime}
          </Banner>
        )}
      </div>
    </div>
  );
}
