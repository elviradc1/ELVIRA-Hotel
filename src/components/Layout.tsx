import type { ReactNode, ReactElement } from "react";
import { Sidebar } from "./Sidebar";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactElement;
}

interface LayoutProps {
  children: ReactNode;
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

export function Layout({
  children,
  user,
  onSignOut,
  menuItems,
  activeMenuItem,
  onMenuItemChange,
  collapsible = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        onSignOut={onSignOut}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        onMenuItemChange={onMenuItemChange}
        collapsible={collapsible}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-600 text-sm">
              © 2025 ELVIRA CONCIERGE. Hotel Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
