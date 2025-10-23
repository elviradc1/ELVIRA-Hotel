import { useState } from "react";
import { AmenitiesTable, AmenityModal } from "./components";
import { ManagementPageHeader } from "../../../../components/shared";

interface AmenitiesManagementProps {
  searchValue: string;
}

export function AmenitiesManagement({ searchValue }: AmenitiesManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Amenities Management"
        description="Manage hotel amenities, facilities, and services available to guests."
        buttonLabel="Add Amenity"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <AmenitiesTable searchValue={searchValue} />

      <AmenityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
      />
    </div>
  );
}
