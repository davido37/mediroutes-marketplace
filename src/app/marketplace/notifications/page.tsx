"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import {
  MOCK_MARKETPLACE_NOTIFICATIONS,
  type MarketplaceNotification,
} from "@/lib/mock-data";

// ============================================================================
// Helpers
// ============================================================================

type NotificationType = MarketplaceNotification["type"];

const TYPE_EMOJI: Record<NotificationType, string> = {
  new_trip: "\u{1F4CB}",
  offer_received: "\u{1F4E5}",
  offer_accepted: "\u2705",
  offer_countered: "\u21A9\uFE0F",
  offer_declined: "\u274C",
  trip_expiring: "\u23F1\uFE0F",
  settlement_paid: "\u{1F4B0}",
};

const TYPE_BADGE_VARIANT: Record<
  NotificationType,
  "info" | "brand" | "success" | "warning" | "danger"
> = {
  new_trip: "info",
  offer_received: "brand",
  offer_accepted: "success",
  offer_countered: "warning",
  offer_declined: "danger",
  trip_expiring: "danger",
  settlement_paid: "success",
};

const TYPE_LABEL: Record<NotificationType, string> = {
  new_trip: "New Trip",
  offer_received: "Offer Received",
  offer_accepted: "Offer Accepted",
  offer_countered: "Countered",
  offer_declined: "Declined",
  trip_expiring: "Expiring",
  settlement_paid: "Payment",
};

type FilterTab = "all" | "unread" | "trips" | "offers" | "settlements";

const TRIP_TYPES: NotificationType[] = ["new_trip", "trip_expiring"];
const OFFER_TYPES: NotificationType[] = [
  "offer_received",
  "offer_accepted",
  "offer_countered",
  "offer_declined",
];
const SETTLEMENT_TYPES: NotificationType[] = ["settlement_paid"];

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

// ============================================================================
// Component
// ============================================================================

export default function MarketplaceNotifications() {
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(
    () => MOCK_MARKETPLACE_NOTIFICATIONS.map((n) => ({ ...n }))
  );
  const [filter, setFilter] = useState<FilterTab>("all");

  // ---------- derived ----------

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "trips":
        return notifications.filter((n) => TRIP_TYPES.includes(n.type));
      case "offers":
        return notifications.filter((n) => OFFER_TYPES.includes(n.type));
      case "settlements":
        return notifications.filter((n) => SETTLEMENT_TYPES.includes(n.type));
      default:
        return notifications;
    }
  }, [notifications, filter]);

  // ---------- actions ----------

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  // ---------- filter tabs ----------

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "trips", label: "Trips" },
    { key: "offers", label: "Offers" },
    { key: "settlements", label: "Settlements" },
  ];

  // ---------- render ----------

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Notifications"
        description="Marketplace alerts for new trips, offer updates, and expiring listings."
        actions={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge variant="brand">{unreadCount} unread</Badge>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
          </div>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-accent text-white"
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <p className="text-text-muted text-sm">No notifications</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((notif) => (
            <Card
              key={notif.id}
              hover
              onClick={() => markRead(notif.id)}
              className={!notif.read ? "border-l-4 border-l-blue-500" : ""}
            >
              <div className="flex items-start gap-3">
                {/* Unread dot */}
                <div className="pt-1 w-3 shrink-0 flex justify-center">
                  {!notif.read && (
                    <span className="block h-2.5 w-2.5 rounded-full bg-blue-500" />
                  )}
                </div>

                {/* Icon */}
                <span className="text-xl leading-none pt-0.5 shrink-0">
                  {TYPE_EMOJI[notif.type]}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm ${
                        !notif.read
                          ? "font-bold text-text-primary"
                          : "font-medium text-text-secondary"
                      }`}
                    >
                      {notif.title}
                    </span>
                    <Badge variant={TYPE_BADGE_VARIANT[notif.type]}>
                      {TYPE_LABEL[notif.type]}
                    </Badge>
                  </div>

                  <p className="text-sm text-text-muted mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-text-muted">
                      {formatRelativeTime(notif.timestamp)}
                    </span>

                    {notif.tripId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(notif.id);
                        }}
                        className="text-xs !px-2 !py-1"
                      >
                        View Trip
                      </Button>
                    )}

                    {notif.offerId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(notif.id);
                        }}
                        className="text-xs !px-2 !py-1"
                      >
                        View Offer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
