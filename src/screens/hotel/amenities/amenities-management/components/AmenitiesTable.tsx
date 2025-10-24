import { useMemo } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
  RecommendedToggle,
} from "../../../../../components/ui";
import {
  useAmenities,
  useUpdateAmenity,
  useDeleteAmenity,
} from "../../../../../hooks/amenities/amenities/useAmenities";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import { usePagination } from "../../../../../hooks";
import { AmenityModal } from "./amenity-modal";
import { useItemTableModals } from "../../../../../components/shared/tables/useItemTableModals";
import type { Database } from "../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface Amenity extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  imageUrl: string | null;
  amenity: string;
  category: string;
  price: string;
  hotelRecommended: boolean | null;
}

interface AmenitiesTableProps {
  searchValue: string;
}

export function AmenitiesTable({ searchValue }: AmenitiesTableProps) {
  const hotelId = useHotelId();

  // Use shared modal state management hook
  const {
    selectedItem: selectedAmenity,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    itemToEdit: amenityToEdit,
    isEditModalOpen,
    closeEditModal,
    itemToDelete: amenityToDelete,
    isDeleteConfirmOpen,
    closeDeleteConfirm,
    handleEdit,
    handleDelete,
  } = useItemTableModals<AmenityRow>();

  // Fetch amenities using the hook
  const {
    data: amenities,
    isLoading,
    error,
  } = useAmenities(hotelId || undefined);

  // Get the mutations
  const updateAmenity = useUpdateAmenity();
  const deleteAmenity = useDeleteAmenity();

  // Handle status toggle
  const handleStatusToggle = async (id: string, newStatus: boolean) => {
    await updateAmenity.mutateAsync({
      id,
      updates: { is_active: newStatus },
    });
  };

  // Handle row click
  const handleRowClick = (row: Amenity) => {
    const fullAmenity = amenities?.find((item) => item.id === row.id);
    if (fullAmenity) {
      openDetailModal(fullAmenity);
    }
  };

  // Edit and delete handlers are now provided by the hook

  // Confirm delete action
  const confirmDelete = () => {
    if (amenityToDelete && hotelId) {
      deleteAmenity.mutate(
        { id: amenityToDelete.id, hotelId },
        {
          onSuccess: () => {
            closeDeleteConfirm();
          },
        }
      );
    }
  };

  // Define table columns for amenities
  const amenityColumns: TableColumn<Amenity>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={(newStatus) => handleStatusToggle(row.id, newStatus)}
        />
      ),
    },
    {
      key: "imageUrl",
      label: "Image",
      sortable: false,
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt="Amenity"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "amenity",
      label: "Amenity",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <span>{row.amenity}</span>
          <RecommendedToggle
            isRecommended={row.hotelRecommended || false}
            onToggle={() => {
              updateAmenity.mutate({
                id: row.id,
                updates: { recommended: !row.hotelRecommended },
              });
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const amenityData: Amenity[] = useMemo(() => {
    if (!amenities) {
      return [];
    }

    return amenities
      .filter((amenity: AmenityRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          amenity.name.toLowerCase().includes(search) ||
          amenity.category.toLowerCase().includes(search) ||
          (amenity.description &&
            amenity.description.toLowerCase().includes(search))
        );
      })
      .map((amenity: AmenityRow) => ({
        id: amenity.id,
        status: amenity.is_active ? "Active" : "Inactive",
        isActive: amenity.is_active,
        imageUrl: amenity.image_url,
        amenity: amenity.name,
        category: amenity.category,
        price: `$${amenity.price.toFixed(2)}`,
        hotelRecommended: amenity.recommended,
      }));
  }, [amenities, searchValue]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<Amenity>({ data: amenityData, itemsPerPage: 10 });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading amenities: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {amenityData.length} result(s)
        </p>
      )}

      {/* Amenities Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={amenityColumns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No amenities found matching "${searchValue}".`
              : "No amenities found. Add new amenities to get started."
          }
          onRowClick={handleRowClick}
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={amenityData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Unified Amenity Modal - handles view, edit, and create */}
      <AmenityModal
        isOpen={isDetailModalOpen || isEditModalOpen}
        onClose={() => {
          closeDetailModal();
          closeEditModal();
        }}
        amenity={selectedAmenity || amenityToEdit}
        mode={isDetailModalOpen ? "view" : "edit"}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Amenity"
        message="Are you sure you want to delete this amenity? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onClose={closeDeleteConfirm}
        loading={deleteAmenity.isPending}
      />
    </div>
  );
}
