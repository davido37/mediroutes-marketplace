"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/hooks/use-chat-context";
import { useAppContext } from "@/hooks/use-app-context";
import { ConversationList } from "./conversation-list";
import { ConversationView } from "./conversation-view";

export function ChatDrawer() {
  const { state: chatState, dispatch: chatDispatch, getConversationsForRole, sendMessage } = useChatContext();
  const { state: appState } = useAppContext();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  const roleConversations = getConversationsForRole(appState.activeRole);
  const activeConversation = chatState.activeConversationId
    ? chatState.conversations.find((c) => c.id === chatState.activeConversationId) ?? null
    : null;
  const activeMessages = chatState.activeConversationId
    ? chatState.messages[chatState.activeConversationId] ?? []
    : [];

  // Close on Escape
  useEffect(() => {
    if (!chatState.drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") chatDispatch({ type: "CLOSE_DRAWER" });
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [chatState.drawerOpen, chatDispatch]);

  // Close on click outside
  useEffect(() => {
    if (!chatState.drawerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        // Don't close if clicking the header button
        const target = e.target as HTMLElement;
        if (target.closest("[data-chat-toggle]")) return;
        chatDispatch({ type: "CLOSE_DRAWER" });
      }
    };
    // Small delay to avoid immediately closing
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [chatState.drawerOpen, chatDispatch]);

  if (!chatState.drawerOpen) return null;

  const handleSelectConversation = (id: string) => {
    chatDispatch({ type: "SET_ACTIVE_CONVERSATION", payload: id });
    chatDispatch({ type: "MARK_CONVERSATION_READ", payload: id });
  };

  const handleSend = (content: string) => {
    if (!chatState.activeConversationId) return;
    sendMessage(
      chatState.activeConversationId,
      content,
      appState.currentUser.id,
      appState.currentUser.name,
      appState.activeRole
    );
  };

  const handleExpandToFullPage = () => {
    chatDispatch({ type: "CLOSE_DRAWER" });
    router.push(`/${appState.activeRole}/messages`);
  };

  return (
    <div
      ref={drawerRef}
      className="fixed right-0 top-14 bottom-[38px] z-40 w-96 max-w-full border-l border-border bg-white shadow-lg flex flex-col"
      style={{ animation: "slideInRight 0.2s ease-out" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          {activeConversation && (
            <button
              onClick={() => chatDispatch({ type: "SET_ACTIVE_CONVERSATION", payload: null })}
              className="flex items-center justify-center h-7 w-7 rounded-lg text-text-muted hover:bg-surface-muted transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-sm font-semibold text-text-primary truncate">
            {activeConversation ? activeConversation.title : "Messages"}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExpandToFullPage}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-text-muted hover:bg-surface-muted transition-colors"
            title="Open full page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={() => chatDispatch({ type: "CLOSE_DRAWER" })}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-text-muted hover:bg-surface-muted transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {activeConversation ? (
          <ConversationView
            conversation={activeConversation}
            messages={activeMessages}
            currentUserId={appState.currentUser.id}
            onSend={handleSend}
          />
        ) : (
          <ConversationList
            conversations={roleConversations}
            activeConversationId={null}
            onSelectConversation={handleSelectConversation}
            searchQuery={chatState.searchQuery}
            onSearchChange={(q) => chatDispatch({ type: "SET_SEARCH_QUERY", payload: q })}
          />
        )}
      </div>
    </div>
  );
}
