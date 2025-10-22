import { useState } from "react";
import { EmergencyContactsTable, AddEmergencyContactModal } from "./components";
import type { Database } from "../../../types/database";
import {
  PageContent,
  PageHeader,
  PageToolbar,
  TableContainer,
} from "../../../components/shared/page-layouts";

type EmergencyContact =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

export function EmergencyContacts() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);

  const handleSearchClear = () => {
    setSearchValue("");
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditContact(contact);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditContact(null);
  };

  return (
    <PageContent>
      <PageHeader
        title="Emergency Contacts"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
      />

      {/* Toolbar with Search and Actions */}
      <PageToolbar
        description="Maintain a list of important emergency contacts for hotel operations."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search emergency contacts by name or phone..."
        onSearchClear={handleSearchClear}
        buttonLabel="Add Contact"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <TableContainer>
        <EmergencyContactsTable searchValue={searchValue} onEdit={handleEdit} />
      </TableContainer>

      {/* Add/Edit Emergency Contact Modal */}
      <AddEmergencyContactModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editData={editContact}
      />
    </PageContent>
  );
}
