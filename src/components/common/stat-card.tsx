"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  className = "",
}: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-700"
      : changeType === "negative"
        ? "text-red-700"
        : "text-text-muted";

  return (
    <div className={`rounded-lg border border-border bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-medium ${changeColor}`}>
          {change}
        </p>
      )}
    </div>
  );
}
