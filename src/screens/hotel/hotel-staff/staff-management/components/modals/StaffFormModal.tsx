import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button } from "../../../../../../components/ui";
import { useCurrentUserHotelId } from "../../../../../../hooks/useCurrentUserHotel";
import { queryKeys } from "../../../../../../lib/react-query";
import { useStaffForm } from "./hooks";
import {
  StaffBasicInfoFields,
  StaffEmploymentFields,
  StaffContactFields,
  StaffAddressFields,
} from "./form-fields";
import { createStaffMember, updateStaffMember } from "./services";

interface StaffData {
  id: string;
  position: string;
  department: string;
  status: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    date_of_birth?: string | null;
    address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
  };
}

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: StaffData | null;
}

export function StaffFormModal({
  isOpen,
  onClose,
  editData = null,
}: StaffFormModalProps) {
  const { hotelId } = useCurrentUserHotelId();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { formData, setFormData, errors, validateForm, resetForm } =
    useStaffForm(editData);

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
      if (!editData) throw new Error("Staff data is required for update");

      return updateStaffMember({
        staffId: editData.id,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editData) {
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
    onClose();
  };

  const isEditMode = !!editData;
  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  // Show success message modal
  if (successMessage) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Staff Member Created Successfully"
        size="md"
      >
        <div className="space-y-4">
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

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Staff Member" : "Add New Staff Member"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
            Basic Information
          </h3>
          <StaffBasicInfoFields
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            onFirstNameChange={(value) =>
              setFormData({ ...formData, firstName: value })
            }
            onLastNameChange={(value) =>
              setFormData({ ...formData, lastName: value })
            }
            onEmailChange={(value) =>
              setFormData({ ...formData, email: value })
            }
            errors={errors}
            disabled={isPending}
            isEditMode={isEditMode}
          />
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
            Employment Information
          </h3>
          <StaffEmploymentFields
            position={formData.position}
            department={formData.department}
            status={formData.status}
            onPositionChange={(value) =>
              setFormData({ ...formData, position: value })
            }
            onDepartmentChange={(value) =>
              setFormData({ ...formData, department: value })
            }
            onStatusChange={(value) =>
              setFormData({ ...formData, status: value })
            }
            errors={errors}
            disabled={isPending}
            isEditMode={isEditMode}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
            Contact Information
          </h3>
          <StaffContactFields
            phone={formData.phone}
            dateOfBirth={formData.dateOfBirth}
            onPhoneChange={(value) =>
              setFormData({ ...formData, phone: value })
            }
            onDateOfBirthChange={(value) =>
              setFormData({ ...formData, dateOfBirth: value })
            }
            disabled={isPending}
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
            Address Information
          </h3>
          <StaffAddressFields
            address={formData.address}
            city={formData.city}
            zipCode={formData.zipCode}
            country={formData.country}
            onAddressChange={(value) =>
              setFormData({ ...formData, address: value })
            }
            onCityChange={(value) => setFormData({ ...formData, city: value })}
            onZipCodeChange={(value) =>
              setFormData({ ...formData, zipCode: value })
            }
            onCountryChange={(value) =>
              setFormData({ ...formData, country: value })
            }
            disabled={isPending}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Staff Member"
            ) : (
              "Add Staff Member"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
