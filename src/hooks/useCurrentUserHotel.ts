import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";

/**
 * Hook to get the current authenticated user's hotel information
 * Uses the hotel_staff table where id = authenticated user id
 */
export function useCurrentUserHotel() {
  const { user, loading: authLoading } = useAuth();

  console.log("🔵 useCurrentUserHotel: Hook called", {
    userId: user?.id,
    userRole: user?.role,
    authLoading,
  });

  return useQuery({
    queryKey: ["current-user-hotel", user?.id],
    queryFn: async () => {
      console.log(
        "🔵 useCurrentUserHotel: queryFn executing for user:",
        user?.id
      );

      if (!user?.id) {
        console.log("🔵 useCurrentUserHotel: No user ID, returning null");
        return null;
      }

      console.log("🔵 useCurrentUserHotel: Fetching staff record...");

      // First get the staff record to find the hotel_id and personal data
      const { data: staffRecord, error: staffError } = await supabase
        .from("hotel_staff")
        .select(
          `id, employee_id, position, department, status, hotel_id, 
          hotels (id, name, address, city, country, contact_email, phone_number, currency, description, latitude, longitude),
          hotel_staff_personal_data (first_name, last_name, email, phone_number)`
        )
        .eq("id", user.id)
        .single();

      console.log("🔵 useCurrentUserHotel: Query result:", {
        hasData: !!staffRecord,
        error: staffError,
        hotelId: staffRecord?.hotel_id,
      });

      if (staffError) {
        console.error(
          "🔴 useCurrentUserHotel: Error fetching user hotel:",
          staffError
        );
        throw staffError;
      }

      if (!staffRecord) {
        console.log("🔵 useCurrentUserHotel: No staff record found");
        return null;
      }

      console.log("🟢 useCurrentUserHotel: Successfully fetched hotel info");

      // Get personal data (might be array, so take first element)
      const personalData = Array.isArray(staffRecord.hotel_staff_personal_data)
        ? staffRecord.hotel_staff_personal_data[0]
        : staffRecord.hotel_staff_personal_data;

      return {
        // Staff information
        staffId: staffRecord.id,
        employeeId: staffRecord.employee_id,
        position: staffRecord.position,
        department: staffRecord.department,
        status: staffRecord.status,
        // Personal information
        firstName: personalData?.first_name || "",
        lastName: personalData?.last_name || "",
        fullName: personalData
          ? `${personalData.first_name} ${personalData.last_name}`
          : "",
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
