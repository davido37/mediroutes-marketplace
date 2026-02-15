"use client";

interface PriceTagProps {
  price: number;
  marketIndicator?: "below_market" | "at_market" | "above_market";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const indicatorConfig = {
  below_market: { label: "Below Market", color: "text-success bg-success-light" },
  at_market: { label: "At Market", color: "text-info bg-info-light" },
  above_market: { label: "Above Market", color: "text-warning bg-warning-light" },
};

export function PriceTag({
  price,
  marketIndicator,
  size = "md",
  className = "",
}: PriceTagProps) {
  const priceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`font-bold text-text-primary ${
          size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg"
        }`}
      >
        {priceFormatted}
      </span>
      {marketIndicator && (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${indicatorConfig[marketIndicator].color}`}
        >
          {indicatorConfig[marketIndicator].label}
        </span>
      )}
    </div>
  );
}
