import { SearchBox } from "../../../../../components/ui";
import type { ChatConversation } from "../types";

interface ConversationListProps {
  conversations: ChatConversation[];
  activeConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search conversations...",
}: ConversationListProps) {
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participantName
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      conversation.lastMessage
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      (conversation.roomNumber &&
        conversation.roomNumber
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (conversation.department &&
        conversation.department
          .toLowerCase()
          .includes(searchValue.toLowerCase()))
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <SearchBox
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchValue ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`
                  p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    activeConversationId === conversation.id
                      ? "bg-emerald-50 border-r-2 border-emerald-500"
                      : ""
                  }
                `}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar with Status */}
                  <div className="relative shrink-0">
                    {conversation.participantAvatar ? (
                      <img
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        conversation.status
                      )}`}
                    ></div>
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.participantName}
                        </h3>
                        {conversation.roomNumber && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Room {conversation.roomNumber}
                          </span>
                        )}
                        {conversation.department && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {conversation.department}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
