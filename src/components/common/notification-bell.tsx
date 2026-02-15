"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/hooks/use-app-context";
import { timeAgo } from "@/lib/utils";

export function NotificationBell() {
  const { state, dispatch } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-white text-text-secondary hover:bg-surface-muted transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-xl border border-border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-text-primary">Notifications</p>
            {unreadCount > 0 && (
              <span className="text-xs text-text-muted">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <p className="p-4 text-sm text-text-muted text-center">
                No notifications
              </p>
            ) : (
              state.notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-muted transition-colors cursor-pointer ${
                    !notif.read ? "bg-info-light/30" : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "MARK_NOTIFICATION_READ", payload: notif.id });
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "font-semibold" : ""} text-text-primary truncate`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1">
                      {timeAgo(notif.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
