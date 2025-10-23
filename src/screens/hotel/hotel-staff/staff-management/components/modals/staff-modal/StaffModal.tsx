import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ModalForm,
  Button,
  ModalFormActions,
} from "../../../../../../../components/ui";
import { useCurrentUserHotelId } from "../../../../../../../hooks/useCurrentUserHotel";
import { queryKeys } from "../../../../../../../lib/react-query";
import { StaffBasicSection } from "./StaffBasicSection";
import { StaffEmploymentSection } from "./StaffEmploymentSection";
import { StaffContactSection } from "./StaffContactSection";
import { StaffAddressSection } from "./StaffAddressSection";
import { createStaffMember, updateStaffMember } from "../services";
import { useStaffForm } from "../hooks";
import type { StaffModalProps, StaffData } from "./types";

/**
 * StaffModal - Unified modal for creating, editing, and viewing staff members
 * Uses the new ModalForm components for consistent styling across all modes
 */
export function StaffModal({
  isOpen,
  onClose,
  staff = null,
  mode = "create",
  onEdit,
  onDelete,
}: StaffModalProps) {
  const { hotelId } = useCurrentUserHotelId();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [internalMode, setInternalMode] = useState(mode);

  const { formData, setFormData, errors, validateForm, resetForm } =
    useStaffForm(staff as StaffData | null);

  // Update internal mode when prop changes
  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const isViewMode = internalMode === "view";
  const isEditMode = internalMode === "edit";

  // Create staff mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!hotelId) throw new Error("Hotel ID is required");

      return createStaffMember({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        position: formData.position,
        department: formData.department,
        phone: formData.phone || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        hotelId,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffByHotel(hotelId || ""),
      });

      if (data.temporaryPassword) {
        setSuccessMessage(
          `Staff member created successfully!\n\nEmail: ${data.email}\nTemporary Password: ${data.temporaryPassword}\n\nPlease save these credentials and share them with the staff member.`
        );
      } else {
        handleClose();
      }
    },
  });

  // Update staff mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!staff) throw new Error("Staff data is required for update");

      return updateStaffMember({
        staffId: staff.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        department: formData.department,
        status: formData.status,
        phone: formData.phone || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffByHotel(hotelId || ""),
      });
      handleClose();
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (staff) {
        await updateMutation.mutateAsync();
      } else {
        await createMutation.mutateAsync();
      }
    } catch (error) {
      console.error("Error saving staff member:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save staff member. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setSuccessMessage(null);
    setInternalMode(mode);
    onClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalMode("edit");
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  // Show success message modal
  if (successMessage) {
    return (
      <ModalForm
        isOpen={isOpen}
        onClose={handleClose}
        title="Staff Member Created Successfully"
        size="md"
        footer={
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        }
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-green-600 mr-3 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-green-800 whitespace-pre-wrap">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      </ModalForm>
    );
  }

  // Get modal title
  const modalTitle = isViewMode
    ? "Staff Member Details"
    : isEditMode
    ? "Edit Staff Member"
    : "Add New Staff Member";

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="lg"
      footer={
        <ModalFormActions
          mode={internalMode}
          onCancel={handleClose}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={
            internalMode === "edit" ? "Update Staff Member" : "Add Staff Member"
          }
        />
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <StaffBasicSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
        />

        {/* Employment Information */}
        <StaffEmploymentSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
        />

        {/* Contact Information */}
        <StaffContactSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending}
        />

        {/* Address Information */}
        <StaffAddressSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending}
        />
      </form>
    </ModalForm>
  );
}
