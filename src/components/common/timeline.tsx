"use client";

interface TimelineItem {
  id: string;
  label: string;
  timestamp?: string;
  description?: string;
  status: "completed" | "active" | "pending";
  icon?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-3 pb-6 last:pb-0">
          {/* Connector line */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                item.status === "completed"
                  ? "bg-success text-white"
                  : item.status === "active"
                    ? "bg-accent text-white ring-2 ring-accent-lightest"
                    : "bg-surface-muted text-text-muted border border-border"
              }`}
            >
              {item.status === "completed"
                ? "✓"
                : item.icon || String(i + 1)}
            </div>
            {i < items.length - 1 && (
              <div
                className={`w-px flex-1 mt-1 ${
                  item.status === "completed" ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>

          {/* Content */}
          <div className="pt-0.5 pb-2">
            <p
              className={`text-sm font-medium ${
                item.status === "pending"
                  ? "text-text-muted"
                  : "text-text-primary"
              }`}
            >
              {item.label}
            </p>
            {item.timestamp && (
              <p className="text-xs text-text-muted mt-0.5">
                {item.timestamp}
              </p>
            )}
            {item.description && (
              <p className="text-xs text-text-secondary mt-0.5">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
