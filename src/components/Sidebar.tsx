import { useState } from "react";
import type { ReactElement } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactElement;
}

interface SidebarProps {
  user: {
    email: string;
    role: string;
  };
  onSignOut: () => void;
  menuItems?: MenuItem[];
  activeMenuItem?: string;
  onMenuItemChange?: (itemId: string) => void;
  collapsible?: boolean;
}

export function Sidebar({
  user,
  onSignOut,
  menuItems = [],
  activeMenuItem = "",
  onMenuItemChange,
  collapsible = false,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-emerald-500 shrink-0 flex flex-col transition-all duration-300 h-screen sticky top-0`}
    >
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="text-emerald-100 text-sm">
              {user.role.toUpperCase()} Dashboard
            </div>
          )}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-emerald-100 hover:text-white p-1 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 -mr-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuItemChange?.(item.id)}
              className={`w-full flex items-center px-3 py-2 text-left transition-colors duration-200 ${
                activeMenuItem === item.id
                  ? "bg-gray-50 text-gray-900 rounded-l-3xl pr-8"
                  : "text-emerald-100 hover:bg-emerald-600 hover:text-white rounded-3xl mr-4"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Sign out button at bottom of sidebar */}
      <div className="p-4 border-t border-emerald-400">
        <button
          onClick={onSignOut}
          className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white ${
            isCollapsed ? "px-2" : "px-4"
          } py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-500 transition-colors duration-200`}
        >
          {isCollapsed ? (
            <svg
              className="w-5 h-5 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          ) : (
            "Sign out"
          )}
        </button>
      </div>
    </aside>
  );
}
