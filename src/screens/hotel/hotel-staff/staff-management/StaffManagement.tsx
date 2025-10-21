import { Button } from "../../../../components/ui";
import { StaffTable } from "./components";

interface StaffManagementProps {
  searchValue: string;
}

export function StaffManagement({ searchValue }: StaffManagementProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Staff Management
        </h2>
        <Button
          variant="primary"
          onClick={() => console.log("Add member clicked")}
        >
          + Add Member
        </Button>
      </div>
      <p className="text-gray-500">
        Manage hotel staff members, their roles, and permissions.
      </p>

      <StaffTable searchValue={searchValue} />
    </div>
  );
}
