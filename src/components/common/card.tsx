"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-white ${paddingStyles[padding]} ${
        hover ? "hover:border-accent-light hover:shadow-sm transition-all cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
