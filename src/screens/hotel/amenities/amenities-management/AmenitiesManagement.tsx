import { useState } from "react";
import { AmenitiesTable, AddAmenityModal } from "./components";
import { ManagementPageHeader } from "../../../../components/shared";

interface AmenitiesManagementProps {
  searchValue: string;
}

export function AmenitiesManagement({ searchValue }: AmenitiesManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Amenities Management"
        description="Manage hotel amenities, facilities, and services available to guests."
        buttonLabel="Add Amenity"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <AmenitiesTable searchValue={searchValue} />

      <AddAmenityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
