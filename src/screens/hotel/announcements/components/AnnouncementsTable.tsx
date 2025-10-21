import { Table, type TableColumn } from "../../../../components/ui";

interface Announcement extends Record<string, unknown> {
  id: string;
  status: string;
  title: string;
  description: string;
  created: string;
}

interface AnnouncementsTableProps {
  searchValue: string;
}

export function AnnouncementsTable({ searchValue }: AnnouncementsTableProps) {
  // Define table columns for announcements
  const columns: TableColumn<Announcement>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const announcementData: Announcement[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Announcements Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={announcementData}
          emptyMessage="No announcements found. Create new announcements to get started."
        />
      </div>
    </div>
  );
}
