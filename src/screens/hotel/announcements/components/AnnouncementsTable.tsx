import { useMemo } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../components/ui";
import {
  useAnnouncements,
  useUpdateAnnouncement,
} from "../../../../hooks/announcements/useAnnouncements";
import { useHotelId, usePagination } from "../../../../hooks";
import type { Database } from "../../../../types/database";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

interface Announcement extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  title: string;
  description: string;
  created: string;
}

interface AnnouncementsTableProps {
  searchValue: string;
}

export function AnnouncementsTable({ searchValue }: AnnouncementsTableProps) {
  const hotelId = useHotelId();

  // Fetch announcements using the hook
  const {
    data: announcements,
    isLoading,
    error,
  } = useAnnouncements(hotelId || undefined);

  // Get the update mutation
  const updateAnnouncement = useUpdateAnnouncement();

  // Define table columns for announcements
  const columns: TableColumn<Announcement>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateAnnouncement.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
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
      return [];
    }

    return announcements
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
        isActive: announcement.is_active,
        title: announcement.title,
        description: announcement.description,
        created: announcement.created_at
          ? new Date(announcement.created_at).toLocaleDateString()
          : "N/A",
      }));
  }, [announcements, searchValue]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<Announcement>({ data: announcementData, itemsPerPage: 10 });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading announcements: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
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
          data={paginatedData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No announcements found matching "${searchValue}".`
              : "No announcements found. Create new announcements to get started."
          }
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={announcementData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
