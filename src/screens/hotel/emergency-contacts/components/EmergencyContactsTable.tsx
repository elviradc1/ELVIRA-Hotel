import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
} from "../../../../components/ui";
import {
  useEmergencyContacts,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
} from "../../../../hooks/emergency-contacts/useEmergencyContacts";
import { useHotelId } from "../../../../hooks/useHotelContext";
import { usePagination } from "../../../../hooks";
import type { Database } from "../../../../types/database";
import { EmergencyContactDetailModal } from "./EmergencyContactDetailModal";

type EmergencyContactRow =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

interface EmergencyContact extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  contactName: string;
  contactPhone: string;
  created: string;
}

interface EmergencyContactsTableProps {
  searchValue: string;
  onEdit: (contact: EmergencyContactRow) => void;
}

export function EmergencyContactsTable({
  searchValue,
  onEdit,
}: EmergencyContactsTableProps) {
  const hotelId = useHotelId();

  // State for detail modal
  const [selectedContact, setSelectedContact] =
    useState<EmergencyContactRow | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] =
    useState<EmergencyContactRow | null>(null);

  // Fetch emergency contacts using the hook
  const {
    data: emergencyContacts,
    isLoading,
    error,
  } = useEmergencyContacts(hotelId || undefined);

  // Get the mutations
  const updateEmergencyContact = useUpdateEmergencyContact();
  const deleteEmergencyContact = useDeleteEmergencyContact();

  // Define table columns for emergency contacts
  const columns: TableColumn<EmergencyContact>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateEmergencyContact.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "contactName",
      label: "Contact Name",
      sortable: true,
    },
    {
      key: "contactPhone",
      label: "Contact Phone",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Handler for row click
  const handleRowClick = (row: EmergencyContact) => {
    const contact = emergencyContacts?.find((c) => c.id === row.id);
    if (contact) {
      setSelectedContact(contact);
      setIsDetailModalOpen(true);
    }
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  // Handler for edit
  const handleEdit = () => {
    if (selectedContact) {
      onEdit(selectedContact);
    }
  };

  // Handler for delete
  const handleDelete = () => {
    if (selectedContact) {
      setContactToDelete(selectedContact);
      setIsDeleteConfirmOpen(true);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!contactToDelete || !hotelId) return;
    try {
      await deleteEmergencyContact.mutateAsync({
        id: contactToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setContactToDelete(null);
      setIsDetailModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
    }
  };

  // Transform database data to table format with search filtering
  const contactData: EmergencyContact[] = useMemo(() => {
    if (!emergencyContacts) {
      return [];
    }

    return emergencyContacts
      .filter((contact: EmergencyContactRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          contact.contact_name.toLowerCase().includes(search) ||
          contact.phone_number.toLowerCase().includes(search)
        );
      })
      .map((contact: EmergencyContactRow) => ({
        id: contact.id,
        status: contact.is_active ? "Active" : "Inactive",
        isActive: contact.is_active,
        contactName: contact.contact_name,
        contactPhone: contact.phone_number,
        created: contact.created_at
          ? new Date(contact.created_at).toLocaleDateString()
          : "N/A",
      }));
  }, [emergencyContacts, searchValue]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<EmergencyContact>({
    data: contactData,
    itemsPerPage: 10,
  });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading emergency contacts: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {contactData.length} result(s)
        </p>
      )}

      {/* Emergency Contacts Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No emergency contacts found matching "${searchValue}".`
              : "No emergency contacts found. Add new contacts to get started."
          }
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={contactData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Detail Modal */}
      <EmergencyContactDetailModal
        contact={selectedContact}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Emergency Contact"
        message="Are you sure you want to delete this emergency contact? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
