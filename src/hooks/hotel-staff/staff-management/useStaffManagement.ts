import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";

/**
 * Hook to fetch staff members for a specific hotel
 * Includes real-time updates and performance optimization
 */
export function useStaffManagement(hotelId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.staffByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) {
        console.log("❌ No hotel ID provided to useStaffManagement");
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

      if (error) {
        console.error("❌ Staff query error:", error);
        throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: Infinity, // Staff data rarely changes
      gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,
    },
    logPrefix: "Staff Management",
  });

  // Real-time subscription for staff changes
  useRealtimeSubscription({
    table: "hotel_staff",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.staffByHotel(hotelId || ""),
    enabled: !!hotelId,
  });

  return result;
}

/**
 * Auto-hotel ID hook for current user's staff
 */
export function useCurrentHotelStaff() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();

  console.log("🏨 useCurrentHotelStaff Debug:", {
    hotelId,
    hotelIdLoading,
    enabled: !!hotelId,
    timestamp: new Date().toISOString(),
  });

  return useStaffManagement(hotelId || undefined);
}
