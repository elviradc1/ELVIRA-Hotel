import { useState } from "react";
import { Layout } from "../../components/Layout";
import { hotelMenuItems } from "../../utils/hotel/menuItems";
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

export function HotelDashboard({ user, onSignOut }: HotelDashboardProps) {
  const [activeMenuItem, setActiveMenuItem] = useState("overview");

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
