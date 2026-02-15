"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  color?: "brand" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const colorStyles = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  color = "brand",
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium">{percent.toFixed(0)}%</span>}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-surface-muted overflow-hidden ${
          size === "sm" ? "h-1.5" : "h-2.5"
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorStyles[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
