import { useState } from "react";
import {
  Modal,
  Button,
  ConfirmationModal,
} from "../../../../../../../components/ui";
import { StaffFormModal } from "../StaffFormModal";
import { useDeleteStaff } from "../../../../../../../hooks/hotel-staff";

interface StaffData {
  id: string;
  position: string;
  department: string;
  status: string;
  employee_id: string;
  hire_date: string;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteStaff = useDeleteStaff();

  if (!staff) return null;

  const personalData = staff.hotel_staff_personal_data;
  const fullName = personalData
    ? `${personalData.first_name || ""} ${personalData.last_name || ""}`.trim()
    : "N/A";

  const handleEdit = () => {
    setIsEditModalOpen(true);
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

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      on_leave: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || colors.active
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isEditModalOpen}
        onClose={onClose}
        title="Staff Member Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {fullName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{staff.employee_id}</p>
            </div>
            {getStatusBadge(staff.status)}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  First Name
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.first_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Name
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.last_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date of Birth
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.date_of_birth
                    ? formatDate(personalData.date_of_birth)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Employment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Position
                </label>
                <p className="text-sm text-gray-900 mt-1">{staff.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Department
                </label>
                <p className="text-sm text-gray-900 mt-1">{staff.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Hire Date
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(staff.hire_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.phone_number || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Address Information
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {personalData?.address || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    City
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {personalData?.city || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Zip Code
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {personalData?.zip_code || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {personalData?.country || "N/A"}
                  </p>
                </div>
              </div>
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
      <StaffFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={staff}
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
