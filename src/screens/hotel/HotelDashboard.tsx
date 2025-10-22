import { useState } from "react";
import { Layout } from "../../components/Layout";
import { hotelMenuItems } from "../../utils/hotel/menuItems";
import { HotelProvider } from "../../contexts/HotelContext";
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

  // Real-time subscriptions are now handled by individual module hooks
  // Each module (staff, chat, guests, etc.) has its own real-time subscription

  const activeComponent = componentMap[
    activeMenuItem as keyof typeof componentMap
  ] || <Overview />;

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
    <HotelProvider>
      <DashboardContent user={user} onSignOut={onSignOut} />
    </HotelProvider>
  );
}
