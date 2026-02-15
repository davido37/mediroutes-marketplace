"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { Modal } from "@/components/common/modal";

interface RecurringRide {
  id: string;
  destination: string;
  schedule: string;
  days: string[];
  time: string;
  pickup: string;
  dropoff: string;
  los: string;
  active: boolean;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LOS_OPTIONS = [
  "Ambulatory",
  "Wheelchair",
  "Stretcher",
  "Bariatric",
];

const INITIAL_RIDES: RecurringRide[] = [
  {
    id: "rec-1",
    destination: "Desert Springs Dialysis",
    schedule: "Mon / Wed / Fri",
    days: ["Mon", "Wed", "Fri"],
    time: "7:30 AM",
    pickup: "Home",
    dropoff: "Desert Springs Dialysis",
    los: "Ambulatory",
    active: true,
  },
  {
    id: "rec-2",
    destination: "Banner Rehab Center",
    schedule: "Tue / Thu",
    days: ["Tue", "Thu"],
    time: "2:00 PM",
    pickup: "Home",
    dropoff: "Banner Rehab Center",
    los: "Wheelchair",
    active: true,
  },
  {
    id: "rec-3",
    destination: "Mayo Clinic",
    schedule: "Every other Wed",
    days: ["Wed"],
    time: "10:00 AM",
    pickup: "Home",
    dropoff: "Mayo Clinic",
    los: "Ambulatory",
    active: false,
  },
];

const EMPTY_FORM = {
  pickup: "",
  dropoff: "",
  days: [] as string[],
  time: "",
  los: "Ambulatory",
};

export default function RecurringRides() {
  const [rides, setRides] = useState<RecurringRide[]>(INITIAL_RIDES);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  function toggleActive(id: string) {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  function deleteRide(id: string) {
    setRides((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  }

  function handleSave() {
    if (!form.pickup || !form.dropoff || form.days.length === 0 || !form.time) return;

    const newRide: RecurringRide = {
      id: `rec-${Date.now()}`,
      destination: form.dropoff,
      schedule: form.days.join(" / "),
      days: form.days,
      time: form.time,
      pickup: form.pickup,
      dropoff: form.dropoff,
      los: form.los,
      active: true,
    };
    setRides((prev) => [...prev, newRide]);
    setForm({ ...EMPTY_FORM });
    setModalOpen(false);
  }

  function openModal() {
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="Recurring Rides"
        actions={
          <Button size="sm" onClick={openModal}>
            + Add Recurring Ride
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {rides.length === 0 && (
          <Card>
            <p className="text-center text-sm text-text-muted py-4">
              No recurring rides set up yet.
            </p>
          </Card>
        )}

        {rides.map((ride) => (
          <Card key={ride.id}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-text-primary text-sm">
                {ride.destination}
              </h3>
              <Badge variant={ride.active ? "success" : "muted"}>
                {ride.active ? "Active" : "Paused"}
              </Badge>
            </div>

            {/* Schedule */}
            <p className="text-xs text-text-secondary mb-1">
              {ride.schedule} at {ride.time}
            </p>

            {/* Route */}
            <p className="text-xs text-text-muted mb-2">
              {ride.pickup} &rarr; {ride.dropoff}
            </p>

            {/* LOS badge */}
            <div className="mb-3">
              <Badge variant="brand">{ride.los}</Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <Button
                size="sm"
                variant={ride.active ? "secondary" : "primary"}
                onClick={() => toggleActive(ride.id)}
                className="text-xs"
              >
                {ride.active ? "Pause" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {}}
                className="text-xs"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteRide(ride.id)}
                className="text-xs text-danger"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Recurring Ride Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Recurring Ride"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !form.pickup ||
                !form.dropoff ||
                form.days.length === 0 ||
                !form.time
              }
            >
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Pickup" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="e.g. Home"
              value={form.pickup}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pickup: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Dropoff" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="e.g. Desert Springs Dialysis"
              value={form.dropoff}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dropoff: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Days of Week" required>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    form.days.includes(day)
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-text-secondary border-border hover:bg-surface-muted"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Pickup Time" required>
            <input
              type="time"
              className={inputClassName}
              value={form.time}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, time: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Level of Service">
            <select
              className={inputClassName}
              value={form.los}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, los: e.target.value }))
              }
            >
              {LOS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
