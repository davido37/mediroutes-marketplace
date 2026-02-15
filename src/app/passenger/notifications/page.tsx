"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";

// --- Types ---

type NotificationType =
  | "ride_update"
  | "ride_complete"
  | "benefit"
  | "schedule"
  | "payment";

type FilterTab = "all" | "unread" | "rides" | "benefits";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relativeTime: string;
  read: boolean;
}

// --- Helpers ---

const typeIcons: Record<NotificationType, string> = {
  ride_update: "\uD83D\uDE90",
  ride_complete: "\u2705",
  benefit: "\uD83D\uDCB3",
  schedule: "\uD83D\uDCC5",
  payment: "\uD83D\uDCB0",
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "ride_update",
    title: "Ride Confirmed",
    message:
      "Your ride to Mayo Clinic on Feb 10 at 2:30 PM is confirmed. Driver: Lisa Park",
    relativeTime: "10 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "ride_update",
    title: "Driver En Route",
    message:
      "Carlos Mendez is on the way to Kaiser Permanente. ETA: 12 minutes",
    relativeTime: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "ride_complete",
    title: "Ride Completed",
    message:
      "Your trip to Banner University is complete. Rate your experience!",
    relativeTime: "3h ago",
    read: true,
  },
  {
    id: "n4",
    type: "benefit",
    title: "Benefit Reminder",
    message:
      "You have 18 trips remaining this year under your AHCCCS plan",
    relativeTime: "1 day ago",
    read: true,
  },
  {
    id: "n5",
    type: "schedule",
    title: "Schedule Updated",
    message:
      "Your recurring dialysis ride for Wed has been confirmed",
    relativeTime: "2 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "payment",
    title: "Payment Processed",
    message: "Copay of $5.00 processed for trip on Feb 8",
    relativeTime: "3 days ago",
    read: true,
  },
];

// --- Filter helpers ---

function matchesFilter(n: Notification, filter: FilterTab): boolean {
  switch (filter) {
    case "unread":
      return !n.read;
    case "rides":
      return n.type === "ride_update" || n.type === "ride_complete";
    case "benefits":
      return n.type === "benefit" || n.type === "payment";
    default:
      return true;
  }
}

// --- Component ---

export default function PassengerNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const filtered = notifications.filter((n) => matchesFilter(n, filter));

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "rides", label: "Rides" },
    { key: "benefits", label: "Benefits" },
  ];

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="Notifications"
        description="Ride updates, reminders, and alerts for your transportation services."
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="danger">{unreadCount}</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-surface-muted rounded-lg">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
              filter === tab.key
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-text-muted text-center py-4">
              No notifications to show.
            </p>
          </Card>
        ) : (
          filtered.map((n) => (
            <Card
              key={n.id}
              hover
              onClick={() => markAsRead(n.id)}
              className={!n.read ? "border-l-[3px] border-l-accent" : ""}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className="text-xl shrink-0 mt-0.5">
                  {typeIcons[n.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-accent" />
                    )}
                    <span
                      className={`text-sm truncate ${
                        !n.read
                          ? "font-semibold text-text-primary"
                          : "font-medium text-text-secondary"
                      }`}
                    >
                      {n.title}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-text-muted mt-1 block">
                    {n.relativeTime}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
