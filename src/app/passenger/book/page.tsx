"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { Badge } from "@/components/common/badge";
import { Banner } from "@/components/common/banner";

interface RideOption {
  id: string;
  name: string;
  eta: string;
  etaMinutes: number;
  copay: number;
  coveredLabel?: string;
  arriveBy: string;
}

export default function BookRide() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [levelOfService, setLevelOfService] = useState("ambulatory");
  const [reason, setReason] = useState("doctor");
  const [escort, setEscort] = useState(false);
  const [oxygen, setOxygen] = useState(false);
  const [notes, setNotes] = useState("");

  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  function getArriveByTime(minutesFromNow: number): string {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m - 15 + minutesFromNow, 0); // arrive 15 min before appt
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const mockOptions: RideOption[] = [
    {
      id: "fleet",
      name: "Fleet Vehicle",
      eta: "15 min",
      etaMinutes: 15,
      copay: 0,
      coveredLabel: "Covered by plan",
      arriveBy: getArriveByTime(15),
    },
    {
      id: "rideshare",
      name: "Rideshare",
      eta: "8 min",
      etaMinutes: 8,
      copay: 5,
      arriveBy: getArriveByTime(8),
    },
    {
      id: "wheelchair-van",
      name: "Wheelchair Van",
      eta: "22 min",
      etaMinutes: 22,
      copay: 0,
      coveredLabel: "Covered by plan",
      arriveBy: getArriveByTime(22),
    },
  ];

  // Filter options based on level of service
  const filteredOptions =
    levelOfService === "wheelchair"
      ? [mockOptions[0], mockOptions[2]]
      : levelOfService === "stretcher"
        ? [mockOptions[0]]
        : [mockOptions[0], mockOptions[1]];

  function handleCheckAvailability(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
    setSelectedOption(null);
    setBooked(false);
  }

  function handleSelectOption(optionId: string) {
    setSelectedOption(optionId);
    setBooked(true);
  }

  function getSelectedArrival(): string {
    const opt = filteredOptions.find((o) => o.id === selectedOption);
    return opt?.arriveBy ?? "";
  }

  const formComplete = pickup && dropoff && date && time;

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="Book a Ride"
        description="Schedule a new transportation trip to your medical appointment."
      />

      {booked && (
        <div className="mb-4">
          <Banner variant="success" dismissible={false}>
            Ride booked! Your driver will arrive at {getSelectedArrival()}.
          </Banner>
        </div>
      )}

      <Card padding="lg">
        <form onSubmit={handleCheckAvailability} className="flex flex-col gap-4">
          <FormField label="Pickup Location" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="Home address or search..."
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </FormField>

          <FormField label="Dropoff Location" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="Doctor's office, hospital..."
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" required>
              <input
                type="date"
                className={inputClassName}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>

            <FormField label="Time" required>
              <input
                type="time"
                className={inputClassName}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Level of Service" required>
            <select
              className={inputClassName}
              value={levelOfService}
              onChange={(e) => setLevelOfService(e.target.value)}
            >
              <option value="ambulatory">Ambulatory (standard car)</option>
              <option value="wheelchair">Wheelchair accessible</option>
              <option value="stretcher">Stretcher</option>
            </select>
          </FormField>

          <FormField label="Reason for Visit" required>
            <select
              className={inputClassName}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="doctor">Doctor appointment</option>
              <option value="dialysis">Dialysis</option>
              <option value="therapy">Therapy</option>
              <option value="discharge">Hospital discharge</option>
              <option value="other">Other</option>
            </select>
          </FormField>

          <FormField label="Special Needs">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={escort}
                  onChange={(e) => setEscort(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-brand-light"
                />
                Escort needed
              </label>
              <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={oxygen}
                  onChange={(e) => setOxygen(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-brand-light"
                />
                Oxygen required
              </label>
            </div>
          </FormField>

          <FormField label="Notes">
            <textarea
              className={`${inputClassName} min-h-[80px] resize-none`}
              placeholder="Any special instructions for your driver..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </FormField>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={!formComplete}
          >
            Check Availability
          </Button>
        </form>
      </Card>

      {showResults && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Available Options
          </h2>
          <div className="flex flex-col gap-3">
            {filteredOptions.map((option) => (
              <Card
                key={option.id}
                padding="md"
                className={
                  selectedOption === option.id
                    ? "ring-2 ring-accent border-accent"
                    : ""
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary text-sm">
                        {option.name}
                      </span>
                      {option.copay === 0 && option.coveredLabel && (
                        <Badge variant="success">{option.coveredLabel}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                      <span>ETA {option.eta}</span>
                      <span>
                        {option.copay === 0
                          ? "$0 copay"
                          : `$${option.copay} copay`}
                      </span>
                      {option.arriveBy && (
                        <span>Arrive by {option.arriveBy}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      selectedOption === option.id ? "secondary" : "primary"
                    }
                    onClick={() => handleSelectOption(option.id)}
                    disabled={booked && selectedOption !== option.id}
                  >
                    {selectedOption === option.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
