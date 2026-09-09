"use client";

import { useState, type ReactNode } from "react";
import ClickableButton from "./button";

export interface Tab {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  children?: (activeTab: string) => ReactNode;
  /**
   * Classes for the panel wrapper.
   * For Dashboard & Detail pages (see `knowledge-base/global/layout.mdc`),
   * the panel should fill the main scroll container without creating its own
   * page-level scroll. At `md+`, internal component scrolling is allowed
   * when content requires it — rely on component-internal `overflow-auto`
   * (e.g. InfoCard `scrollable`, UserTable) rather than on the panel wrapper.
   * Below `md`, page-level vertical scrolling is allowed and internal component
   * scrolling MUST NOT be used — so do NOT put `overflow-y-auto` here; let the
   * page scroll keep reflowed content reachable.
   */
  panelClassName?: string;
}

/**
 * Tabbed pages navigation component.
 * Follows Design System rules:
 * - Tabs are presented on a single row.
 * - Only one tab can be active at a time.
 * - The active tab is clearly distinguished from inactive ones.
 * - Clicking a tab activates it immediately and shows its associated content.
 */
export default function Tabs({
  tabs,
  defaultValue,
  onChange,
  children,
  panelClassName = "mt-component",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultValue ?? tabs[0]?.value,
  );

  const handleSelect = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div
        role="tablist"
        className="inline-flex max-w-full items-center gap-micro overflow-x-auto rounded-medium bg-surface-muted p-micro"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <ClickableButton
              key={tab.value}
              type="button"
              variant="bare"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleSelect(tab.value)}
              className={`whitespace-nowrap rounded-small px-component py-inline text-body-medium focus-visible:ring-primary ${
                isActive
                  ? "bg-surface text-primary shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </ClickableButton>
          );
        })}
      </div>
      {children && <div className={panelClassName}>{children(activeTab!)}</div>}
    </div>
  );
}
