"use client";

import { useEffect, useRef } from "react";
import type { Conversation, ChatMessage } from "@/lib/chat-types";
import { MessageBubble } from "./message-bubble";
import { MessageCompose } from "./message-compose";
import { BroadcastBanner } from "./broadcast-banner";
import { OrgBadge } from "./org-badge";

interface ConversationViewProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (content: string) => void;
}

export function ConversationView({ conversation, messages, currentUserId, onSend }: ConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const isBroadcastRecipient = conversation.isBroadcast && conversation.broadcastSenderId !== currentUserId;

  return (
    <div className="flex flex-col h-full">
      {/* Participants bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 bg-surface-muted/50">
        <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Participants:</span>
        {conversation.participants.map((p) => (
          <div key={p.userId} className="flex items-center gap-1">
            <span className="text-xs text-text-secondary font-medium">{p.name}</span>
            <OrgBadge orgName={p.orgName} role={p.role} />
          </div>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {conversation.isBroadcast && (
          <div className="mb-3">
            <BroadcastBanner />
          </div>
        )}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === currentUserId}
            />
          ))
        )}
      </div>

      {/* Compose */}
      <MessageCompose onSend={onSend} disabled={isBroadcastRecipient} />
    </div>
  );
}
