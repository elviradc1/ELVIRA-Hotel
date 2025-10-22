import { useMemo } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import {
  useDineInOrders,
  type DineInOrderWithDetails,
} from "../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import { usePagination } from "../../../../../hooks";

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
  const hotelId = useHotelId();

  // Fetch dine-in orders using the hook
  const {
    data: dineInOrders,
    isLoading,
    error,
  } = useDineInOrders(hotelId || undefined);

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
      return [];
    }

    return dineInOrders
      .filter((order: DineInOrderWithDetails) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        const guestName = order.guests?.guest_name?.toLowerCase() || "";
        const roomNumber = order.guests?.room_number?.toLowerCase() || "";
        const restaurantName = order.restaurants?.name?.toLowerCase() || "";

        return (
          order.id.toLowerCase().includes(search) ||
          order.status.toLowerCase().includes(search) ||
          order.order_type.toLowerCase().includes(search) ||
          guestName.includes(search) ||
          roomNumber.includes(search) ||
          restaurantName.includes(search)
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
  }, [dineInOrders, searchValue]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<RestaurantOrder>({ data: orderData, itemsPerPage: 10 });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading restaurant orders: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Restaurant Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage="No restaurant orders found. Orders will appear here once guests place orders."
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={orderData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
