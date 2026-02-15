"use client";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = true,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`${sizeStyles[size]} flex`}>
        {Array.from({ length: maxStars }, (_, i) => (
          <span
            key={i}
            className={`${
              i < Math.round(rating)
                ? "text-amber-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-amber-300" : ""}`}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            ★
          </span>
        ))}
      </span>
      {showValue && (
        <span className="text-sm font-medium text-text-secondary ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
