import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useAuth } from "../../useAuth";

/**
 * Hook to fetch all staff conversations for current user
 */
export function useStaffConversations() {
  const { user } = useAuth();

  const result = useOptimizedQuery({
    queryKey: queryKeys.staffConversations(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) {
        console.log("❌ No user ID for staff conversations");
        return [];
      }

      // Get conversations where user is a participant
      const { data, error } = await supabase
        .from("staff_conversation_participants")
        .select(
          `
          conversation_id,
          staff_conversations (
            id,
            last_message_at,
            created_at
          )
        `
        )
        .eq("staff_id", user.id);

      if (error) {
        console.error("❌ Staff conversations query error:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
    config: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Conversations",
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "staff_conversation_participants",
    filter: user?.id ? `staff_id=eq.${user.id}` : undefined,
    queryKey: queryKeys.staffConversations(user?.id || ""),
    enabled: !!user?.id,
  });

  return result;
}

/**
 * Hook to get or create a conversation between two staff members
 */
export function useGetOrCreateStaffConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherStaffId: string) => {
      console.log("🔍 [useGetOrCreateStaffConversation] Starting...");
      console.log("🔍 Current user ID:", user?.id);
      console.log("🔍 Other staff ID:", otherStaffId);

      if (!user?.id) {
        console.error(
          "❌ [useGetOrCreateStaffConversation] No authenticated user"
        );
        throw new Error("No authenticated user");
      }

      console.log("🔍 Searching for existing conversation...");

      // Try RPC function first (if it exists)
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          "get_staff_conversation_between_users",
          {
            user1_id: user.id,
            user2_id: otherStaffId,
          }
        );

        console.log("🔍 RPC result:", { rpcResult, rpcError });

        if (!rpcError && rpcResult && rpcResult.length > 0) {
          console.log(
            "✅ [useGetOrCreateStaffConversation] Found existing conversation (RPC):",
            rpcResult[0].id
          );
          return rpcResult[0];
        }

        if (rpcError) {
          console.warn(
            "⚠️ [useGetOrCreateStaffConversation] RPC not available, using manual search"
          );
        }
      } catch (rpcException) {
        console.warn(
          "⚠️ [useGetOrCreateStaffConversation] RPC failed, using manual search:",
          rpcException
        );
      }

      // Manual fallback: Find conversation where both users are participants
      console.log("🔍 Manual search for existing conversation...");

      const { data: participants, error: participantsError } = await supabase
        .from("staff_conversation_participants")
        .select("conversation_id")
        .in("staff_id", [user.id, otherStaffId]);

      console.log("🔍 Participants found:", {
        participants,
        participantsError,
      });

      if (!participantsError && participants && participants.length > 0) {
        // Count conversations where both users participate
        const conversationCounts: Record<string, number> = {};
        participants.forEach((p) => {
          conversationCounts[p.conversation_id] =
            (conversationCounts[p.conversation_id] || 0) + 1;
        });

        console.log("🔍 Conversation counts:", conversationCounts);

        // Find conversation with exactly 2 participants (1-on-1)
        const sharedConversationId = Object.keys(conversationCounts).find(
          (id) => conversationCounts[id] === 2
        );

        if (sharedConversationId) {
          // Fetch full conversation details
          const { data: existingConversation, error: fetchError } =
            await supabase
              .from("staff_conversations")
              .select("*")
              .eq("id", sharedConversationId)
              .single();

          if (!fetchError && existingConversation) {
            console.log(
              "✅ [useGetOrCreateStaffConversation] Found existing conversation (manual):",
              existingConversation.id
            );
            return existingConversation;
          }
        }
      }

      // No existing conversation found - create new one
      console.log(
        "📝 [useGetOrCreateStaffConversation] Creating new conversation"
      );

      // Get hotel_id from current user's staff record
      const { data: userStaff, error: staffError } = await supabase
        .from("hotel_staff")
        .select("hotel_id")
        .eq("id", user.id)
        .single();

      if (staffError || !userStaff?.hotel_id) {
        console.error(
          "❌ [useGetOrCreateStaffConversation] Cannot get user's hotel_id:",
          staffError
        );
        throw new Error("Cannot determine hotel for conversation");
      }

      console.log("📝 Creating conversation for hotel:", userStaff.hotel_id);

      const { data: newConversation, error: createError } = await supabase
        .from("staff_conversations")
        .insert({
          hotel_id: userStaff.hotel_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (createError || !newConversation) {
        console.error(
          "❌ [useGetOrCreateStaffConversation] Error creating conversation:",
          createError
        );
        throw createError || new Error("Failed to create conversation");
      }

      console.log(
        "✅ [useGetOrCreateStaffConversation] Conversation created:",
        newConversation.id
      );

      // Add participants
      console.log(
        "📝 [useGetOrCreateStaffConversation] Adding participants..."
      );
      const { error: addParticipantsError } = await supabase
        .from("staff_conversation_participants")
        .insert([
          { conversation_id: newConversation.id, staff_id: user.id },
          { conversation_id: newConversation.id, staff_id: otherStaffId },
        ]);

      if (addParticipantsError) {
        console.error(
          "❌ [useGetOrCreateStaffConversation] Error adding participants:",
          addParticipantsError
        );
        // Clean up the conversation we just created
        await supabase
          .from("staff_conversations")
          .delete()
          .eq("id", newConversation.id);
        throw addParticipantsError;
      }

      console.log(
        "✅ [useGetOrCreateStaffConversation] Participants added successfully"
      );
      console.log(
        "✅ [useGetOrCreateStaffConversation] New conversation ready:",
        newConversation.id
      );

      return newConversation;
    },
    onSuccess: (data) => {
      console.log("✅ [useGetOrCreateStaffConversation] onSuccess:", data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffConversations(user?.id || ""),
      });
    },
    onError: (error) => {
      console.error("❌ [useGetOrCreateStaffConversation] onError:", error);
      if (error instanceof Error) {
        console.error("❌ Error stack:", error.stack);
      }
    },
  });
}
