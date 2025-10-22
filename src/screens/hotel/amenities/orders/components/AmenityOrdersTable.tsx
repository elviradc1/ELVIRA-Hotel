import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import {
  useAmenityRequests,
  type AmenityRequestWithDetails,
} from "../../../../../hooks/amenities/amenity-requests/useAmenityRequests";
import { useHotelId } from "../../../../../hooks/useHotelContext";

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
  console.log("🎫🎫🎫 AMENITY ORDERS TABLE COMPONENT LOADED 🎫🎫🎫");

  const hotelId = useHotelId();

  console.log("🎫 AmenityOrdersTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch amenity requests using the hook
  const {
    data: amenityRequests,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useAmenityRequests(hotelId || undefined);

  useEffect(() => {
    console.log("🎫 AmenityRequests - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: amenityRequests?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: amenityRequests,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, amenityRequests, dataUpdatedAt]);
  useEffect(() => {
    console.log("🎫 AmenityRequests - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: amenityRequests?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: amenityRequests,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, amenityRequests, dataUpdatedAt]);

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
      console.log("🎫 AmenityRequests - No data to transform");
      return [];
    }

    console.log("🎫 AmenityRequests - Transforming data:", {
      rawCount: amenityRequests.length,
      searchValue,
    });

    const transformed = amenityRequests
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

    console.log("🎫 AmenityRequests - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [amenityRequests, searchValue]);

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
        🎫 AMENITY ORDERS DEBUG INFO
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
          <strong>Raw Requests Count:</strong> {amenityRequests?.length || 0}
        </div>
        <div>
          <strong>Filtered Requests Count:</strong> {orderData.length}
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
    console.error("🎫 AmenityRequests - Error loading requests:", error);
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
          <strong>Error loading amenity requests:</strong> {error.message}
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
          Loading amenity requests...
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
          Loading amenity requests...
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

      {/* Amenity Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={orderColumns}
          data={orderData}
          isLoading={isLoading}
          emptyMessage="No amenity orders found. Orders will appear here once guests start requesting amenities."
        />
      </div>
    </div>
  );
}
