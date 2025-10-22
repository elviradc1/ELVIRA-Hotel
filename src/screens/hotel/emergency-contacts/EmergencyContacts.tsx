import { useState } from "react";
import { SearchBox, Button } from "../../../components/ui";
import { EmergencyContactsTable, AddEmergencyContactModal } from "./components";
import type { Database } from "../../../types/database";

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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <svg
          className="w-6 h-6 text-gray-600 mr-3"
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
        <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            Maintain a list of important emergency contacts for hotel
            operations.
          </p>

          <div className="flex items-center gap-3">
            {/* Add Emergency Contact Button */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Contact
            </Button>

            {/* Search Box */}
            <div className="w-80">
              <SearchBox
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search emergency contacts by name or phone..."
                onClear={handleSearchClear}
              />
            </div>
          </div>
        </div>

        <EmergencyContactsTable searchValue={searchValue} onEdit={handleEdit} />
      </div>

      {/* Add/Edit Emergency Contact Modal */}
      <AddEmergencyContactModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editData={editContact}
      />
    </div>
  );
}
