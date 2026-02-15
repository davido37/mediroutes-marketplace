"use client";

import { useState } from "react";

type BannerVariant = "info" | "success" | "warning" | "error";

interface BannerProps {
  variant?: BannerVariant;
  children: React.ReactNode;
  dismissible?: boolean;
}

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-info-light text-blue-800 border-blue-200",
  success: "bg-success-light text-green-800 border-green-200",
  warning: "bg-warning-light text-amber-800 border-amber-200",
  error: "bg-danger-light text-red-800 border-red-200",
};

const iconMap: Record<BannerVariant, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

export function Banner({
  variant = "info",
  children,
  dismissible = true,
}: BannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      <span className="text-lg font-bold shrink-0">{iconMap[variant]}</span>
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-current opacity-60 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
