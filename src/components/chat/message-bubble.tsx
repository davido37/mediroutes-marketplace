"use client";

import type { ChatMessage } from "@/lib/chat-types";
import { TripReferenceChip } from "./trip-reference-chip";
import { OrgBadge } from "./org-badge";
import { timeAgo } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  // System / trip_update messages — centered pill
  if (message.type === "system" || message.type === "trip_update") {
    return (
      <div className="flex justify-center my-2">
        <div className="rounded-full bg-surface-muted px-4 py-1.5 text-xs text-text-muted text-center max-w-[80%]">
          {message.type === "trip_update" && <span className="mr-1">🔄</span>}
          {message.content}
          {message.tripReferences.length > 0 && (
            <span className="ml-2 inline-flex gap-1">
              {message.tripReferences.map((ref) => (
                <TripReferenceChip key={ref.tripId} reference={ref} />
              ))}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Broadcast messages — full width with amber border
  if (message.type === "broadcast") {
    return (
      <div className="my-2">
        <div className="border-l-4 border-warning bg-warning-light/30 rounded-r-lg px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-text-primary">{message.senderName}</span>
            <OrgBadge orgName="" role={message.senderRole} />
            <span className="text-[10px] text-text-muted ml-auto">{timeAgo(message.timestamp)}</span>
          </div>
          <p className="text-sm text-text-primary">{message.content}</p>
        </div>
      </div>
    );
  }

  // Normal text messages — left/right aligned
  return (
    <div className={`flex my-1.5 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-0.5 px-1">
            <span className="text-[11px] font-medium text-text-secondary">{message.senderName}</span>
            <OrgBadge orgName="" role={message.senderRole} />
          </div>
        )}
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm ${
            isOwn
              ? "bg-accent text-white rounded-br-sm"
              : "bg-surface-muted text-text-primary rounded-bl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.tripReferences.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {message.tripReferences.map((ref) => (
                <TripReferenceChip key={ref.tripId} reference={ref} />
              ))}
            </div>
          )}
        </div>
        <p className={`text-[10px] text-text-muted mt-0.5 px-1 ${isOwn ? "text-right" : ""}`}>
          {timeAgo(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
