import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
} from "../../../../components/ui";
import {
  useAnnouncements,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "../../../../hooks/announcements/useAnnouncements";
import { useHotelId, usePagination } from "../../../../hooks";
import type { Database } from "../../../../types/database";
import { AnnouncementDetailModal } from "./AnnouncementDetailModal";

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
  onEdit: (announcement: AnnouncementRow) => void;
}

export function AnnouncementsTable({
  searchValue,
  onEdit,
}: AnnouncementsTableProps) {
  const hotelId = useHotelId();

  // State for detail modal
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementRow | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<AnnouncementRow | null>(null);

  // Fetch announcements using the hook
  const {
    data: announcements,
    isLoading,
    error,
  } = useAnnouncements(hotelId || undefined);

  // Get the mutations
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

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

  // Handler for row click
  const handleRowClick = (row: Announcement) => {
    const announcement = announcements?.find((a) => a.id === row.id);
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setIsDetailModalOpen(true);
    }
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Handler for edit
  const handleEdit = (announcement: AnnouncementRow) => {
    onEdit(announcement);
  };

  // Handler for delete
  const handleDelete = () => {
    if (selectedAnnouncement) {
      setAnnouncementToDelete(selectedAnnouncement);
      setIsDeleteConfirmOpen(true);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!announcementToDelete || !hotelId) return;
    try {
      await deleteAnnouncement.mutateAsync({
        id: announcementToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setAnnouncementToDelete(null);
      setIsDetailModalOpen(false);
      setSelectedAnnouncement(null);
    } catch (error) {
}
  };

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
          onRowClick={handleRowClick}
        />
      </div>

      {/* Detail Modal */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onEdit={() => handleEdit(selectedAnnouncement!)}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
