"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";

type RequestStatus = "idle" | "searching" | "found";

const LOS_OPTIONS = [
  "Ambulatory",
  "Wheelchair",
  "Stretcher",
  "Bariatric",
];

const SPECIAL_NEEDS = [
  "Oxygen",
  "Escort / Attendant",
  "Car Seat",
  "Gurney",
  "IV Drip",
];

export default function WillCall() {
  const [pickup, setPickup] = useState("Kaiser Permanente Central");
  const [destination, setDestination] = useState("");
  const [los, setLos] = useState("Ambulatory");
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");

  function toggleSpecialNeed(need: string) {
    setSpecialNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }

  const handleRequest = useCallback(() => {
    setRequestStatus("searching");
  }, []);

  function handleCancel() {
    setRequestStatus("idle");
  }

  // Simulate driver found after 2 seconds of searching
  useEffect(() => {
    if (requestStatus !== "searching") return;

    const timer = setTimeout(() => {
      setRequestStatus("found");
    }, 2000);

    return () => clearTimeout(timer);
  }, [requestStatus]);

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Will-Call Ride" />

      {/* Explanation */}
      <Card className="mb-4">
        <p className="text-sm text-text-secondary">
          Request a ride when you&apos;re ready. No exact time needed &mdash;
          we&apos;ll dispatch a driver when you call.
        </p>
      </Card>

      {requestStatus === "idle" && (
        <Card>
          <div className="flex flex-col gap-4">
            <FormField label="Current Location / Pickup" required>
              <input
                type="text"
                className={inputClassName}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup address"
              />
            </FormField>

            <FormField label="Destination" required>
              <input
                type="text"
                className={inputClassName}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
              />
            </FormField>

            <FormField label="Level of Service">
              <select
                className={inputClassName}
                value={los}
                onChange={(e) => setLos(e.target.value)}
              >
                {LOS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Special Needs">
              <div className="flex flex-wrap gap-2">
                {SPECIAL_NEEDS.map((need) => (
                  <label
                    key={need}
                    className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={specialNeeds.includes(need)}
                      onChange={() => toggleSpecialNeed(need)}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    {need}
                  </label>
                ))}
              </div>
            </FormField>

            <Button
              size="lg"
              className="w-full mt-2"
              onClick={handleRequest}
              disabled={!pickup || !destination}
            >
              I&apos;m Ready &mdash; Request Pickup Now
            </Button>
          </div>
        </Card>
      )}

      {/* Searching state */}
      {requestStatus === "searching" && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent" />
            </span>
            <p className="text-sm font-medium text-text-primary">
              Finding your ride...
            </p>
            <p className="text-xs text-text-muted">
              {pickup} &rarr; {destination}
            </p>
          </div>
        </Card>
      )}

      {/* Driver found state */}
      {requestStatus === "found" && (
        <Card>
          <div className="flex flex-col gap-4">
            {/* Success header */}
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-success" />
              <p className="text-sm font-semibold text-success">
                Driver found!
              </p>
            </div>

            {/* Route recap */}
            <p className="text-xs text-text-muted">
              {pickup} &rarr; {destination}
            </p>

            {/* Driver info */}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Driver</span>
                <span className="text-sm font-medium text-text-primary">
                  Carlos Mendez
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Vehicle</span>
                <span className="text-sm font-medium text-text-primary">
                  Ford Transit (V-101)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">ETA</span>
                <Badge variant="brand">12 minutes</Badge>
              </div>
            </div>

            {/* LOS + special needs recap */}
            <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
              <Badge variant="info">{los}</Badge>
              {specialNeeds.map((need) => (
                <Badge key={need} variant="muted">
                  {need}
                </Badge>
              ))}
            </div>

            {/* Cancel */}
            <Button
              variant="ghost"
              className="w-full text-danger"
              onClick={handleCancel}
            >
              Cancel Request
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
