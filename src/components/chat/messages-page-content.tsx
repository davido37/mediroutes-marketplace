"use client";

import { useState } from "react";
import { useChatContext } from "@/hooks/use-chat-context";
import { useAppContext } from "@/hooks/use-app-context";
import { PageHeader } from "@/components/common/page-header";
import { ConversationList } from "./conversation-list";
import { ConversationView } from "./conversation-view";
import { ComposeView } from "./compose-view";
import { EmptyState } from "@/components/common/empty-state";
import type { ChatParticipant } from "@/lib/chat-types";

export function MessagesPageContent() {
  const { state: chatState, dispatch: chatDispatch, getConversationsForRole, sendMessage, createConversation } = useChatContext();
  const { state: appState } = useAppContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(false);

  const roleConversations = getConversationsForRole(appState.activeRole);
  const selectedConversation = selectedId ? roleConversations.find((c) => c.id === selectedId) ?? null : null;
  const selectedMessages = selectedId ? chatState.messages[selectedId] ?? [] : [];

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    chatDispatch({ type: "MARK_CONVERSATION_READ", payload: id });
  };

  const handleSend = (content: string) => {
    if (!selectedId) return;
    sendMessage(selectedId, content, appState.currentUser.id, appState.currentUser.name, appState.activeRole);
  };

  const handleComposeSend = (recipient: ChatParticipant, message: string) => {
    const newId = createConversation(
      recipient,
      message,
      { id: appState.currentUser.id, name: appState.currentUser.name, role: appState.activeRole, orgName: appState.currentUser.orgName }
    );
    setComposing(false);
    setSelectedId(newId);
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`${roleConversations.length} conversations`}
      />

      <div className="flex rounded-lg border border-border bg-white overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        {/* Left: Conversation List */}
        <div className={`w-full md:w-[380px] md:border-r md:border-border shrink-0 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
          <ConversationList
            conversations={roleConversations}
            activeConversationId={selectedId}
            onSelectConversation={(id) => { setComposing(false); handleSelectConversation(id); }}
            searchQuery={search}
            onSearchChange={setSearch}
            onCompose={() => { setSelectedId(null); setComposing(true); }}
          />
        </div>

        {/* Right: Conversation View or Empty */}
        <div className={`flex-1 flex flex-col ${selectedConversation || composing ? "flex" : "hidden md:flex"}`}>
          {composing ? (
            <ComposeView
              currentUserId={appState.currentUser.id}
              onSend={handleComposeSend}
              onCancel={() => setComposing(false)}
            />
          ) : selectedConversation ? (
            <>
              {/* Mobile back button */}
              <div className="md:hidden flex items-center gap-2 border-b border-border px-3 py-2">
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-1 text-sm text-accent font-medium"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <span className="text-sm font-semibold text-text-primary truncate">{selectedConversation.title}</span>
              </div>
              <ConversationView
                conversation={selectedConversation}
                messages={selectedMessages}
                currentUserId={appState.currentUser.id}
                onSend={handleSend}
              />
            </>
          ) : (
            <EmptyState
              icon="💬"
              title="Select a conversation"
              description="Choose a conversation from the list to view messages, or click New to start one"
            />
          )}
        </div>
      </div>
    </div>
  );
}
