import { useState } from "react";
import {
  Modal,
  Button,
  ConfirmationModal,
} from "../../../../../../../components/ui";
import { AbsenceFormModal } from "../AbsenceFormModal";
import { useDeleteAbsenceRequest } from "../../../../../../../hooks/hotel-staff";
import type { Database } from "../../../../../../../types/database";

type AbsenceRequestRow =
  Database["public"]["Tables"]["absence_requests"]["Row"];

// Extended type with staff relationship
interface AbsenceWithStaff extends AbsenceRequestRow {
  staff?: {
    id: string;
    position: string;
    department: string;
    hotel_staff_personal_data?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

interface AbsenceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  absence: AbsenceWithStaff | null;
}

export function AbsenceDetailModal({
  isOpen,
  onClose,
  absence,
}: AbsenceDetailModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteAbsenceRequest = useDeleteAbsenceRequest();

  if (!absence) return null;

  const staff = absence.staff;
  const personalData = staff?.hotel_staff_personal_data;
  const staffName = personalData
    ? `${personalData.first_name || ""} ${personalData.last_name || ""}`.trim()
    : "Unknown";

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAbsenceRequest.mutateAsync(absence.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting absence request:", error);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRequestTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      vacation: "Vacation",
      sick: "Sick Leave",
      personal: "Personal",
      training: "Training",
      other: "Other",
    };
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
        {labels[type] || type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    const labels: Record<string, string> = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      cancelled: "Cancelled",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          colors[status] || colors.pending
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const calculateDays = () => {
    const start = new Date(absence.start_date);
    const end = new Date(absence.end_date);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isEditModalOpen}
        onClose={onClose}
        title="Absence Request Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {staffName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {staff?.department || "N/A"}
              </p>
            </div>
            {getStatusBadge(absence.status)}
          </div>

          {/* Request Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Request Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Request Type
                </label>
                <div className="mt-1">
                  {getRequestTypeBadge(absence.request_type)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Duration
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {calculateDays()} day{calculateDays() !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Start Date
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(absence.start_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  End Date
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(absence.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {absence.notes && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                Notes
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {absence.notes}
              </p>
            </div>
          )}

          {/* Consent Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Data Processing
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  absence.data_processing_consent
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {absence.data_processing_consent
                  ? "Consent Given"
                  : "No Consent"}
              </span>
              {absence.consent_date && (
                <span className="text-xs text-gray-500">
                  {formatDate(absence.consent_date)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <AbsenceFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={absence}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Absence Request"
        message="Are you sure you want to delete this absence request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteAbsenceRequest.isPending}
      />
    </>
  );
}
