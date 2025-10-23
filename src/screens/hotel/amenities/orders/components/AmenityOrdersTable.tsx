import { useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import {
  useAmenityRequests,
  type AmenityRequestWithDetails,
} from "../../../../../hooks/amenities/amenity-requests/useAmenityRequests";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import { AmenityRequestModal } from "./amenity-request-modal";

interface AmenityOrder extends Record<string, unknown> {
  id: string;
  requestId: string;
  amenity: string;
  guest: string;
  room: string;
  status: string;
  created: string;
}

interface AmenityOrdersTableProps {
  searchValue: string;
}

export function AmenityOrdersTable({ searchValue }: AmenityOrdersTableProps) {
  const hotelId = useHotelId();
  const [selectedRequest, setSelectedRequest] =
    useState<AmenityRequestWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch amenity requests using the hook
  const {
    data: amenityRequests,
    isLoading,
    error,
  } = useAmenityRequests(hotelId || undefined);

  // Handle row click to open details modal
  const handleRowClick = (row: AmenityOrder) => {
    const fullRequest = amenityRequests?.find(
      (request) => request.id === row.id
    );
    if (fullRequest) {
      setSelectedRequest(fullRequest);
      setIsDetailModalOpen(true);
    }
  };

  // Close detail modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // Define table columns for amenity orders
  const orderColumns: TableColumn<AmenityOrder>[] = [
    {
      key: "requestId",
      label: "Request ID",
      sortable: true,
    },
    {
      key: "amenity",
      label: "Amenity",
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
  const orderData: AmenityOrder[] = useMemo(() => {
    if (!amenityRequests) {
      return [];
    }

    return amenityRequests
      .filter((request: AmenityRequestWithDetails) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          request.id.toLowerCase().includes(search) ||
          request.status.toLowerCase().includes(search) ||
          request.amenities?.name.toLowerCase().includes(search) ||
          request.guests?.guest_name.toLowerCase().includes(search) ||
          request.guests?.room_number.toLowerCase().includes(search)
        );
      })
      .map((request: AmenityRequestWithDetails) => ({
        id: request.id,
        requestId: request.id.substring(0, 8).toUpperCase(),
        amenity: request.amenities?.name || "Unknown Amenity",
        guest: request.guests?.guest_name || "Unknown Guest",
        room: request.guests?.room_number || "N/A",
        status: request.status,
        created: request.created_at
          ? new Date(request.created_at).toLocaleString()
          : "N/A",
      }));
  }, [amenityRequests, searchValue]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading amenity requests: {error.message}
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

      {/* Amenity Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={orderColumns}
          data={orderData}
          loading={isLoading}
          emptyMessage="No amenity orders found. Orders will appear here once guests start requesting amenities."
          onRowClick={handleRowClick}
          itemsPerPage={10}
        />
      </div>

      {/* Request Detail Modal - View Only */}
      <AmenityRequestModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  );
}
