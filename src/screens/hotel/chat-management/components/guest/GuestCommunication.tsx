import { useState } from "react";
import { ConversationList, ChatWindow } from "../common";
import type { ChatConversation, ChatMessage, ChatUser } from "../types";

export function GuestCommunication() {
  const [searchValue, setSearchValue] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [conversations] = useState<ChatConversation[]>([
    {
      id: "guest-1",
      participantId: "martin-paris",
      participantName: "Martin Paris",
      lastMessage:
        "Bitte informieren Sie mich, wenn Sie weitere Informationen benötigen.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 3,
      status: "active",
      roomNumber: "105",
    },
    {
      id: "guest-2",
      participantId: "sarah-wilson",
      participantName: "Sarah Wilson",
      lastMessage: "Thank you for the room service!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 0,
      status: "away",
      roomNumber: "202",
    },
    {
      id: "guest-3",
      participantId: "john-doe",
      participantName: "John Doe",
      lastMessage: "What time is checkout?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 1,
      status: "offline",
      roomNumber: "301",
    },
  ]);

  const [messages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      senderId: "martin-paris",
      senderName: "Martin Paris",
      content: "Hello, I have a question about room service.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: "msg-2",
      senderId: "hotel-staff",
      senderName: "Hotel Staff",
      content:
        "Hello Mr. Paris! I'd be happy to help you with room service. What would you like to know?",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      type: "text",
      isOwn: true,
      status: "read",
    },
    {
      id: "msg-3",
      senderId: "martin-paris",
      senderName: "Martin Paris",
      content: "What are the breakfast hours and can I order it to my room?",
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: "msg-4",
      senderId: "hotel-staff",
      senderName: "Hotel Staff",
      content:
        "Breakfast is served from 6:00 AM to 10:30 AM. Yes, we offer in-room dining! You can place your order through room service or this chat. Would you like to see our breakfast menu?",
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
      type: "text",
      isOwn: true,
      status: "read",
    },
    {
      id: "msg-5",
      senderId: "martin-paris",
      senderName: "Martin Paris",
      content:
        "Bitte informieren Sie mich, wenn Sie weitere Informationen benötigen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
      isOwn: false,
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
        roomNumber: activeConversation.roomNumber,
      }
    : undefined;

  const handleSendMessage = (content: string, type: "text" | "file") => {
    // In a real app, this would send the message to the backend
    console.log("Sending message:", {
      content,
      type,
      to: activeConversationId,
    });
  };

  const handlePhoneCall = () => {
    console.log(
      "Initiating phone call to room:",
      activeParticipant?.roomNumber
    );
  };

  const handleInfo = () => {
    console.log("Showing guest info for:", activeParticipant?.name);
  };

  const displayMessages = activeConversationId === "guest-1" ? messages : [];

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
          searchPlaceholder="Search guests..."
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          participant={activeParticipant}
          messages={displayMessages}
          onSendMessage={handleSendMessage}
          showPhoneCall={true}
          onPhoneCall={handlePhoneCall}
          onInfo={handleInfo}
          inputPlaceholder="Message guest..."
        />
      </div>
    </div>
  );
}
