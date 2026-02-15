"use client";

import { SortCriteria } from "@/lib/types";

interface SortBarProps {
  current: SortCriteria;
  onChange: (criteria: SortCriteria) => void;
  totalOptions: number;
  compatibleCount: number;
}

const sortOptions: { value: SortCriteria; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "cheapest", label: "Cheapest" },
  { value: "soonest", label: "Soonest" },
  { value: "least_disruption", label: "Least Disruption" },
];

export function SortBar({
  current,
  onChange,
  totalOptions,
  compatibleCount,
}: SortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="text-sm text-text-secondary">
        <span className="font-medium text-text-primary">
          {totalOptions} options
        </span>{" "}
        found
        {compatibleCount < totalOptions && (
          <span>
            {" "}
            &bull;{" "}
            <span className="font-medium text-success">
              {compatibleCount} compatible
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Sort by:</span>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                current === opt.value
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-text-secondary border-border hover:bg-surface-muted"
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
