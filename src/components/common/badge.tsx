"use client";

type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-text-secondary",
  brand: "bg-brand-lightest text-brand-dark",
  success: "bg-success-light text-green-800",
  warning: "bg-warning-light text-amber-800",
  danger: "bg-danger-light text-red-800",
  info: "bg-info-light text-blue-800",
  muted: "bg-surface-muted text-text-muted",
  purple: "bg-purple-light text-purple",
};

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
