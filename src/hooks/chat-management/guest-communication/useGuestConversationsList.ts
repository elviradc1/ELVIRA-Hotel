import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotel } from "../../useCurrentUserHotel";

export interface GuestConversationListItem {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: string;
}

/**
 * Hook to fetch all guest conversations for the current hotel
 * Returns a formatted list suitable for the ConversationList component
 */
export function useGuestConversationsList() {
  const { data: currentUserHotel } = useCurrentUserHotel();
  const hotelId = currentUserHotel?.hotelId;

  const result = useOptimizedQuery({
    queryKey: queryKeys.guestConversations(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) {
        return [];
      }

      // Get all conversations with guest info and last message
      const { data: conversations, error: convError } = await supabase
        .from("guest_conversation")
        .select(
          `
          id,
          guest_id,
          last_message_at,
          status,
          guests (
            id,
            guest_name,
            room_number
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("last_message_at", { ascending: false });

      if (convError) {
        console.error("❌ [useGuestConversationsList] Query error:", convError);
        throw convError;
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // Get last message for each conversation
      const conversationIds = conversations.map((c) => c.id);
      const { data: lastMessages, error: msgError } = await supabase
        .from("guest_messages")
        .select("conversation_id, message_text, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false });

      if (msgError) {
        console.error(
          "❌ [useGuestConversationsList] Messages query error:",
          msgError
        );
      }

      // Get unread counts for each conversation (only guest messages not read by staff)
      const { data: unreadCounts } = await supabase
        .from("guest_messages")
        .select("conversation_id, id")
        .in("conversation_id", conversationIds)
        .eq("sender_type", "guest")
        .eq("is_read", false);

      // Map last messages to conversations
      const lastMessageMap = new Map<
        string,
        { message_text: string; created_at: string }
      >();
      if (lastMessages) {
        lastMessages.forEach((msg) => {
          if (!lastMessageMap.has(msg.conversation_id)) {
            lastMessageMap.set(msg.conversation_id, {
              message_text: msg.message_text,
              created_at: msg.created_at,
            });
          }
        });
      }

      // Count unread messages per conversation
      const unreadCountMap = new Map<string, number>();
      if (unreadCounts) {
        unreadCounts.forEach((msg) => {
          unreadCountMap.set(
            msg.conversation_id,
            (unreadCountMap.get(msg.conversation_id) || 0) + 1
          );
        });
      }

      // Format conversations
      const formattedConversations: GuestConversationListItem[] = conversations
        .map((conv) => {
          const lastMsg = lastMessageMap.get(conv.id);
          const guest = conv.guests as {
            id: string;
            guest_name: string;
            room_number: string | null;
          } | null;

          if (!guest) {
            return null;
          }

          return {
            id: conv.id,
            guestId: conv.guest_id,
            guestName: guest.guest_name,
            roomNumber: guest.room_number,
            lastMessage: lastMsg?.message_text || "",
            lastMessageTime: new Date(
              lastMsg?.created_at || conv.last_message_at
            ),
            unreadCount: unreadCountMap.get(conv.id) || 0,
            status: conv.status,
          };
        })
        .filter((c): c is GuestConversationListItem => c !== null);

      console.log(
        "✅ [useGuestConversationsList] Loaded",
        formattedConversations.length,
        "conversations"
      );

      return formattedConversations;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Guest Conversations List",
  });

  // Real-time subscription for conversations
  useRealtimeSubscription({
    table: "guest_conversation",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.guestConversations(hotelId || ""),
    enabled: !!hotelId,
  });

  // Real-time subscription for messages to update unread counts
  useRealtimeSubscription({
    table: "guest_messages",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.guestConversations(hotelId || ""),
    enabled: !!hotelId,
  });

  return result;
}
