import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Textarea,
  Button,
} from "../../../../../../components/ui";
import {
  useCreateAbsenceRequest,
  useUpdateAbsenceRequest,
} from "../../../../../../hooks/hotel-staff";
import { useCurrentHotelStaff } from "../../../../../../hooks/hotel-staff/staff-management";
import type { Database } from "../../../../../../types/database";

type AbsenceRequest = Database["public"]["Tables"]["absence_requests"]["Row"];

interface AbsenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: AbsenceRequest | null;
}

const REQUEST_TYPE_OPTIONS = [
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export function AbsenceFormModal({
  isOpen,
  onClose,
  editData = null,
}: AbsenceFormModalProps) {
  const createAbsenceRequest = useCreateAbsenceRequest();
  const updateAbsenceRequest = useUpdateAbsenceRequest();
  const { data: staffData, isLoading: isLoadingStaff } = useCurrentHotelStaff();

  const [formData, setFormData] = useState({
    staffId: "",
    requestType: "",
    startDate: "",
    endDate: "",
    status: "pending",
    notes: "",
    dataProcessingConsent: false,
  });

  const [errors, setErrors] = useState({
    staffId: "",
    requestType: "",
    startDate: "",
    endDate: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        staffId: editData.staff_id,
        requestType: editData.request_type,
        startDate: editData.start_date,
        endDate: editData.end_date,
        status: editData.status,
        notes: editData.notes || "",
        dataProcessingConsent: editData.data_processing_consent,
      });
    } else {
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
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors = {
      staffId: "",
      requestType: "",
      startDate: "",
      endDate: "",
    };

    let isValid = true;

    // Validate staff selection
    if (!formData.staffId) {
      newErrors.staffId = "Please select a staff member";
      isValid = false;
    }

    // Validate request type
    if (!formData.requestType) {
      newErrors.requestType = "Please select a request type";
      isValid = false;
    }

    // Validate start date
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    // Validate end date
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editData) {
        // Update existing absence request
        await updateAbsenceRequest.mutateAsync({
          requestId: editData.id,
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
      } else {
        // Create new absence request
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
    // Reset form when closing
    setFormData({
      staffId: "",
      requestType: "",
      startDate: "",
      endDate: "",
      status: "pending",
      notes: "",
      dataProcessingConsent: false,
    });
    setErrors({
      staffId: "",
      requestType: "",
      startDate: "",
      endDate: "",
    });
    onClose();
  };

  // Prepare staff options for dropdown
  const staffOptions =
    staffData?.map((staff) => {
      const personalData = staff.hotel_staff_personal_data;
      const name = personalData
        ? `${personalData.first_name || ""} ${
            personalData.last_name || ""
          }`.trim()
        : staff.employee_id;
      const department = staff.department ? ` - ${staff.department}` : "";

      return {
        value: staff.id,
        label: `${name}${department}`,
      };
    }) || [];

  const isEditMode = !!editData;
  const isPending =
    createAbsenceRequest.isPending || updateAbsenceRequest.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Absence Request" : "Add Absence Request"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Staff Selection */}
        <Select
          label="Staff Member"
          value={formData.staffId}
          onChange={(e) =>
            setFormData({ ...formData, staffId: e.target.value })
          }
          options={staffOptions}
          placeholder="Select a staff member"
          error={errors.staffId}
          required
          disabled={isPending || isLoadingStaff}
        />

        {/* Request Type */}
        <Select
          label="Request Type"
          value={formData.requestType}
          onChange={(e) =>
            setFormData({ ...formData, requestType: e.target.value })
          }
          options={REQUEST_TYPE_OPTIONS}
          placeholder="Select request type"
          error={errors.requestType}
          required
          disabled={isPending}
        />

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            error={errors.startDate}
            required
            disabled={isPending}
          />

          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            error={errors.endDate}
            required
            disabled={isPending}
          />
        </div>

        {/* Status (only show in edit mode or if user wants to change status) */}
        {isEditMode && (
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={STATUS_OPTIONS}
            disabled={isPending}
          />
        )}

        {/* Notes */}
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter any additional notes or comments (optional)"
          rows={3}
          disabled={isPending}
        />

        {/* Data Processing Consent */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            id="dataProcessingConsent"
            checked={formData.dataProcessingConsent}
            onChange={(e) =>
              setFormData({
                ...formData,
                dataProcessingConsent: e.target.checked,
              })
            }
            disabled={isPending}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label
            htmlFor="dataProcessingConsent"
            className="text-sm text-gray-700 cursor-pointer"
          >
            I consent to the processing of personal data for this absence
            request. This includes storing and managing information related to
            the absence period.
          </label>
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
              "Update Request"
            ) : (
              "Create Request"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
