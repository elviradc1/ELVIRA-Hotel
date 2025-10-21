import { Table, type TableColumn } from "../../../../components/ui";

interface EmergencyContact extends Record<string, unknown> {
  id: string;
  status: string;
  contactName: string;
  contactPhone: string;
  created: string;
}

interface EmergencyContactsTableProps {
  searchValue: string;
}

export function EmergencyContactsTable({
  searchValue,
}: EmergencyContactsTableProps) {
  // Define table columns for emergency contacts
  const columns: TableColumn<EmergencyContact>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "contactName",
      label: "Contact Name",
      sortable: true,
    },
    {
      key: "contactPhone",
      label: "Contact Phone",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const contactData: EmergencyContact[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Emergency Contacts Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={contactData}
          emptyMessage="No emergency contacts found. Add new contacts to get started."
        />
      </div>
    </div>
  );
}
