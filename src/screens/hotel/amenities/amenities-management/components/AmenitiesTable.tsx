import { useMemo } from "react";
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
  const hotelId = useHotelId();

  // Fetch amenities using the hook
  const {
    data: amenities,
    isLoading,
    error,
  } = useAmenities(hotelId || undefined);

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
      return [];
    }

    return amenities
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
  }, [amenities, searchValue]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading amenities: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
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
