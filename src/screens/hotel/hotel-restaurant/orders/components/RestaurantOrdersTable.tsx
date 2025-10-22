import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import {
  useDineInOrders,
  type DineInOrderWithDetails,
} from "../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";
import { useHotelId } from "../../../../../hooks/useHotelContext";

interface RestaurantOrder extends Record<string, unknown> {
  id: string;
  orderId: string;
  type: string;
  items: string;
  guest: string;
  room: string;
  status: string;
  created: string;
}

interface RestaurantOrdersTableProps {
  searchValue: string;
}

export function RestaurantOrdersTable({
  searchValue,
}: RestaurantOrdersTableProps) {
  console.log("🍽️🍽️🍽️ RESTAURANT ORDERS TABLE COMPONENT LOADED 🍽️🍽️🍽️");

  const hotelId = useHotelId();

  console.log("🍽️ RestaurantOrdersTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch dine-in orders using the hook
  const {
    data: dineInOrders,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useDineInOrders(hotelId || undefined);

  useEffect(() => {
    console.log("🍽️ DineInOrders - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: dineInOrders?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: dineInOrders,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, dineInOrders, dataUpdatedAt]);
  useEffect(() => {
    console.log("🍽️ DineInOrders - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: dineInOrders?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: dineInOrders,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, dineInOrders, dataUpdatedAt]);

  // Define table columns for restaurant orders
  const columns: TableColumn<RestaurantOrder>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "items",
      label: "Items",
      sortable: true,
    },
    {
      key: "guest",
      label: "Guest",
      sortable: true,
    },
    {
      key: "room",
      label: "Room",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const orderData: RestaurantOrder[] = useMemo(() => {
    if (!dineInOrders) {
      console.log("🍽️ DineInOrders - No data to transform");
      return [];
    }

    console.log("🍽️ DineInOrders - Transforming data:", {
      rawCount: dineInOrders.length,
      searchValue,
    });

    const transformed = dineInOrders
      .filter((order: DineInOrderWithDetails) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          order.id.toLowerCase().includes(search) ||
          order.status.toLowerCase().includes(search) ||
          order.order_type.toLowerCase().includes(search) ||
          order.guests?.guest_name.toLowerCase().includes(search) ||
          order.guests?.room_number.toLowerCase().includes(search) ||
          order.restaurants?.name.toLowerCase().includes(search)
        );
      })
      .map((order: DineInOrderWithDetails) => {
        // Count total items
        const itemCount = order.dine_in_order_items?.length || 0;
        const itemsText = itemCount === 1 ? "1 item" : `${itemCount} items`;

        return {
          id: order.id,
          orderId: order.id.substring(0, 8).toUpperCase(),
          type: order.order_type,
          items: itemsText,
          guest: order.guests?.guest_name || "Unknown Guest",
          room: order.guests?.room_number || "N/A",
          status: order.status,
          created: order.created_at
            ? new Date(order.created_at).toLocaleString()
            : "N/A",
        };
      });

    console.log("🍽️ DineInOrders - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [dineInOrders, searchValue]);

  // Debug banner (always visible)
  const debugInfo = (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        backgroundColor: "#fef3c7",
        border: "2px solid #f59e0b",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "13px",
      }}
    >
      <div
        style={{ fontWeight: "bold", marginBottom: "8px", color: "#92400e" }}
      >
        🍽️ RESTAURANT ORDERS DEBUG INFO
      </div>
      <div style={{ color: "#78350f" }}>
        <div>
          <strong>Hotel ID:</strong> {hotelId || "Not set"}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Fetching:</strong> {isFetching ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error?.message || "None"}
        </div>
        <div>
          <strong>Raw Orders Count:</strong> {dineInOrders?.length || 0}
        </div>
        <div>
          <strong>Filtered Orders Count:</strong> {orderData.length}
        </div>
        <div>
          <strong>Search Value:</strong> "{searchValue}"
        </div>
        <div>
          <strong>Last Updated:</strong>{" "}
          {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "Never"}
        </div>
      </div>
    </div>
  );

  if (error) {
    console.error("🍽️ DineInOrders - Error loading orders:", error);
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            color: "#991b1b",
          }}
        >
          <strong>Error loading restaurant orders:</strong> {error.message}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#dbeafe",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            color: "#1e40af",
            textAlign: "center",
          }}
        >
          Loading restaurant orders...
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#dbeafe",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            color: "#1e40af",
            textAlign: "center",
          }}
        >
          Loading restaurant orders...
        </div>
      </>
    );
  }

  return (
    <div className="mt-6">
      {debugInfo}

      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Restaurant Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={orderData}
          isLoading={isLoading}
          emptyMessage="No restaurant orders found. Orders will appear here once guests place orders."
        />
      </div>
    </div>
  );
}
