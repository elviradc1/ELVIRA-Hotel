import { useState, useEffect } from "react";
import { ConfirmationModal } from "../../../../../../../components/ui";
import { StaffModal } from "../staff-modal";
import { useDeleteStaff } from "../../../../../../../hooks/hotel-staff";
import type { StaffData } from "../staff-modal";

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffData | null;
}

export function StaffDetailModal({
  isOpen,
  onClose,
  staff,
}: StaffDetailModalProps) {
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteStaff = useDeleteStaff();

  // Reset to view mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setModalMode("view");
    }
  }, [isOpen]);

  if (!staff) return null;

  const personalData = staff.hotel_staff_personal_data;
  const fullName = personalData
    ? `${personalData.first_name || ""} ${personalData.last_name || ""}`.trim()
    : "N/A";

  const handleEdit = () => {
    setModalMode("edit");
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStaff.mutateAsync(staff.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleModalClose = () => {
    setModalMode("view");
    onClose();
  };

  return (
    <>
      {/* Unified Staff Modal - handles both view and edit modes */}
      <StaffModal
        isOpen={isOpen}
        onClose={handleModalClose}
        staff={staff}
        mode={modalMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${fullName}? This action cannot be undone and will remove the staff member from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteStaff.isPending}
      />
    </>
  );
}
