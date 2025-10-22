import { useState } from "react";
import { Modal, ModalFooter } from "../../../../components/ui";
import {
  ItemBasicInfoDisplay,
  ItemDetailsGrid,
  ItemMetadataDisplay,
} from "../../../../components/ui/forms";
import { useUpdateEmergencyContact } from "../../../../hooks/emergency-contacts/useEmergencyContacts";
import type { Database } from "../../../../types/database";

type EmergencyContact =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

interface EmergencyContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: EmergencyContact | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EmergencyContactDetailModal({
  isOpen,
  onClose,
  contact,
  onEdit,
  onDelete,
}: EmergencyContactDetailModalProps) {
  const updateEmergencyContact = useUpdateEmergencyContact();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!contact) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateEmergencyContact.mutateAsync({
        id: contact.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Contact Details"
      size="md"
    >
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <button
            onClick={() => handleStatusToggle(!contact.is_active)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              contact.is_active
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {contact.is_active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={contact.contact_name}
          category="Emergency Contact"
          hotelRecommended={false}
          hideRecommendedIcon
        />

        {/* Contact Details */}
        <ItemDetailsGrid
          details={[
            {
              label: "Phone Number",
              value: [
                <a
                  key="phone"
                  href={`tel:${contact.phone_number}`}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {contact.phone_number}
                </a>,
              ],
            },
          ]}
        />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={contact.created_at}
          updatedAt={contact.updated_at}
        />
      </div>

      {/* Footer Actions */}
      <ModalFooter
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        showEdit={!!onEdit}
        showDelete={!!onDelete}
        isLoading={isUpdating}
      />
    </Modal>
  );
}
