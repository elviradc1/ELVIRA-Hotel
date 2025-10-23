import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

/**
 * Hook to fetch messages for a staff conversation
 */
export function useStaffMessages(conversationId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.staffMessages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        console.log("❌ No conversation ID for staff messages");
        return [];
      }

      const { data, error } = await supabase
        .from("staff_messages")
        .select(
          `
          id,
          conversation_id,
          sender_id,
          message,
          created_at,
          sender:hotel_staff!staff_messages_sender_id_fkey (
            id,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Staff messages query error:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!conversationId,
    config: {
      staleTime: 1000 * 10, // 10 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Messages",
  });

  // Real-time subscription for new messages
  useRealtimeSubscription({
    table: "staff_messages",
    filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    queryKey: queryKeys.staffMessages(conversationId || ""),
    enabled: !!conversationId,
  });

  return result;
}

/**
 * Hook to send a staff message
 */
export function useSendStaffMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      console.log("📧 [useSendStaffMessage] Starting message send...");
      console.log("📧 User ID:", user?.id);
      console.log("📧 Conversation ID:", conversationId);
      console.log("📧 Message:", message);

      if (!user?.id) {
        console.error("❌ [useSendStaffMessage] No authenticated user");
        throw new Error("No authenticated user");
      }

      if (!conversationId) {
        console.error("❌ [useSendStaffMessage] No conversation ID");
        throw new Error("No conversation ID provided");
      }

      if (!message || !message.trim()) {
        console.error("❌ [useSendStaffMessage] Empty message");
        throw new Error("Message cannot be empty");
      }

      console.log(
        "📧 [useSendStaffMessage] Inserting message into database..."
      );

      // Insert message
      const { data, error } = await supabase
        .from("staff_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: message.trim(),
        })
        .select(
          `
          id,
          conversation_id,
          sender_id,
          message,
          created_at,
          sender:hotel_staff!staff_messages_sender_id_fkey (
            id,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ [useSendStaffMessage] Database error:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error details:", error.details);
        throw error;
      }

      console.log("✅ [useSendStaffMessage] Message inserted:", data);

      // Update conversation last_message_at
      console.log(
        "📧 [useSendStaffMessage] Updating conversation timestamp..."
      );
      const { error: updateError } = await supabase
        .from("staff_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (updateError) {
        console.warn(
          "⚠️ [useSendStaffMessage] Failed to update conversation timestamp:",
          updateError
        );
      } else {
        console.log("✅ [useSendStaffMessage] Conversation timestamp updated");
      }

      console.log("✅ [useSendStaffMessage] Message sent successfully!");
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ [useSendStaffMessage] onSuccess called");
      console.log(
        "📧 Invalidating queries for conversation:",
        data.conversation_id
      );

      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffMessages(data.conversation_id),
      });
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffConversations(user?.id || ""),
      });

      console.log("✅ [useSendStaffMessage] Queries invalidated");
    },
    onError: (error) => {
      console.error("❌ [useSendStaffMessage] onError called:", error);
    },
  });
}
