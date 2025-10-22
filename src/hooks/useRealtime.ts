import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { queryKeys } from "../lib/react-query";

/**
 * Hook for real-time chat messages subscription
 */
export function useChatRealtime(conversationId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    console.log(
      "🔵 Setting up real-time subscription for conversation:",
      conversationId
    );

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guest_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("🟢 Real-time message update:", payload);

          // Invalidate conversation messages to refetch
          queryClient.invalidateQueries({
            queryKey: queryKeys.messages(conversationId),
          });

          // Update last message timestamp in conversations list
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations,
          });
        }
      )
      .subscribe();

    return () => {
      console.log(
        "🔴 Cleaning up real-time subscription for conversation:",
        conversationId
      );
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);
}

/**
 * Hook for real-time guest updates
 */
export function useGuestsRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for guests in hotel:",
      hotelId
    );

    const channel = supabase
      .channel(`guests:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time guest update:", payload);

          // Invalidate guests queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.guestsByHotel(hotelId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.guests,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for guests");
      supabase.removeChannel(channel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time staff updates
 */
export function useStaffRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for staff in hotel:",
      hotelId
    );

    // Subscribe to hotel_staff table changes
    const staffChannel = supabase
      .channel(`staff:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hotel_staff",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time staff update:", payload);

          // Invalidate staff queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.staffByHotel(hotelId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.staff,
          });
        }
      )
      .subscribe();

    // Subscribe to hotel_staff_personal_data table changes
    const personalDataChannel = supabase
      .channel(`staff-personal:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hotel_staff_personal_data",
        },
        (payload) => {
          console.log("🟢 Real-time staff personal data update:", payload);

          // Invalidate staff queries when personal data changes
          queryClient.invalidateQueries({
            queryKey: queryKeys.staffByHotel(hotelId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.staff,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for staff");
      supabase.removeChannel(staffChannel);
      supabase.removeChannel(personalDataChannel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time staff schedule updates
 */
export function useSchedulesRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for schedules in hotel:",
      hotelId
    );

    const channel = supabase
      .channel(`schedules:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "staff_schedules",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time schedule update:", payload);

          // Invalidate schedule queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.schedules,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for schedules");
      supabase.removeChannel(channel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time announcements
 */
export function useAnnouncementsRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for announcements in hotel:",
      hotelId
    );

    const channel = supabase
      .channel(`announcements:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time announcement update:", payload);

          // Invalidate announcements queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.announcementsByHotel(hotelId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.announcements,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for announcements");
      supabase.removeChannel(channel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time order updates (restaurant/shop)
 */
export function useOrdersRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for orders in hotel:",
      hotelId
    );

    // Subscribe to both dine-in orders and shop orders
    const dineInChannel = supabase
      .channel(`dine-in-orders:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dine_in_orders",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time dine-in order update:", payload);
          queryClient.invalidateQueries({
            queryKey: queryKeys.ordersByHotel(hotelId),
          });
        }
      )
      .subscribe();

    const shopChannel = supabase
      .channel(`shop-orders:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shop_orders",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟢 Real-time shop order update:", payload);
          queryClient.invalidateQueries({
            queryKey: queryKeys.ordersByHotel(hotelId),
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for orders");
      supabase.removeChannel(dineInChannel);
      supabase.removeChannel(shopChannel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time presence tracking
 */
export function usePresenceRealtime(roomId: string, userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId || !userId) return;

    console.log(
      "🔵 Setting up presence tracking for room:",
      roomId,
      "user:",
      userId
    );

    const channel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Track user presence
    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        console.log("🟢 Presence sync:", presenceState);
        // You can update UI to show who's online
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("🟢 User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("🔴 User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this user as present
          await channel.track({
            userId,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      console.log("🔴 Cleaning up presence tracking");
      supabase.removeChannel(channel);
    };
  }, [roomId, userId, queryClient]);
}

/**
 * Hook for real-time tasks
 */
export function useTasksRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for tasks in hotel:",
      hotelId
    );

    const channel = supabase
      .channel(`tasks:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟡 Tasks real-time update:", payload);

          // Invalidate and refetch tasks list
          queryClient.invalidateQueries({
            queryKey: queryKeys.tasksByHotel(hotelId),
          });

          // Also invalidate general tasks queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.tasks,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for tasks");
      supabase.removeChannel(channel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Hook for real-time absence requests subscription
 */
export function useAbsenceRequestsRealtime(hotelId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hotelId) return;

    console.log(
      "🔵 Setting up real-time subscription for absence requests in hotel:",
      hotelId
    );

    const channel = supabase
      .channel(`absence_requests:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "absence_requests",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          console.log("🟠 Absence requests real-time update:", payload);

          // Invalidate and refetch absence requests list
          queryClient.invalidateQueries({
            queryKey: queryKeys.absenceRequestsByHotel(hotelId),
          });

          // Also invalidate general absence requests queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.absenceRequests,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔴 Cleaning up real-time subscription for absence requests");
      supabase.removeChannel(channel);
    };
  }, [hotelId, queryClient]);
}

/**
 * Combined hook that sets up all real-time subscriptions for a hotel
 */
export function useHotelRealtime(hotelId?: string, userId?: string) {
  useGuestsRealtime(hotelId);
  useStaffRealtime(hotelId);
  useSchedulesRealtime(hotelId);
  useAnnouncementsRealtime(hotelId);
  useOrdersRealtime(hotelId);
  useTasksRealtime(hotelId);
  useAbsenceRequestsRealtime(hotelId);

  // Set up presence for the hotel dashboard
  usePresenceRealtime(`hotel:${hotelId}`, userId);
}
