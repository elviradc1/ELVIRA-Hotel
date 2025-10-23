import { useState, useEffect } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../../components/ui";
import { useCurrentHotelStaff } from "../../../../../../../hooks/hotel-staff/staff-management";
import {
  useCreateAbsenceRequest,
  useUpdateAbsenceRequest,
} from "../../../../../../../hooks/hotel-staff";
import { AbsenceBasicSection } from "./AbsenceBasicSection";
import { AbsenceTypeSection } from "./AbsenceTypeSection";
import { AbsenceDatesSection } from "./AbsenceDatesSection";
import { AbsenceNotesSection } from "./AbsenceNotesSection";
import type { AbsenceModalProps, AbsenceFormData } from "./types";

export function AbsenceModal({
  isOpen,
  onClose,
  absence = null,
  mode: initialMode = "create",
  onEdit,
  onDelete,
}: AbsenceModalProps) {
  const [internalMode, setInternalMode] = useState(initialMode);
  const createAbsenceRequest = useCreateAbsenceRequest();
  const updateAbsenceRequest = useUpdateAbsenceRequest();
  const { data: staffData, isLoading: isLoadingStaff } = useCurrentHotelStaff();

  const [formData, setFormData] = useState<AbsenceFormData>({
    staffId: "",
    requestType: "",
    startDate: "",
    endDate: "",
    status: "pending",
    notes: "",
    dataProcessingConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Update internal mode when prop changes
  useEffect(() => {
    setInternalMode(initialMode);
  }, [initialMode]);

  // Populate form when editing or viewing
  useEffect(() => {
    if (absence && (internalMode === "edit" || internalMode === "view")) {
      setFormData({
        staffId: absence.staff_id,
        requestType: absence.request_type,
        startDate: absence.start_date,
        endDate: absence.end_date,
        status: absence.status,
        notes: absence.notes || "",
        dataProcessingConsent: absence.data_processing_consent,
      });
    } else if (internalMode === "create") {
      setFormData({
        staffId: "",
        requestType: "",
        startDate: "",
        endDate: "",
        status: "pending",
        notes: "",
        dataProcessingConsent: false,
      });
    }
  }, [absence, internalMode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    if (!formData.staffId) {
      newErrors.staffId = "Please select a staff member";
      isValid = false;
    }

    if (!formData.requestType) {
      newErrors.requestType = "Please select a request type";
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date cannot be before start date";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (internalMode === "edit" && absence) {
        await updateAbsenceRequest.mutateAsync({
          requestId: absence.id,
          updates: {
            staff_id: formData.staffId,
            request_type: formData.requestType,
            start_date: formData.startDate,
            end_date: formData.endDate,
            status: formData.status,
            notes: formData.notes.trim() || null,
            data_processing_consent: formData.dataProcessingConsent,
            consent_date: formData.dataProcessingConsent
              ? new Date().toISOString()
              : null,
          },
        });
      } else if (internalMode === "create") {
        await createAbsenceRequest.mutateAsync({
          staff_id: formData.staffId,
          request_type: formData.requestType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          status: formData.status,
          notes: formData.notes.trim() || null,
          data_processing_consent: formData.dataProcessingConsent,
          consent_date: formData.dataProcessingConsent
            ? new Date().toISOString()
            : null,
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving absence request:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      staffId: "",
      requestType: "",
      startDate: "",
      endDate: "",
      status: "pending",
      notes: "",
      dataProcessingConsent: false,
    });
    setErrors({});
    setInternalMode(initialMode);
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

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isPending =
    createAbsenceRequest.isPending || updateAbsenceRequest.isPending;

  // Prepare staff options
  const staffOptions = [
    { value: "", label: "Select staff member" },
    ...(staffData?.map((staff) => {
      const personalData = staff.hotel_staff_personal_data;
      const name = personalData
        ? `${personalData.first_name || ""} ${
            personalData.last_name || ""
          }`.trim()
        : "Unknown";
      return {
        value: staff.id,
        label: `${name} - ${staff.position || "No Position"}`,
      };
    }) || []),
  ];

  const modalTitle =
    internalMode === "view"
      ? "Absence Request Details"
      : internalMode === "edit"
      ? "Edit Absence Request"
      : "New Absence Request";

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
            internalMode === "edit" ? "Update Request" : "Create Request"
          }
        />
      }
    >
      <form onSubmit={handleSubmit}>
        <AbsenceBasicSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
          staffOptions={staffOptions}
          isLoadingStaff={isLoadingStaff}
        />

        <AbsenceTypeSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
        />

        <AbsenceDatesSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
        />

        <AbsenceNotesSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending}
        />
      </form>
    </ModalForm>
  );
}
