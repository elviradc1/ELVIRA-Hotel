import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../components/ui";
import { useAnnouncements } from "../../../../hooks/announcements/useAnnouncements";
import { useHotelId } from "../../../../hooks/useHotelContext";
import type { Database } from "../../../../types/database";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

interface Announcement extends Record<string, unknown> {
  id: string;
  status: string;
  title: string;
  description: string;
  created: string;
}

interface AnnouncementsTableProps {
  searchValue: string;
}

export function AnnouncementsTable({ searchValue }: AnnouncementsTableProps) {
  console.log("📢📢📢 ANNOUNCEMENTS TABLE COMPONENT LOADED 📢📢📢");

  const hotelId = useHotelId();

  console.log("📢 AnnouncementsTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch announcements using the hook
  const {
    data: announcements,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useAnnouncements(hotelId || undefined);

  useEffect(() => {
    console.log("📢 Announcements - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: announcements?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: announcements,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, announcements, dataUpdatedAt]);

  // Define table columns for announcements
  const columns: TableColumn<Announcement>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const announcementData: Announcement[] = useMemo(() => {
    if (!announcements) {
      console.log("📢 Announcements - No data to transform");
      return [];
    }

    console.log("📢 Announcements - Transforming data:", {
      rawCount: announcements.length,
      searchValue,
    });

    const transformed = announcements
      .filter((announcement: AnnouncementRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          announcement.title.toLowerCase().includes(search) ||
          announcement.description.toLowerCase().includes(search)
        );
      })
      .map((announcement: AnnouncementRow) => ({
        id: announcement.id,
        status: announcement.is_active ? "Active" : "Inactive",
        title: announcement.title,
        description: announcement.description,
        created: announcement.created_at
          ? new Date(announcement.created_at).toLocaleDateString()
          : "N/A",
      }));

    console.log("📢 Announcements - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [announcements, searchValue]);

  // Log any errors
  if (error) {
    console.error("📢 Announcements - Error loading data:", error);
  }

  return (
    <div className="mt-6">
      {/* Always visible debug banner */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
        <div className="font-bold text-yellow-900 mb-2">📢 Debug Info:</div>
        <div className="text-yellow-800 space-y-1 text-xs">
          <div>Hotel ID: {hotelId || "Not found"}</div>
          <div>Loading: {isLoading ? "Yes" : "No"}</div>
          <div>Fetching: {isFetching ? "Yes" : "No"}</div>
          <div>Data Count: {announcements?.length || 0}</div>
          <div>Filtered Count: {announcementData.length}</div>
          <div>Error: {error?.message || "None"}</div>
        </div>
      </div>

      {/* Debug info */}
      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⏳ {isLoading ? "Loading" : "Refetching"} announcements...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Error: {error.message}
        </div>
      )}

      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {announcementData.length}{" "}
          result(s)
        </p>
      )}

      {/* Announcements Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={announcementData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No announcements found matching "${searchValue}".`
              : "No announcements found. Create new announcements to get started."
          }
        />
      </div>
    </div>
  );
}
