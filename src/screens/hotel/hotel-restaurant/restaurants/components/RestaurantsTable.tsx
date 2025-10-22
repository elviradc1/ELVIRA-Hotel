import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useRestaurants } from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];

interface Restaurant extends Record<string, unknown> {
  id: string;
  restaurantStatus: string;
  name: string;
  cuisine: string;
  description: string;
}

interface RestaurantsTableProps {
  searchValue: string;
}

export function RestaurantsTable({ searchValue }: RestaurantsTableProps) {
  console.log("🍽️🍽️🍽️ RESTAURANTS TABLE COMPONENT LOADED 🍽️🍽️🍽️");

  const hotelId = useHotelId();

  console.log("🍽️ RestaurantsTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch restaurants using the hook
  const {
    data: restaurants,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useRestaurants(hotelId || undefined);

  useEffect(() => {
    console.log("🍽️ Restaurants - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: restaurants?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: restaurants,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, restaurants, dataUpdatedAt]);

  // Define table columns for restaurants
  const columns: TableColumn<Restaurant>[] = [
    {
      key: "restaurantStatus",
      label: "Restaurant Status",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "cuisine",
      label: "Cuisine",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const restaurantData: Restaurant[] = useMemo(() => {
    if (!restaurants) {
      console.log("🍽️ Restaurants - No data to transform");
      return [];
    }

    console.log("🍽️ Restaurants - Transforming data:", {
      rawCount: restaurants.length,
      searchValue,
    });

    const transformed = restaurants
      .filter((restaurant: RestaurantRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          restaurant.name.toLowerCase().includes(search) ||
          restaurant.cuisine.toLowerCase().includes(search) ||
          (restaurant.description &&
            restaurant.description.toLowerCase().includes(search))
        );
      })
      .map((restaurant: RestaurantRow) => ({
        id: restaurant.id,
        restaurantStatus: restaurant.is_active ? "Active" : "Inactive",
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        description: restaurant.description || "N/A",
      }));

    console.log("🍽️ Restaurants - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [restaurants, searchValue]);

  // Log any errors
  if (error) {
    console.error("🍽️ Restaurants - Error loading data:", error);
  }

  return (
    <div className="mt-6">
      {/* Always visible debug banner */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
        <div className="font-bold text-yellow-900 mb-2">🍽️ Debug Info:</div>
        <div className="text-yellow-800 space-y-1 text-xs">
          <div>Hotel ID: {hotelId || "Not found"}</div>
          <div>Loading: {isLoading ? "Yes" : "No"}</div>
          <div>Fetching: {isFetching ? "Yes" : "No"}</div>
          <div>Data Count: {restaurants?.length || 0}</div>
          <div>Filtered Count: {restaurantData.length}</div>
          <div>Error: {error?.message || "None"}</div>
        </div>
      </div>

      {/* Debug info */}
      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⏳ {isLoading ? "Loading" : "Refetching"} restaurants...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Error: {error.message}
        </div>
      )}

      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {restaurantData.length}{" "}
          result(s)
        </p>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={restaurantData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No restaurants found matching "${searchValue}".`
              : "No restaurants found. Add new restaurants to get started."
          }
        />
      </div>
    </div>
  );
}
