import { Table, type TableColumn } from "../../../../../components/ui";
import { usePagination } from "../../../../../hooks";

interface RecommendedPlace extends Record<string, unknown> {
  id: string;
  status: string;
  place: string;
  address: string;
  description: string;
  created: string;
}

interface RecommendedPlacesTableProps {
  searchValue: string;
}

export function RecommendedPlacesTable({
  searchValue,
}: RecommendedPlacesTableProps) {
  // Define table columns for recommended places
  const columns: TableColumn<RecommendedPlace>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "place",
      label: "Place",
      sortable: true,
    },
    {
      key: "address",
      label: "Address",
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
  const placesData: RecommendedPlace[] = [];

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<RecommendedPlace>({
    data: placesData,
    itemsPerPage: 10,
  });

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Recommended Places Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          emptyMessage="No recommended places found. Add new places to get started."
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={placesData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
