export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "system";
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: "active" | "away" | "offline";
  roomNumber?: string; // For guest conversations
  department?: string; // For staff conversations
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  role?: string;
  department?: string;
  roomNumber?: string;
}

export interface EmojiReaction {
  emoji: string;
  label: string;
}
