import type { TabItem } from "./TabsWithSearch";

interface TabsWithoutSearchProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabsWithoutSearch({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsWithoutSearchProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
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
      </div>
    </div>
  );
}
