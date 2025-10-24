import { useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import {
  useShopOrders,
  type ShopOrderWithDetails,
} from "../../../../../hooks/hotel-shop/shop-orders/useShopOrders";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import { ShopOrderModal } from "./shop-order-modal";

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
  const hotelId = useHotelId();
  const [selectedOrder, setSelectedOrder] =
    useState<ShopOrderWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch shop orders using the hook
  const {
    data: shopOrders,
    isLoading,
    error,
  } = useShopOrders(hotelId || undefined);

  // Handle row click to open details modal
  const handleRowClick = (row: ShopOrder) => {
    const fullOrder = shopOrders?.find((order) => order.id === row.id);
    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setIsDetailModalOpen(true);
    }
  };

  // Close detail modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

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
      return [];
    }

    return shopOrders
      .filter((order: ShopOrderWithDetails) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        const guestName = order.guests?.guest_name?.toLowerCase() || "";
        const roomNumber = order.guests?.room_number?.toLowerCase() || "";

        return (
          order.id.toLowerCase().includes(search) ||
          order.status.toLowerCase().includes(search) ||
          guestName.includes(search) ||
          roomNumber.includes(search)
        );
      })
      .map((order: ShopOrderWithDetails) => ({
        id: order.id,
        orderId: order.id.substring(0, 8).toUpperCase(),
        items: "View items",
        guest: order.guests?.guest_name || "N/A",
        room: order.guests?.room_number || "N/A",
        status: order.status,
        createdAt: order.created_at
          ? new Date(order.created_at).toLocaleString()
          : "N/A",
      }));
  }, [shopOrders, searchValue]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading shop orders: {error.message}
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

      {/* Shop Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={orderData}
          loading={isLoading}
          emptyMessage="No shop orders found. Orders will appear here once guests start purchasing items."
          onRowClick={handleRowClick}
          itemsPerPage={10}
        />
      </div>

      {/* Order Detail Modal */}
      <ShopOrderModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
}
