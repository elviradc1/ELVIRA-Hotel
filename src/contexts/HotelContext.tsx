import { createContext, type ReactNode } from "react";
import { useCurrentUserHotel } from "../hooks/useCurrentUserHotel";
import type { Tables } from "../services/supabase";

type Hotel = Tables<"hotels">;

interface HotelContextType {
  hotel: Hotel | null;
  hotelId: string | null;
  staffInfo: {
    staffId: string;
    employeeId: string;
    position: string;
    department: string;
    status: string;
    fullName: string;
    firstName: string;
    lastName: string;
  } | null;
  isLoading: boolean;
  error: Error | null;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export { HotelContext };

interface HotelProviderProps {
  children: ReactNode;
}

export function HotelProvider({ children }: HotelProviderProps) {
  console.log("🟢 HotelProvider: Initializing...");

  const { data: hotelInfo, isLoading, error } = useCurrentUserHotel();

  console.log("🟢 HotelProvider: Status:", {
    isLoading,
    hasHotelInfo: !!hotelInfo,
    hotelId: hotelInfo?.hotelId,
    error: error?.message,
  });

  const contextValue: HotelContextType = {
    hotel: (hotelInfo?.hotel as Hotel) || null,
    hotelId: hotelInfo?.hotelId || null,
    staffInfo: hotelInfo
      ? {
          staffId: hotelInfo.staffId,
          employeeId: hotelInfo.employeeId,
          position: hotelInfo.position,
          department: hotelInfo.department,
          status: hotelInfo.status,
          fullName: hotelInfo.fullName,
          firstName: hotelInfo.firstName,
          lastName: hotelInfo.lastName,
        }
      : null,
    isLoading,
    error,
  };

  console.log(
    "🟢 HotelProvider: Providing context with hotelId:",
    contextValue.hotelId
  );

  return (
    <HotelContext.Provider value={contextValue}>
      {children}
    </HotelContext.Provider>
  );
}
