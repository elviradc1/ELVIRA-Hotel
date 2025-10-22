import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useAmenities } from "../../../../../hooks/amenities/amenities/useAmenities";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface Amenity extends Record<string, unknown> {
  id: string;
  status: string;
  amenity: string;
  category: string;
  price: string;
}

interface AmenitiesTableProps {
  searchValue: string;
}

export function AmenitiesTable({ searchValue }: AmenitiesTableProps) {
  console.log("🏊🏊🏊 AMENITIES TABLE COMPONENT LOADED 🏊🏊🏊");

  const hotelId = useHotelId();

  console.log("🏊 AmenitiesTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch amenities using the hook
  const {
    data: amenities,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useAmenities(hotelId || undefined);

  useEffect(() => {
    console.log("🏊 Amenities - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: amenities?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: amenities,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, amenities, dataUpdatedAt]);

  // Define table columns for amenities
  const amenityColumns: TableColumn<Amenity>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "amenity",
      label: "Amenity",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const amenityData: Amenity[] = useMemo(() => {
    if (!amenities) {
      console.log("🏊 Amenities - No data to transform");
      return [];
    }

    console.log("🏊 Amenities - Transforming data:", {
      rawCount: amenities.length,
      searchValue,
    });

    const transformed = amenities
      .filter((amenity: AmenityRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          amenity.name.toLowerCase().includes(search) ||
          amenity.category.toLowerCase().includes(search) ||
          (amenity.description &&
            amenity.description.toLowerCase().includes(search))
        );
      })
      .map((amenity: AmenityRow) => ({
        id: amenity.id,
        status: amenity.is_active ? "Active" : "Inactive",
        amenity: amenity.name,
        category: amenity.category,
        price: `$${amenity.price.toFixed(2)}`,
      }));

    console.log("🏊 Amenities - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [amenities, searchValue]);

  // Log any errors
  if (error) {
    console.error("🏊 Amenities - Error loading data:", error);
  }

  return (
    <div className="mt-6">
      {/* Always visible debug banner */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
        <div className="font-bold text-yellow-900 mb-2">🏊 Debug Info:</div>
        <div className="text-yellow-800 space-y-1 text-xs">
          <div>Hotel ID: {hotelId || "Not found"}</div>
          <div>Loading: {isLoading ? "Yes" : "No"}</div>
          <div>Fetching: {isFetching ? "Yes" : "No"}</div>
          <div>Data Count: {amenities?.length || 0}</div>
          <div>Filtered Count: {amenityData.length}</div>
          <div>Error: {error?.message || "None"}</div>
        </div>
      </div>

      {/* Debug info */}
      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⏳ {isLoading ? "Loading" : "Refetching"} amenities...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Error: {error.message}
        </div>
      )}

      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {amenityData.length} result(s)
        </p>
      )}

      {/* Amenities Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={amenityColumns}
          data={amenityData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No amenities found matching "${searchValue}".`
              : "No amenities found. Add new amenities to get started."
          }
        />
      </div>
    </div>
  );
}
