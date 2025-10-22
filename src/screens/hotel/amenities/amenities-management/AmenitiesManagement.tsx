import { AmenitiesTable } from "./components";
import { Button } from "../../../../components/ui";

interface AmenitiesManagementProps {
  searchValue: string;
}

export function AmenitiesManagement({ searchValue }: AmenitiesManagementProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Amenities Management
          </h2>
          <p className="text-gray-500">
            Manage hotel amenities, facilities, and services available to
            guests.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            // TODO: Open add amenity modal
            console.log("Add Amenity clicked");
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Amenity
        </Button>
      </div>

      <AmenitiesTable searchValue={searchValue} />
    </div>
  );
}
