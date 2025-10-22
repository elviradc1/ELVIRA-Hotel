import { useMemo, useState } from "react";
import { Table } from "../../../../components/ui";
import {
  useApprovedThirdPartyPlaces,
  useHotelPlaces,
  useApproveHotelPlace,
  useRejectHotelPlace,
  useToggleHotelRecommended,
} from "../../../../hooks/third-party-management";
import { useCurrentUserHotel } from "../../../../hooks/useCurrentUserHotel";
import { DistanceFilter, PlaceDetailsModal } from "../components";
import { filterPlacesByDistance } from "../../../../utils/distance";
import type { TableColumn } from "../../../../components/ui/tables/types";

interface GastronomyProps {
  searchValue: string;
}

export function Gastronomy({ searchValue }: GastronomyProps) {
  // Get current hotel with location
  const { data: hotelInfo } = useCurrentUserHotel();
  const hotelId = hotelInfo?.hotelId || null;

  // Distance filter state
  const [maxDistance, setMaxDistance] = useState(999999); // Default: any distance

  // Modal state
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Elvira-approved places
  const { data: places, isLoading } = useApprovedThirdPartyPlaces("gastronomy");

  // Fetch hotel's relationship with places
  const { data: hotelPlaces } = useHotelPlaces(hotelId, "gastronomy");

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

  // Handle row click
  const handleRowClick = (place: any) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  // Define table columns - using the correct render signature (value, item)
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (_value: unknown, place: any) => (
          <div>
            <div className="font-medium text-gray-900">
              {place.name || "Unknown"}
            </div>
            {place.types &&
              Array.isArray(place.types) &&
              place.types.length > 0 && (
                <div className="text-xs text-gray-500">
                  {place.types.slice(0, 2).join(", ")}
                </div>
              )}
          </div>
        ),
      },
      {
        key: "formatted_address",
        label: "Address",
        render: (_value: unknown, place: any) => (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {place.formatted_address || place.vicinity || "-"}
          </div>
        ),
      },
      {
        key: "rating",
        label: "Rating",
        sortable: true,
        render: (_value: unknown, place: any) =>
          place.rating ? (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{place.rating}</span>
              {place.user_ratings_total && (
                <span className="text-xs text-gray-500 ml-1">
                  ({place.user_ratings_total})
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          ),
      },
      {
        key: "price_level",
        label: "Price Level",
        render: (_value: unknown, place: any) =>
          place.price_level ? (
            <span className="text-sm">{"$".repeat(place.price_level)}</span>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          ),
      },
      {
        key: "business_status",
        label: "Status",
        render: (_value: unknown, place: any) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              place.business_status === "OPERATIONAL"
                ? "bg-green-100 text-green-800"
                : place.business_status === "CLOSED_TEMPORARILY"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {place.business_status || "Unknown"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (_value: unknown, place: any) => {
          const hotelStatus = hotelPlaceMap.get(place.id);
          const isApproved = hotelStatus?.approved || false;
          const isRecommended = hotelStatus?.recommended || false;

          return (
            <div className="flex items-center gap-3 justify-end">
              {/* Approve/Reject Button */}
              {!isApproved ? (
                <button
                  onClick={() => {
                    if (hotelId) {
                      approvePlace.mutate({ hotelId, placeId: place.id });
                    }
                  }}
                  disabled={approvePlace.isPending}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium disabled:opacity-50"
                >
                  ✓ Approve
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (hotelId) {
                      rejectPlace.mutate({ hotelId, placeId: place.id });
                    }
                  }}
                  disabled={rejectPlace.isPending}
                  className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                >
                  ✗ Reject
                </button>
              )}

              {/* Recommend Star */}
              {isApproved && (
                <button
                  onClick={() => {
                    if (hotelId) {
                      toggleRecommended.mutate({
                        hotelId,
                        placeId: place.id,
                        recommended: !isRecommended,
                      });
                    }
                  }}
                  disabled={toggleRecommended.isPending}
                  className={`text-xl transition-colors disabled:opacity-50 ${
                    isRecommended
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  title={
                    isRecommended
                      ? "Remove recommendation"
                      : "Recommend to guests"
                  }
                >
                  ★
                </button>
              )}

              {/* View on Google Maps */}
              {place.google_maps_url && (
                <button
                  onClick={() => window.open(place.google_maps_url, "_blank")}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  View
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [hotelPlaceMap, hotelId, approvePlace, rejectPlace, toggleRecommended]
  );

  return (
    <div className="p-6">
      {/* Header with Distance Filter */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Gastronomy Partners
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Restaurants, cafes, and food establishments from Google Places
          </p>
        </div>

        {/* Distance Filter */}
        {hotelInfo?.hotel?.latitude && hotelInfo?.hotel?.longitude && (
          <DistanceFilter
            value={maxDistance}
            onChange={setMaxDistance}
            onClear={() => setMaxDistance(999999)}
          />
        )}
      </div>

      {/* Search Info */}
      {searchValue && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for:{" "}
          <span className="font-medium">"{searchValue}"</span>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPlaces}
        loading={isLoading}
        emptyMessage={
          searchValue
            ? "No results found. Try a different search term."
            : "No gastronomy places available yet."
        }
        pagination={{
          pageSize: 10,
          showPageSize: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        onRowClick={handleRowClick}
      />

      {/* Details Modal */}
      <PlaceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        place={selectedPlace}
      />
    </div>
  );
}
