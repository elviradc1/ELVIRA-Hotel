import type { ReactNode, ReactElement } from "react";
import { Sidebar } from "./Sidebar";
import { colors, typography } from "../utils/theme";

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
  hotelName?: string;
}

export function Layout({
  children,
  user,
  onSignOut,
  menuItems,
  activeMenuItem,
  onMenuItemChange,
  collapsible = false,
  hotelName,
}: LayoutProps) {
  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: colors.background.main,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <Sidebar
        user={user}
        onSignOut={onSignOut}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        onMenuItemChange={onMenuItemChange}
        collapsible={collapsible}
        hotelName={hotelName}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Sticky Footer */}
        <footer
          className="shrink-0 sticky bottom-0"
          style={{
            backgroundColor: colors.background.card,
            borderTop: `1px solid ${colors.border.DEFAULT}`,
            padding: "1rem",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p
              className="text-center text-sm"
              style={{ color: colors.text.secondary }}
            >
              © 2025 ELVIRA CONCIERGE. Hotel Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
