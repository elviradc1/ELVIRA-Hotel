import { useMemo } from "react";
import { Table } from "../../../../../components/ui";
import {
  DistanceFilter,
  PlaceDetailsModal,
  MapViewModal,
} from "../../components";
import { usePlacesTable } from "../hooks/usePlacesTable";
import { createPlaceColumns } from "../utils/placeTableColumns";

type Category = "gastronomy" | "tours" | "wellness";

interface PlacesTableProps {
  category: Category;
  searchValue: string;
  title: string;
  description: string;
  emptyMessage?: string;
}

/**
 * Shared table component for displaying third-party places
 * Used by gastronomy, tours, and wellness tabs
 */
export function PlacesTable({
  category,
  searchValue,
  title,
  description,
  emptyMessage,
}: PlacesTableProps) {
  const {
    // Data
    places,
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
  } = usePlacesTable({ category, searchValue });

  // Create table columns
  const columns = useMemo(
    () =>
      createPlaceColumns({
        hotelPlaceMap,
        hotelId,
        onApprove: handleApprove,
        onReject: handleReject,
        onToggleRecommended: handleToggleRecommended,
      }),
    [
      hotelPlaceMap,
      hotelId,
      handleApprove,
      handleReject,
      handleToggleRecommended,
    ]
  );

  return (
    <div>
      {/* Header with Distance Filter */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Distance Filter */}
        {hotelInfo?.hotel?.latitude && hotelInfo?.hotel?.longitude && (
          <DistanceFilter
            value={maxDistance}
            onChange={setMaxDistance}
            onClear={() => setMaxDistance(999999)}
            onMapClick={() => setIsMapModalOpen(true)}
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
        data={places}
        loading={isLoading}
        emptyMessage={
          searchValue
            ? "No results found. Try a different search term."
            : emptyMessage || `No ${category} places available yet.`
        }
        itemsPerPage={10}
        onRowClick={handleRowClick}
      />

      {/* Details Modal */}
      <PlaceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        place={selectedPlace}
      />

      {/* Map View Modal */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        places={places}
        category={category}
      />
    </div>
  );
}
