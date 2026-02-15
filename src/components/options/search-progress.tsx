"use client";

import { SearchProgress as SearchProgressType } from "@/lib/types";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface SearchProgressProps {
  progress: SearchProgressType;
  optionCounts: { fleet: number; tnc: number; marketplace: number };
}

const sources = [
  {
    key: "fleet" as const,
    label: "Client Fleet",
    loadingText: "Checking fleet availability and schedule impact...",
    doneText: (count: number) =>
      count > 0 ? `${count} fleet option(s) evaluated` : "No feasible fleet options",
  },
  {
    key: "tnc" as const,
    label: "TNC Providers",
    loadingText: "Requesting quotes from Uber and Lyft...",
    doneText: (count: number) => `${count} TNC quote(s) received`,
  },
  {
    key: "marketplace" as const,
    label: "Marketplace",
    loadingText: "Querying marketplace providers...",
    doneText: (count: number) => `${count} marketplace provider(s) responded`,
  },
];

export function SearchProgressView({
  progress,
  optionCounts,
}: SearchProgressProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">
        Finding fulfillment options...
      </h2>
      <p className="text-sm text-text-secondary">
        Searching across all available channels to find the best options for
        this trip.
      </p>

      <div className="space-y-3 mt-6">
        {sources.map((source) => {
          const status = progress[source.key];
          const count = optionCounts[source.key];

          return (
            <div
              key={source.key}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
                status === "done"
                  ? "border-green-200 bg-success-light"
                  : status === "loading"
                    ? "border-blue-200 bg-info-light"
                    : "border-border bg-white"
              }`}
            >
              <div className="shrink-0">
                {status === "loading" && <LoadingSpinner size="sm" />}
                {status === "done" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white text-xs">
                    &#10003;
                  </div>
                )}
                {status === "pending" && (
                  <div className="h-5 w-5 rounded-full border-2 border-border" />
                )}
                {status === "error" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-xs">
                    &#10005;
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    status === "done"
                      ? "text-green-800"
                      : status === "loading"
                        ? "text-blue-800"
                        : "text-text-muted"
                  }`}
                >
                  {source.label}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {status === "loading"
                    ? source.loadingText
                    : status === "done"
                      ? source.doneText(count)
                      : "Waiting..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
