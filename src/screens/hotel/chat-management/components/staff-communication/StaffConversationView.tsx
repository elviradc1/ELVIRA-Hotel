import { useState, useEffect, useRef } from "react";
import { Button } from "../../../../../components/ui";
import { LoadingState } from "../../../../../components/ui/states";
import {
  useGetOrCreateStaffConversation,
  useStaffMessages,
  useSendStaffMessage,
} from "../../../../../hooks/chat-management";
import { useAuth } from "../../../../../hooks/useAuth";

interface StaffMember {
  id: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface StaffConversationViewProps {
  otherStaffId: string;
  staffMembers: StaffMember[];
}

export function StaffConversationView({
  otherStaffId,
  staffMembers,
}: StaffConversationViewProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const getOrCreateConversation = useGetOrCreateStaffConversation();
  const { data: messages, isLoading: messagesLoading } = useStaffMessages(
    conversationId || undefined
  );
  const sendMessage = useSendStaffMessage();

  // Get or create conversation when staff is selected
  useEffect(() => {
    console.log("🔄 [StaffConversationView] useEffect triggered");
    console.log("🔄 otherStaffId:", otherStaffId);
    console.log("🔄 Current conversationId:", conversationId);
    console.log(
      "🔄 getOrCreateConversation.isPending:",
      getOrCreateConversation.isPending
    );

    if (!otherStaffId) {
      console.log(
        "⚠️ [StaffConversationView] No otherStaffId, clearing conversation"
      );
      setConversationId(null);
      return;
    }

    const initConversation = async () => {
      try {
        console.log(
          "🔄 [StaffConversationView] Calling getOrCreateConversation..."
        );
        const conversation = await getOrCreateConversation.mutateAsync(
          otherStaffId
        );
        console.log(
          "✅ [StaffConversationView] Conversation obtained:",
          conversation
        );
        console.log(
          "✅ [StaffConversationView] Setting conversationId to:",
          conversation.id
        );
        setConversationId(conversation.id);
      } catch (error) {
        console.error(
          "❌ [StaffConversationView] Error getting/creating conversation:",
          error
        );
        if (error instanceof Error) {
          console.error("❌ Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
      }
    };

    initConversation();
  }, [otherStaffId]); // Only depend on otherStaffId, not conversationId

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get other staff member info
  const otherStaff = staffMembers.find((s) => s.id === otherStaffId);
  const otherStaffName = otherStaff?.hotel_staff_personal_data
    ? `${otherStaff.hotel_staff_personal_data.first_name} ${otherStaff.hotel_staff_personal_data.last_name}`
    : "Unknown";

  const handleSendMessage = async () => {
    console.log("📧 [StaffConversationView] handleSendMessage called");
    console.log("📧 Message text:", messageText);
    console.log("📧 Message trimmed:", messageText.trim());
    console.log("📧 Conversation ID:", conversationId);
    console.log("📧 Is mutation pending:", sendMessage.isPending);

    if (!messageText.trim()) {
      console.warn("⚠️ [StaffConversationView] Message is empty, aborting");
      return;
    }

    if (!conversationId) {
      console.error("❌ [StaffConversationView] No conversation ID, aborting");
      return;
    }

    if (sendMessage.isPending) {
      console.warn(
        "⚠️ [StaffConversationView] Message send already in progress"
      );
      return;
    }

    try {
      console.log(
        "📧 [StaffConversationView] Calling sendMessage.mutateAsync..."
      );
      await sendMessage.mutateAsync({
        conversationId,
        message: messageText,
      });
      console.log("✅ [StaffConversationView] Message sent, clearing input");
      setMessageText("");
    } catch (error) {
      console.error("❌ [StaffConversationView] Error sending message:", error);
      if (error instanceof Error) {
        console.error("❌ Error name:", error.name);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (getOrCreateConversation.isPending) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingState message="Loading conversation..." />
      </div>
    );
  }

  if (getOrCreateConversation.isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-semibold">Failed to load conversation</p>
          <p className="text-sm mt-2">
            {getOrCreateConversation.error instanceof Error
              ? getOrCreateConversation.error.message
              : "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingState message="Preparing conversation..." />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{otherStaffName}</h3>
        <p className="text-xs text-gray-500">
          {otherStaff?.hotel_staff_personal_data ? "Online" : ""}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <LoadingState message="Loading messages..." />
        ) : messages && messages.length > 0 ? (
          messages.map((message: any) => {
            const isCurrentUser = message.sender_id === user?.id;
            const senderName = message.sender?.hotel_staff_personal_data
              ? `${message.sender.hotel_staff_personal_data.first_name} ${message.sender.hotel_staff_personal_data.last_name}`
              : "Unknown";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-semibold mb-1">
                      {senderName}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-emerald-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherStaffName}...`}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={2}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </>
  );
}
