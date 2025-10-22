import { useState } from "react";
import { Button } from "../../../../components/ui";
import {
  AbsencesTable,
  AbsenceFormModal,
  AbsenceDetailModal,
} from "./components";
import type { Database } from "../../../../types/database";

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

interface AbsencesProps {
  searchValue: string;
}

export function Absences({ searchValue }: AbsencesProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] =
    useState<AbsenceWithStaff | null>(null);

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleRowClick = (absence: AbsenceWithStaff) => {
    setSelectedAbsence(absence);
    setIsDetailModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAbsence(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Absences</h2>
        <Button variant="primary" onClick={handleAddNew}>
          + Add Request
        </Button>
      </div>
      <p className="text-gray-500">
        Track staff absences, leaves, and time-off requests.
      </p>

      <AbsencesTable searchValue={searchValue} onRowClick={handleRowClick} />

      {/* Add New Absence Modal */}
      <AbsenceFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editData={null}
      />

      {/* Absence Detail Modal */}
      <AbsenceDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        absence={selectedAbsence}
      />
    </div>
  );
}
