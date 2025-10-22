import { useState, useEffect } from "react";
import { Modal, Input, Button } from "../../../../components/ui";
import {
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
} from "../../../../hooks/emergency-contacts/useEmergencyContacts";
import { useHotelId } from "../../../../hooks/useHotelContext";
import { useAuth } from "../../../../hooks/useAuth";
import type { Database } from "../../../../types/database";

type EmergencyContact =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

interface AddEmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: EmergencyContact | null;
}

export function AddEmergencyContactModal({
  isOpen,
  onClose,
  editData = null,
}: AddEmergencyContactModalProps) {
  const hotelId = useHotelId();
  const { user } = useAuth();
  const createEmergencyContact = useCreateEmergencyContact();
  const updateEmergencyContact = useUpdateEmergencyContact();

  const [formData, setFormData] = useState({
    contactName: "",
    phoneNumber: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        contactName: editData.contact_name,
        phoneNumber: editData.phone_number,
      });
    } else {
      setFormData({
        contactName: "",
        phoneNumber: "",
      });
    }
  }, [editData]);

  const [errors, setErrors] = useState({
    contactName: "",
    phoneNumber: "",
  });

  const validateForm = () => {
    const newErrors = {
      contactName: "",
      phoneNumber: "",
    };

    let isValid = true;

    // Validate contact name
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
      isValid = false;
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^[\d\s+()-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hotelId) {
      console.error("No hotel ID available");
      return;
    }

    try {
      if (editData) {
        // Update existing contact
        await updateEmergencyContact.mutateAsync({
          id: editData.id,
          updates: {
            contact_name: formData.contactName.trim(),
            phone_number: formData.phoneNumber.trim(),
          },
        });
      } else {
        // Create new contact
        await createEmergencyContact.mutateAsync({
          contact_name: formData.contactName.trim(),
          phone_number: formData.phoneNumber.trim(),
          hotel_id: hotelId,
          created_by: user?.id || null,
          is_active: true,
        });
      }

      // Reset form and close modal
      setFormData({
        contactName: "",
        phoneNumber: "",
      });
      setErrors({
        contactName: "",
        phoneNumber: "",
      });
      onClose();
    } catch (error) {
      console.error("Error saving emergency contact:", error);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      contactName: "",
      phoneNumber: "",
    });
    setErrors({
      contactName: "",
      phoneNumber: "",
    });
    onClose();
  };

  const isEditMode = !!editData;
  const isPending =
    createEmergencyContact.isPending || updateEmergencyContact.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Emergency Contact" : "Add Emergency Contact"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Name Input */}
        <Input
          label="Contact Name"
          type="text"
          placeholder="Enter contact name (e.g., Fire Department, Police)"
          value={formData.contactName}
          onChange={(e) =>
            setFormData({ ...formData, contactName: e.target.value })
          }
          error={errors.contactName}
          required
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        {/* Phone Number Input */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number (e.g., +1 555-0123)"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          error={errors.phoneNumber}
          required
          leftIcon={
            <svg
              className="w-5 h-5"
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 74 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : isEditMode ? (
              "Update Contact"
            ) : (
              "Add Contact"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
