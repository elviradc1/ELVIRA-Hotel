import type { ReactNode } from "react";
import { SearchBox } from "../forms/SearchBox";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsWithSearchProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onSearchClear?: () => void;
  className?: string;
}

export function TabsWithSearch({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onSearchClear,
  className = "",
}: TabsWithSearchProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Tabs Section */}
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? "text-gray-900 border-emerald-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span className="uppercase tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Section */}
        <div className="w-80">
          <SearchBox
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            onClear={onSearchClear}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
