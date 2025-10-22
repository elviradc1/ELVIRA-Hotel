import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type Inserts } from "../services/supabase";
import { queryKeys } from "../lib/react-query";
import { useCurrentUserHotelId } from "./useCurrentUserHotel";
import { useAuth } from "./useAuth";

// Auto-hotel ID hooks - these automatically get the hotel ID from current user
export function useCurrentHotelGuests() {
  const { hotelId } = useCurrentUserHotelId();
  return useGuests(hotelId || undefined);
}

export function useCurrentHotelAnnouncements() {
  const { hotelId } = useCurrentUserHotelId();
  return useAnnouncements(hotelId || undefined);
}

export function useCurrentHotelOrders() {
  const { hotelId } = useCurrentUserHotelId();
  return useOrders(hotelId || undefined);
}

export function useCurrentHotelConversations() {
  const { hotelId } = useCurrentUserHotelId();
  return useConversations(hotelId || undefined);
}

export function useCurrentHotelStaff() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();

  console.log("🏨 useCurrentHotelStaff Debug:", {
    hotelId,
    hotelIdLoading,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  return useStaff(hotelId || undefined);
}

// Original hooks that accept hotel ID parameter
export function useGuests(hotelId?: string) {
  return useQuery({
    queryKey: queryKeys.guestsByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guest: Inserts<"guests">) => {
      const { data, error } = await supabase
        .from("guests")
        .insert(guest)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate guests list
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestsByHotel(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.guests,
      });
    },
  });
}

// Staff API Hooks
export function useStaff(hotelId?: string) {
  const startTime = performance.now();

  console.log("👥 useStaff Hook Called:", {
    hotelId,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  const result = useQuery({
    queryKey: queryKeys.staffByHotel(hotelId || ""),
    queryFn: async () => {
      const fetchStartTime = performance.now();
      console.log("🔄 Staff queryFn STARTED - Fetching from database:", {
        hotelId,
        timestamp: new Date().toISOString(),
      });

      if (!hotelId) {
        console.log("❌ No hotel ID provided to useStaff");
        return [];
      }

      const { data, error } = await supabase
        .from("hotel_staff")
        .select(
          `
          *,
          hotel_staff_personal_data (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      const fetchEndTime = performance.now();
      console.log("✅ Staff queryFn COMPLETED:", {
        hotelId,
        dataLength: data?.length || 0,
        error: error?.message,
        fetchDuration: `${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Staff query error:", error);
        throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    staleTime: Infinity, // Staff data rarely changes, keep it fresh indefinitely
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const endTime = performance.now();
  console.log("📊 useStaff Hook Result:", {
    hotelId,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    dataStatus: result.data ? `${result.data.length} records` : "no data",
    fetchStatus: result.fetchStatus,
    status: result.status,
    isCached: !result.isFetching && !!result.data,
    hookDuration: `${(endTime - startTime).toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
  });

  return result;
}

// Schedule API Hooks
export function useSchedules(hotelId?: string, date?: string) {
  return useQuery({
    queryKey: date ? queryKeys.schedulesByDate(date) : queryKeys.schedules,
    queryFn: async () => {
      if (!hotelId) return [];

      let query = supabase
        .from("staff_schedules")
        .select(
          `
          *,
          hotel_staff!inner (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("hotel_id", hotelId);

      if (date) {
        query = query
          .gte("schedule_start_date", date)
          .lte("schedule_finish_date", date);
      }

      const { data, error } = await query.order("schedule_start_date", {
        ascending: true,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
  });
}

// Chat/Messages API Hooks
export function useConversations(hotelId?: string) {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("guest_conversation")
        .select(
          `
          *,
          guests (
            guest_name,
            room_number
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("guest_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
    }: {
      conversationId: string;
      message: Inserts<"guest_messages">;
    }) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ conversationId, message }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages(conversationId),
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        queryKeys.messages(conversationId)
      );

      // Optimistically update cache
      queryClient.setQueryData(
        queryKeys.messages(conversationId),
        (old: unknown) => {
          const messages = (old as Record<string, unknown>[]) || [];
          return [
            ...messages,
            {
              ...message,
              id: "temp-" + Date.now(),
              created_at: new Date().toISOString(),
            },
          ];
        }
      );

      return { previousMessages, conversationId };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          queryKeys.messages(context.conversationId),
          context.previousMessages
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

// Announcements API Hooks
export function useAnnouncements(hotelId?: string) {
  return useQuery({
    queryKey: queryKeys.announcementsByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: Inserts<"announcements">) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert(announcement)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcementsByHotel(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements,
      });
    },
  });
}

// Orders API Hooks
export function useOrders(hotelId?: string) {
  return useQuery({
    queryKey: queryKeys.ordersByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) return { dineInOrders: [], shopOrders: [] };

      // Fetch both types of orders in parallel
      const [dineInResult, shopResult] = await Promise.all([
        supabase
          .from("dine_in_orders")
          .select(
            `
            *,
            guests (
              guest_name,
              room_number
            ),
            dine_in_order_items (
              *,
              menu_items (name, price)
            )
          `
          )
          .eq("hotel_id", hotelId)
          .order("created_at", { ascending: false }),

        supabase
          .from("shop_orders")
          .select(
            `
            *,
            guests (
              guest_name,
              room_number
            ),
            shop_order_items (
              *,
              products (name, price)
            )
          `
          )
          .eq("hotel_id", hotelId)
          .order("created_at", { ascending: false }),
      ]);

      if (dineInResult.error) throw dineInResult.error;
      if (shopResult.error) throw shopResult.error;

      return {
        dineInOrders: dineInResult.data || [],
        shopOrders: shopResult.data || [],
      };
    },
    enabled: !!hotelId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      type,
    }: {
      orderId: string;
      status: string;
      type: "dine_in" | "shop";
      hotelId: string;
    }) => {
      const table = type === "dine_in" ? "dine_in_orders" : "shop_orders";

      const { data, error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate orders list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersByHotel(variables.hotelId),
      });
    },
  });
}

// Task API Hooks
export function useTasks(hotelId?: string) {
  const startTime = performance.now();

  console.log("📋 useTasks Hook Called:", {
    hotelId,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  const result = useQuery({
    queryKey: queryKeys.tasksByHotel(hotelId || ""),
    queryFn: async () => {
      const fetchStartTime = performance.now();
      console.log("🔄 Tasks queryFn STARTED - Fetching from database:", {
        hotelId,
        timestamp: new Date().toISOString(),
      });

      if (!hotelId) {
        console.log("❌ No hotel ID provided to useTasks");
        return [];
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      const fetchEndTime = performance.now();
      console.log("✅ Tasks queryFn COMPLETED:", {
        hotelId,
        dataLength: data?.length || 0,
        error: error?.message,
        fetchDuration: `${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Tasks query error:", error);
        throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    staleTime: 1000 * 60 * 2, // Keep tasks fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  const endTime = performance.now();
  console.log("📊 useTasks Hook Result:", {
    hotelId,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    dataStatus: result.data ? `${result.data.length} records` : "no data",
    fetchStatus: result.fetchStatus,
    status: result.status,
    isCached: !result.isFetching && !!result.data,
    hookDuration: `${(endTime - startTime).toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
  });

  return result;
}

export function useCurrentHotelTasks() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();

  console.log("🏨 useCurrentHotelTasks Debug:", {
    hotelId,
    hotelIdLoading,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  return useTasks(hotelId || undefined);
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      type?: string;
      priority: "Low" | "Medium" | "High";
      staff_id?: string;
      due_date?: string;
      due_time?: string;
    }) => {
      console.log("📝 Creating task:", taskData);

      if (!hotelId) {
        throw new Error("No hotel ID available");
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          hotel_id: hotelId,
          created_by: user?.id,
          status: "PENDING",
        })
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Create task error:", error);
        throw error;
      }

      console.log("✅ Task created successfully:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate tasks list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<{
        title: string;
        description: string;
        type: string;
        priority: "Low" | "Medium" | "High";
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
        staff_id: string;
        due_date: string;
        due_time: string;
      }>;
    }) => {
      console.log("📝 Updating task:", taskId, updates);

      const { data, error } = await supabase
        .from("tasks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Update task error:", error);
        throw error;
      }

      console.log("✅ Task updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate tasks list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (taskId: string) => {
      console.log("🗑️ Deleting task:", taskId);

      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        console.error("❌ Delete task error:", error);
        throw error;
      }

      console.log("✅ Task deleted successfully");
      return taskId;
    },
    onSuccess: () => {
      // Invalidate tasks list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}

// ==================== ABSENCE REQUESTS HOOKS ====================

// Auto-hotel ID hook for absence requests
export function useCurrentHotelAbsenceRequests() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();

  console.log("🏨 useCurrentHotelAbsenceRequests Debug:", {
    hotelId,
    hotelIdLoading,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  return useAbsenceRequests(hotelId || undefined);
}

// Base absence requests hook
export function useAbsenceRequests(hotelId?: string) {
  const startTime = performance.now();

  console.log("🗓️ useAbsenceRequests Hook Called:", {
    hotelId,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  const result = useQuery({
    queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
    queryFn: async () => {
      const fetchStartTime = performance.now();
      console.log(
        "� Absence Requests queryFn STARTED - Fetching from database:",
        {
          hotelId,
          timestamp: new Date().toISOString(),
        }
      );

      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("absence_requests")
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,
          data_processing_consent,
          consent_date,
          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      const fetchEndTime = performance.now();
      console.log("✅ Absence Requests queryFn COMPLETED:", {
        hotelId,
        dataLength: data?.length || 0,
        error: error?.message,
        fetchDuration: `${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Fetch absence requests error:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!hotelId,
    staleTime: 1000 * 60 * 2, // Keep fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  const endTime = performance.now();
  console.log("📊 useAbsenceRequests Hook Result:", {
    hotelId,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    dataStatus: result.data ? `${result.data.length} records` : "no data",
    fetchStatus: result.fetchStatus,
    status: result.status,
    isCached: !result.isFetching && !!result.data,
    hookDuration: `${(endTime - startTime).toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
  });

  return result;
}

// Create absence request
export function useCreateAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (
      request: Omit<Inserts<"absence_requests">, "hotel_id">
    ) => {
      if (!hotelId) throw new Error("Hotel ID is required");

      console.log("➕ Creating absence request:", request);

      const { data, error } = await supabase
        .from("absence_requests")
        .insert({
          ...request,
          hotel_id: hotelId,
        })
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,
          data_processing_consent,
          consent_date,
          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Create absence request error:", error);
        throw error;
      }

      console.log("✅ Absence request created successfully:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate absence requests list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}

// Update absence request
export function useUpdateAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async ({
      requestId,
      updates,
    }: {
      requestId: string;
      updates: Partial<Inserts<"absence_requests">>;
    }) => {
      console.log("📝 Updating absence request:", requestId, updates);

      const { data, error } = await supabase
        .from("absence_requests")
        .update(updates)
        .eq("id", requestId)
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,
          data_processing_consent,
          consent_date,
          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Update absence request error:", error);
        throw error;
      }

      console.log("✅ Absence request updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate absence requests list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}

// Delete absence request
export function useDeleteAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (requestId: string) => {
      console.log("🗑️ Deleting absence request:", requestId);

      const { error } = await supabase
        .from("absence_requests")
        .delete()
        .eq("id", requestId);

      if (error) {
        console.error("❌ Delete absence request error:", error);
        throw error;
      }

      console.log("✅ Absence request deleted successfully");
      return requestId;
    },
    onSuccess: () => {
      // Invalidate absence requests list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}
