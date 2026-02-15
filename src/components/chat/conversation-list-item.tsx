"use client";

import type { Conversation } from "@/lib/chat-types";
import { ConversationTypeBadge } from "./conversation-type-badge";
import { timeAgo } from "@/lib/utils";

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, isActive, onClick }: ConversationListItemProps) {
  const initials = conversation.title
    .split(" ")
    .filter((w) => w.length > 0 && w[0] !== "#" && w[0] !== "—" && w[0] !== "↔")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const avatarColors: Record<string, string> = {
    direct: "bg-accent text-white",
    trip: "bg-brand text-white",
    broadcast: "bg-warning text-white",
    cross_org: "bg-purple text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${
        isActive
          ? "bg-accent-lightest"
          : conversation.unreadCount > 0
            ? "bg-info-light/20 hover:bg-surface-muted"
            : "hover:bg-surface-muted"
      }`}
    >
      {/* Avatar */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[conversation.type]}`}>
        {conversation.isBroadcast ? "📢" : initials || "?"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-semibold text-text-primary" : "font-medium text-text-primary"}`}>
            {conversation.title}
          </span>
          <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0">
            {timeAgo(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <ConversationTypeBadge type={conversation.type} />
          {conversation.tripId && (
            <span className="text-[10px] text-accent font-medium">#{conversation.tripId}</span>
          )}
        </div>
        <p className={`text-xs mt-1 truncate ${conversation.unreadCount > 0 ? "text-text-secondary font-medium" : "text-text-muted"}`}>
          {conversation.lastMessagePreview}
        </p>
      </div>

      {/* Unread badge */}
      {conversation.unreadCount > 0 && (
        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  );
}
