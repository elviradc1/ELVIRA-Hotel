import { useState } from "react";
import { Layout } from "../../components/Layout";
import { hotelMenuItems } from "../../utils/hotel/menuItems";
import { useHotelRealtime } from "../../hooks/useRealtime";
import { HotelProvider } from "../../contexts/HotelContext";
import { useHotelId } from "../../hooks/useHotelContext";
import {
  Overview,
  HotelStaff,
  ChatManagement,
  GuestManagement,
  AiSupport,
  Amenities,
  HotelRestaurant,
  HotelShop,
  ThirdPartyManagement,
  Announcements,
  QnA,
  EmergencyContacts,
  Settings,
} from "./";

interface HotelDashboardProps {
  user: {
    email: string;
    role: string;
  };
  onSignOut: () => void;
}

const componentMap = {
  overview: <Overview />,
  "hotel-staff": <HotelStaff />,
  "chat-management": <ChatManagement />,
  "guest-management": <GuestManagement />,
  "ai-support": <AiSupport />,
  amenities: <Amenities />,
  "hotel-restaurant": <HotelRestaurant />,
  "hotel-shop": <HotelShop />,
  "third-party-management": <ThirdPartyManagement />,
  announcements: <Announcements />,
  qna: <QnA />,
  "emergency-contacts": <EmergencyContacts />,
  settings: <Settings />,
};

// Inner dashboard component that uses hotel context
function DashboardContent({ user, onSignOut }: HotelDashboardProps) {
  const [activeMenuItem, setActiveMenuItem] = useState("overview");
  const hotelId = useHotelId();

  // Set up real-time subscriptions for the user's hotel
  useHotelRealtime(hotelId || undefined, user.email);

  const activeComponent = componentMap[
    activeMenuItem as keyof typeof componentMap
  ] || <Overview />;

  console.log("🟢 HotelDashboard: Real-time enabled for hotel:", hotelId);

  return (
    <Layout
      user={user}
      onSignOut={onSignOut}
      menuItems={hotelMenuItems}
      activeMenuItem={activeMenuItem}
      onMenuItemChange={setActiveMenuItem}
      collapsible={true}
    >
      {activeComponent}
    </Layout>
  );
}

// Main dashboard component wrapped with hotel provider
export function HotelDashboard({ user, onSignOut }: HotelDashboardProps) {
  return (
    <HotelProvider
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              Unable to load hotel information
            </div>
            <button
              onClick={onSignOut}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Sign out
            </button>
          </div>
        </div>
      }
    >
      <DashboardContent user={user} onSignOut={onSignOut} />
    </HotelProvider>
  );
}
