import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

export interface StaffConversationDetail {
  id: string;
  isGroup: boolean;
  title?: string;
  participantId?: string; // For 1-on-1 conversations
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status?: "online" | "offline" | "active";
  department?: string;
  participantCount?: number; // For group chats
}

/**
 * Hook to fetch all staff conversations with full details (both 1-on-1 and groups)
 * This replaces the simple staff member list with actual conversation data
 */
export function useStaffConversationsList() {
  const { user } = useAuth();

  const result = useOptimizedQuery<StaffConversationDetail[]>({
    queryKey: queryKeys.staffConversations(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      console.log(
        "🔍 [useStaffConversationsList] Fetching conversations for user:",
        user.id
      );

      // Get all conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          conversation_id,
          staff_conversations!inner (
            id,
            is_group,
            title,
            last_message_at,
            created_at,
            last_message_id
          )
        `
        )
        .eq("staff_id", user.id)
        .order("staff_conversations(last_message_at)", { ascending: false });

      if (participantError) {
        console.error(
          "❌ [useStaffConversationsList] Error fetching participants:",
          participantError
        );
        throw participantError;
      }

      if (!participantData || participantData.length === 0) {
        console.log("ℹ️ [useStaffConversationsList] No conversations found");
        return [];
      }

      console.log(
        `✅ [useStaffConversationsList] Found ${participantData.length} conversations`
      );

      // Process each conversation
      const conversationPromises = participantData.map(async (participant) => {
        const conversation = participant.staff_conversations as {
          id: string;
          is_group: boolean | null;
          title: string | null;
          last_message_at: string | null;
          created_at: string | null;
          last_message_id: string | null;
        };

        // Get all participants for this conversation
        const { data: allParticipants, error: allParticipantsError } =
          await supabase
            .from("staff_conversation_participants")
            .select(
              `
            staff_id,
            hotel_staff!inner (
              id,
              department,
              hotel_staff_personal_data (
                first_name,
                last_name
              )
            )
          `
            )
            .eq("conversation_id", conversation.id);

        if (allParticipantsError) {
          console.error(
            "❌ Error fetching participants for conversation:",
            conversation.id,
            allParticipantsError
          );
          return null;
        }

        // Get last message if exists
        let lastMessageText = "";
        if (conversation.last_message_id) {
          const { data: lastMessageData } = await supabase
            .from("staff_messages")
            .select("message")
            .eq("id", conversation.last_message_id)
            .is("deleted_at", null)
            .single();

          // Type assertion needed because TypeScript types say 'content' but DB has 'message'
          lastMessageText =
            (lastMessageData as unknown as { message?: string })?.message || "";
        }

        // Get unread count - simplified for now (just show if unread)
        const { data: readStatus } = await supabase
          .from("staff_conversation_reads")
          .select("last_read_at")
          .eq("conversation_id", conversation.id)
          .eq("staff_id", user.id)
          .single();

        let unreadCount = 0;
        if (conversation.last_message_at && readStatus) {
          // If last message is after last read, it's unread
          const lastMessageTime = new Date(
            conversation.last_message_at
          ).getTime();
          const lastReadTime = new Date(readStatus.last_read_at).getTime();
          unreadCount = lastMessageTime > lastReadTime ? 1 : 0;
        } else if (conversation.last_message_id && !readStatus) {
          unreadCount = 1; // Has messages but never read
        }

        const isGroup = conversation.is_group;

        if (isGroup) {
          // Group conversation
          return {
            id: conversation.id,
            isGroup: true,
            title: conversation.title,
            participantName: conversation.title || "Unnamed Group",
            lastMessage: lastMessageText,
            lastMessageTime: conversation.last_message_at
              ? new Date(conversation.last_message_at)
              : new Date(conversation.created_at || Date.now()),
            unreadCount,
            status: "active" as const,
            participantCount: allParticipants?.length || 0,
          } as StaffConversationDetail;
        } else {
          // 1-on-1 conversation - get the other participant
          const otherParticipant = allParticipants?.find(
            (p: { staff_id: string }) => p.staff_id !== user.id
          );

          if (!otherParticipant) {
            console.warn(
              "⚠️ No other participant found for 1-on-1 conversation:",
              conversation.id
            );
            return null;
          }

          const staffData = otherParticipant.hotel_staff as {
            id: string;
            department: string | null;
            hotel_staff_personal_data: {
              first_name: string;
              last_name: string;
            } | null;
          };
          const personalData = staffData?.hotel_staff_personal_data;

          return {
            id: conversation.id,
            isGroup: false,
            participantId: otherParticipant.staff_id,
            participantName: personalData
              ? `${personalData.first_name} ${personalData.last_name}`
              : "Unknown",
            lastMessage: lastMessageText,
            lastMessageTime: conversation.last_message_at
              ? new Date(conversation.last_message_at)
              : new Date(conversation.created_at || Date.now()),
            unreadCount,
            status: "active" as const,
            department: staffData?.department || undefined,
          } as StaffConversationDetail;
        }
      });

      const conversations = await Promise.all(conversationPromises);
      const validConversations = conversations.filter(
        (c): c is StaffConversationDetail => c !== null
      );

      // Sort conversations alphabetically by participant name
      validConversations.sort((a, b) =>
        a.participantName.localeCompare(b.participantName)
      );

      console.log(
        `✅ [useStaffConversationsList] Processed ${validConversations.length} valid conversations`
      );
      return validConversations;
    },
    enabled: !!user?.id,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Conversations List",
  });

  // Real-time subscription for conversation updates
  useRealtimeSubscription({
    table: "staff_conversations",
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  // Real-time subscription for participant changes
  useRealtimeSubscription({
    table: "staff_conversation_participants",
    filter: user?.id ? `staff_id=eq.${user.id}` : undefined,
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  // Real-time subscription for new messages
  useRealtimeSubscription({
    table: "staff_messages",
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  return result;
}
