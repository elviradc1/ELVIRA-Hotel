import { useState } from "react";
import { RestaurantsTable, AddRestaurantModal } from "./components";
import { ManagementPageHeader } from "../../../../components/shared";
import type { Database } from "../../../../types/database";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface RestaurantsProps {
  searchValue: string;
}

export function Restaurants({ searchValue }: RestaurantsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);

  const handleEdit = (restaurant: Restaurant) => {
    setEditRestaurant(restaurant);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditRestaurant(null);
  };

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Restaurant Management"
        description="Manage restaurant information, operating hours, and settings."
        buttonLabel="Add Restaurant"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <RestaurantsTable searchValue={searchValue} onEdit={handleEdit} />

      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editData={editRestaurant}
      />
    </div>
  );
}
