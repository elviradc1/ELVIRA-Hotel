import { useState } from "react";
import { AnnouncementsTable, AddAnnouncementModal } from "./components";
import type { Database } from "../../../types/database";
import {
  PageContent,
  PageHeader,
  PageToolbar,
  TableContainer,
} from "../../../components/shared/page-layouts";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

export function Announcements() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(
    null
  );

  const handleSearchClear = () => {
    setSearchValue("");
  };

  const handleEdit = (announcement: Announcement) => {
    setEditAnnouncement(announcement);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditAnnouncement(null);
  };

  return (
    <PageContent>
      <PageHeader
        title="Announcements"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        }
      />

      {/* Toolbar with Search and Actions */}
      <PageToolbar
        description="Create and manage hotel announcements for guests and staff."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search announcements by title or description..."
        onSearchClear={handleSearchClear}
        buttonLabel="Add Announcement"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <TableContainer>
        <AnnouncementsTable searchValue={searchValue} onEdit={handleEdit} />
      </TableContainer>

      {/* Add/Edit Announcement Modal */}
      <AddAnnouncementModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editData={editAnnouncement}
      />
    </PageContent>
  );
}
