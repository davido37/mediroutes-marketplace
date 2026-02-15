"use client";

import { useChatContext } from "@/hooks/use-chat-context";
import { useAppContext } from "@/hooks/use-app-context";
import { Card } from "@/components/common/card";
import { MessageBubble } from "./message-bubble";
import { MessageCompose } from "./message-compose";

interface TripMessagesPanelProps {
  tripId: string;
}

export function TripMessagesPanel({ tripId }: TripMessagesPanelProps) {
  const { state: chatState, getConversationsForTrip, sendMessage } = useChatContext();
  const { state: appState } = useAppContext();

  const tripConversations = getConversationsForTrip(tripId);

  if (tripConversations.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-8 text-text-muted">
          <span className="text-3xl mb-2">💬</span>
          <p className="text-sm font-medium">No messages for this trip</p>
          <p className="text-xs mt-1">Messages will appear here when conversations reference this trip</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tripConversations.map((conv) => {
        const messages = chatState.messages[conv.id] ?? [];
        return (
          <Card key={conv.id} padding="none">
            <div className="border-b border-border px-4 py-2">
              <p className="text-sm font-semibold text-text-primary">{conv.title}</p>
              <p className="text-[10px] text-text-muted">
                {conv.participants.map((p) => p.name).join(", ")}
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto px-3 py-2">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === appState.currentUser.id}
                />
              ))}
            </div>
            <MessageCompose
              onSend={(content) =>
                sendMessage(conv.id, content, appState.currentUser.id, appState.currentUser.name, appState.activeRole)
              }
            />
          </Card>
        );
      })}
    </div>
  );
}
