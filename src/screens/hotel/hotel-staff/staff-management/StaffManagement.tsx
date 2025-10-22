import { useState } from "react";
import { Button } from "../../../../components/ui";
import { StaffTable, StaffFormModal, StaffDetailModal } from "./components";

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

interface StaffManagementProps {
  searchValue: string;
}

export function StaffManagement({ searchValue }: StaffManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleRowClick = (staff: StaffData) => {
    setSelectedStaff(staff);
    setIsDetailModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Staff Management
        </h2>
        <Button variant="primary" onClick={handleAddNew}>
          + Add Member
        </Button>
      </div>
      <p className="text-gray-500">
        Manage hotel staff members, their roles, and permissions.
      </p>

      <StaffTable searchValue={searchValue} onRowClick={handleRowClick} />

      {/* Add New Staff Modal */}
      <StaffFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editData={null}
      />

      {/* Staff Detail Modal */}
      <StaffDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        staff={selectedStaff}
      />
    </div>
  );
}
