"use client";

import { useChatContext } from "@/hooks/use-chat-context";
import { useAppContext } from "@/hooks/use-app-context";

export function ChatHeaderButton() {
  const { state: chatState, dispatch: chatDispatch, getUnreadCountForRole } = useChatContext();
  const { state: appState } = useAppContext();

  const unreadCount = getUnreadCountForRole(appState.activeRole);

  return (
    <button
      onClick={() => chatDispatch({ type: "TOGGLE_DRAWER" })}
      className={`relative flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-white text-text-secondary hover:bg-surface-muted transition-colors ${
        chatState.drawerOpen ? "bg-accent-lightest border-accent-light" : ""
      }`}
    >
      💬
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
