import { Table, type TableColumn } from "../../../../../components/ui";

interface StaffMember extends Record<string, unknown> {
  id: string;
  status: string;
  employeeId: string;
  position: string;
  department: string;
  name: string;
  phone: string;
  email: string;
  hireDate: string;
}

interface StaffTableProps {
  searchValue: string;
}

export function StaffTable({ searchValue }: StaffTableProps) {
  // Define table columns with centered alignment
  const columns: TableColumn<StaffMember>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "employeeId",
      label: "Employee ID",
      sortable: true,
    },
    {
      key: "position",
      label: "Position",
      sortable: true,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "hireDate",
      label: "Hire Date",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const staffData: StaffMember[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Staff Table */}
      <Table
        columns={columns}
        data={staffData}
        emptyMessage="No staff members found. Click '+ Add Member' to get started."
      />
    </div>
  );
}
