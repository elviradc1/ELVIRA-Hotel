import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useShopOrders } from "../../../../../hooks/hotel-shop/shop-orders/useShopOrders";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type ShopOrderRow = Database["public"]["Tables"]["shop_orders"]["Row"];

interface ShopOrder extends Record<string, unknown> {
  id: string;
  orderId: string;
  items: string;
  guest: string;
  room: string;
  status: string;
  createdAt: string;
}

interface ShopOrdersTableProps {
  searchValue: string;
}

export function ShopOrdersTable({ searchValue }: ShopOrdersTableProps) {
  console.log("🛍️🛍️🛍️ SHOP ORDERS TABLE COMPONENT LOADED 🛍️🛍️🛍️");

  const hotelId = useHotelId();

  console.log("🛍️ ShopOrdersTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch shop orders using the hook
  const {
    data: shopOrders,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useShopOrders(hotelId || undefined);

  useEffect(() => {
    console.log("🛍️ ShopOrders - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: shopOrders?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: shopOrders,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, shopOrders, dataUpdatedAt]);

  // Define table columns for shop orders
  const columns: TableColumn<ShopOrder>[] = [
    {
      key: "orderId",
      label: "Order ID",
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
      key: "createdAt",
      label: "Created At",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const orderData: ShopOrder[] = useMemo(() => {
    if (!shopOrders) {
      console.log("🛍️ ShopOrders - No data to transform");
      return [];
    }

    console.log("🛍️ ShopOrders - Transforming data:", {
      rawCount: shopOrders.length,
      searchValue,
    });

    const transformed = shopOrders
      .filter((order: ShopOrderRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          order.id.toLowerCase().includes(search) ||
          order.status.toLowerCase().includes(search)
        );
      })
      .map((order: ShopOrderRow) => ({
        id: order.id,
        orderId: order.id.substring(0, 8).toUpperCase(),
        items: "View items", // Items are in a separate table (shop_order_items)
        guest: "Guest info", // Would need to join with guests table
        room: "N/A", // Would need to join with guests table
        status: order.status,
        createdAt: order.created_at
          ? new Date(order.created_at).toLocaleString()
          : "N/A",
      }));

    console.log("🛍️ ShopOrders - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [shopOrders, searchValue]);

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
        🛍️ SHOP ORDERS DEBUG INFO
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
          <strong>Raw Orders Count:</strong> {shopOrders?.length || 0}
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
    console.error("🛍️ ShopOrders - Error loading orders:", error);
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
          <strong>Error loading shop orders:</strong> {error.message}
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
          Loading shop orders...
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

      {/* Shop Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={orderData}
          isLoading={isLoading}
          emptyMessage="No shop orders found. Orders will appear here once guests start purchasing items."
        />
      </div>
    </div>
  );
}
