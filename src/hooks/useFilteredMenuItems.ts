import { useMemo } from "react";
import { hotelMenuItems } from "../utils/hotel/menuItems";
import { useHotelSettings } from "./settings";
import { useHotelId } from "./useHotelContext";

/**
 * Hook to filter menu items based on hotel settings
 * Menu items are hidden when their corresponding setting is disabled
 */
export function useFilteredMenuItems() {
  const hotelId = useHotelId();
  const { data: settings, isLoading } = useHotelSettings(hotelId || undefined);

  const filteredMenuItems = useMemo(() => {
    if (!settings || settings.length === 0) {
      // If no settings exist yet, show all menu items by default
      return hotelMenuItems;
    }

    // Map menu item IDs to their corresponding setting keys
    const menuSettingsMap: Record<string, string> = {
      amenities: "hotel_amenities",
      "hotel-restaurant": "room_service_restaurant",
      "hotel-shop": "hotel_shop",
      "third-party-management": "tours_excursions",
      announcements: "hotel_announcements",
      qna: "qa_recommendations",
      "emergency-contacts": "emergency_contacts",
    };

    return hotelMenuItems.filter((item) => {
      // Always show these core items regardless of settings
      const alwaysVisible = [
        "overview",
        "hotel-staff",
        "chat-management",
        "guest-management",
        "ai-support",
        "settings",
      ];

      if (alwaysVisible.includes(item.id)) {
        return true;
      }

      // Check if item has a corresponding setting
      const settingKey = menuSettingsMap[item.id];
      if (!settingKey) {
        return true; // Show item if no setting is defined
      }

      // Find the setting value
      const setting = settings.find((s) => s.setting_key === settingKey);

      // Show item only if setting is enabled (true)
      return setting?.setting_value === true;
    });
  }, [settings]);

  return {
    menuItems: filteredMenuItems,
    isLoading,
  };
}
