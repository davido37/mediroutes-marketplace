"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/hooks/use-app-context";
import { useChatContext } from "@/hooks/use-chat-context";
import { NAV_ITEMS } from "@/lib/constants";

export function SidebarNav() {
  const { state } = useAppContext();
  const { getUnreadCountForRole } = useChatContext();
  const pathname = usePathname();
  const items = NAV_ITEMS[state.activeRole];

  const unreadCount = getUnreadCountForRole(state.activeRole);

  return (
    <nav className="flex flex-col gap-1 py-2">
      {items.map((item) => {
        const isActive = pathname === item.path ||
          (pathname.startsWith(item.path) && item.path !== `/${state.activeRole}` && !item.path.endsWith("/dashboard"));

        // Dynamic badge for Messages nav item
        const badge = item.label === "Messages" && unreadCount > 0
          ? String(unreadCount)
          : item.badge;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent-lightest text-accent"
                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {badge && (
              <span className="ml-auto inline-flex items-center rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
