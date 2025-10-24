import { useMemo, useState } from "react";
import {
  useApprovedThirdPartyPlaces,
  useHotelPlaces,
  useApproveHotelPlace,
  useRejectHotelPlace,
  useToggleHotelRecommended,
} from "../../../../../hooks/third-party-management";
import { useCurrentUserHotel } from "../../../../../hooks/useCurrentUserHotel";
import { filterPlacesByDistance } from "../../../../../utils/distance";

type Category = "gastronomy" | "tours" | "wellness";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  formatted_address?: string;
  vicinity?: string;
  hotel_approved?: boolean;
  hotel_recommended?: boolean;
}

interface UsePlacesTableOptions {
  category: Category;
  searchValue?: string;
}

/**
 * Custom hook to handle all the logic for places tables
 * Shared across gastronomy, tours, and wellness tabs
 */
export function usePlacesTable({
  category,
  searchValue = "",
}: UsePlacesTableOptions) {
  // Get current hotel with location
  const { data: hotelInfo } = useCurrentUserHotel();
  const hotelId = hotelInfo?.hotelId || null;

  // Distance filter state
  const [maxDistance, setMaxDistance] = useState(999999); // Default: any distance

  // Modal states
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Fetch Elvira-approved places
  const { data: places, isLoading } = useApprovedThirdPartyPlaces(category);

  // Fetch hotel's relationship with places
  const { data: hotelPlaces } = useHotelPlaces(hotelId || undefined, category);

  // Mutations for hotel actions
  const approvePlace = useApproveHotelPlace();
  const rejectPlace = useRejectHotelPlace();
  const toggleRecommended = useToggleHotelRecommended();

  // Create a map of place ID to hotel relationship status
  const hotelPlaceMap = useMemo(() => {
    const map = new Map();
    hotelPlaces?.forEach((hp: any) => {
      map.set(hp.thirdparty_place_id, {
        approved: hp.hotel_approved,
        recommended: hp.hotel_recommended,
      });
    });
    return map;
  }, [hotelPlaces]);

  // Filter places based on search and distance
  const filteredPlaces = useMemo(() => {
    if (!places) return [];

    let filtered = places;

    // Apply distance filter if hotel has location
    if (
      hotelInfo?.hotel?.latitude &&
      hotelInfo?.hotel?.longitude &&
      maxDistance !== 999999
    ) {
      filtered = filterPlacesByDistance(
        filtered,
        hotelInfo.hotel.latitude,
        hotelInfo.hotel.longitude,
        maxDistance
      );
    }

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((place) => {
        return (
          place.name.toLowerCase().includes(searchLower) ||
          place.formatted_address?.toLowerCase().includes(searchLower) ||
          place.vicinity?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [
    places,
    searchValue,
    hotelInfo?.hotel?.latitude,
    hotelInfo?.hotel?.longitude,
    maxDistance,
  ]);

  // Handlers
  const handleRowClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = async (placeId: string) => {
    if (!hotelId) return;
    await approvePlace.mutateAsync({
      hotelId,
      placeId,
    });
  };

  const handleReject = async (placeId: string) => {
    if (!hotelId) return;
    await rejectPlace.mutateAsync({
      hotelId,
      placeId,
    });
  };

  const handleToggleRecommended = async (placeId: string) => {
    if (!hotelId) return;
    const currentStatus = hotelPlaceMap.get(placeId);
    await toggleRecommended.mutateAsync({
      hotelId,
      placeId,
      recommended: !currentStatus?.recommended,
    });
  };

  return {
    // Data
    places: filteredPlaces,
    isLoading,
    hotelPlaceMap,
    hotelInfo,
    hotelId,

    // Filter state
    maxDistance,
    setMaxDistance,

    // Modal state
    selectedPlace,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isMapModalOpen,
    setIsMapModalOpen,

    // Handlers
    handleRowClick,
    handleApprove,
    handleReject,
    handleToggleRecommended,
  };
}
