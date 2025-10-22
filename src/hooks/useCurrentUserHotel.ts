import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";

/**
 * Hook to get the current authenticated user's hotel information
 * Uses the hotel_staff table where id = authenticated user id
 */
export function useCurrentUserHotel() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["current-user-hotel", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get the staff record for the authenticated user
      // The id in hotel_staff = authenticated user id (profiles.id)
      const { data: staffRecord, error } = await supabase
        .from("hotel_staff")
        .select(
          `
          id,
          hotel_id,
          employee_id,
          position,
          department,
          status,
          hotels (
            id,
            name,
            address,
            city,
            country,
            contact_email,
            phone_number,
            currency,
            description
          )
        `
        )
        .eq("id", user.id)
        .eq("status", "active")
        .single();

      if (error) {
        console.error("Error fetching user hotel:", error);
        throw error;
      }

      if (!staffRecord) {
        return null;
      }

      return {
        // Staff information
        staffId: staffRecord.id,
        employeeId: staffRecord.employee_id,
        position: staffRecord.position,
        department: staffRecord.department,
        status: staffRecord.status,
        // Hotel information
        hotel: staffRecord.hotels,
        hotelId: staffRecord.hotel_id,
      };
    },
    enabled: !authLoading && !!user?.id && user?.role === "hotel",
    staleTime: 1000 * 60 * 10, // 10 minutes - hotel info doesn't change often
    refetchOnWindowFocus: false, // Don't refetch on window focus for this data
  });
}

/**
 * Hook to get just the hotel ID for the current user
 * Useful when you only need the hotel ID
 */
export function useCurrentUserHotelId() {
  const { data: hotelInfo, isLoading, error } = useCurrentUserHotel();

  return {
    hotelId: hotelInfo?.hotelId || null,
    isLoading,
    error,
  };
}
