import { Table, type TableColumn } from "../../../../../components/ui";

interface Absence extends Record<string, unknown> {
  id: string;
  status: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface AbsencesTableProps {
  searchValue: string;
}

export function AbsencesTable({ searchValue }: AbsencesTableProps) {
  // Define table columns with centered alignment
  const columns: TableColumn<Absence>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
    },
    {
      key: "notes",
      label: "Notes",
    },
  ];

  // Empty data array - no mock data
  const absenceData: Absence[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Absences Table */}
      <Table
        columns={columns}
        data={absenceData}
        emptyMessage="No absence requests found. Click '+ Add Request' to get started."
      />
    </div>
  );
}
