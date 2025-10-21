import { useState } from "react";
import { ConversationList, ChatWindow } from "../common";
import type { ChatConversation, ChatMessage, ChatUser } from "../types";

export function StaffCommunication() {
  const [searchValue, setSearchValue] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [conversations] = useState<ChatConversation[]>([
    {
      id: "staff-1",
      participantId: "alice-johnson",
      participantName: "Alice Johnson",
      lastMessage: "Room 305 needs maintenance check",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      unreadCount: 2,
      status: "active",
      department: "Housekeeping",
    },
    {
      id: "staff-2",
      participantId: "mike-wilson",
      participantName: "Mike Wilson",
      lastMessage: "New reservation for tonight",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      unreadCount: 0,
      status: "away",
      department: "Front Desk",
    },
    {
      id: "staff-3",
      participantId: "team-maintenance",
      participantName: "Maintenance Team",
      lastMessage: "Pool heating system is back online",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
      unreadCount: 1,
      status: "active",
      department: "Maintenance",
    },
    {
      id: "staff-4",
      participantId: "sara-davis",
      participantName: "Sara Davis",
      lastMessage: "Kitchen inventory updated",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unreadCount: 0,
      status: "offline",
      department: "Kitchen",
    },
  ]);

  const [messages] = useState<ChatMessage[]>([
    {
      id: "staff-msg-1",
      senderId: "alice-johnson",
      senderName: "Alice Johnson",
      content: "Good morning team! Room 305 needs a maintenance check.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: "staff-msg-2",
      senderId: "current-user",
      senderName: "You",
      content: "I'll assign this to the maintenance team right away.",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      type: "text",
      isOwn: true,
      status: "read",
    },
    {
      id: "staff-msg-3",
      senderId: "alice-johnson",
      senderName: "Alice Johnson",
      content: "The guest mentioned the AC is not working properly.",
      timestamp: new Date(Date.now() - 1000 * 60 * 11),
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: "staff-msg-4",
      senderId: "current-user",
      senderName: "You",
      content:
        "Thanks for the details. I've created a work order for immediate attention.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: "text",
      isOwn: true,
      status: "delivered",
    },
  ]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const activeParticipant: ChatUser | undefined = activeConversation
    ? {
        id: activeConversation.participantId,
        name: activeConversation.participantName,
        avatar: activeConversation.participantAvatar,
        status:
          activeConversation.status === "active"
            ? "online"
            : activeConversation.status,
        department: activeConversation.department,
        role: "Staff Member",
      }
    : undefined;

  const handleSendMessage = (content: string, type: "text" | "file") => {
    // In a real app, this would send the message to the backend
    console.log("Sending staff message:", {
      content,
      type,
      to: activeConversationId,
    });
  };

  const handleVideoCall = () => {
    console.log("Initiating video call with:", activeParticipant?.name);
  };

  const handlePhoneCall = () => {
    console.log("Initiating phone call with:", activeParticipant?.name);
  };

  const handleInfo = () => {
    console.log("Showing staff info for:", activeParticipant?.name);
  };

  // Show messages only for the first conversation as demo
  const displayMessages = activeConversationId === "staff-1" ? messages : [];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={setActiveConversationId}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search staff..."
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          participant={activeParticipant}
          messages={displayMessages}
          onSendMessage={handleSendMessage}
          onlineCount={8}
          showVideoCall={true}
          showPhoneCall={true}
          onVideoCall={handleVideoCall}
          onPhoneCall={handlePhoneCall}
          onInfo={handleInfo}
          inputPlaceholder="Message staff..."
        />
      </div>
    </div>
  );
}
