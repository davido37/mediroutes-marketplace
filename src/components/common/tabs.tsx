"use client";

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex border-b border-border ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "text-accent border-b-2 border-accent -mb-px"
              : "text-text-muted hover:text-text-primary"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.id
                  ? "bg-accent-lightest text-accent"
                  : "bg-surface-muted text-text-muted"
              }`}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
