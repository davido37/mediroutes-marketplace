"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  expiresAt: string;
  onExpired?: () => void;
  className?: string;
}

export function Countdown({ expiresAt, onExpired, className = "" }: CountdownProps) {
  const [remaining, setRemaining] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const target = new Date(expiresAt).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setRemaining("Expired");
        setIsExpired(true);
        setIsUrgent(false);
        onExpired?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < 1000 * 60 * 30); // < 30 min

      if (hours > 0) {
        setRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setRemaining(`${minutes}m ${seconds}s`);
      } else {
        setRemaining(`${seconds}s`);
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isExpired
          ? "text-text-muted"
          : isUrgent
            ? "text-danger"
            : "text-text-secondary"
      } ${className}`}
    >
      {!isExpired && <span className={isUrgent ? "animate-pulse" : ""}>⏱</span>}
      {remaining}
    </span>
  );
}
