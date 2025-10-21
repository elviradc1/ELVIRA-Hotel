import { AmenitiesTable } from "./components";

interface AmenitiesManagementProps {
  searchValue: string;
}

export function AmenitiesManagement({ searchValue }: AmenitiesManagementProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Amenities Management
      </h2>
      <p className="text-gray-500">
        Manage hotel amenities, facilities, and services available to guests.
      </p>

      <AmenitiesTable searchValue={searchValue} />
    </div>
  );
}
