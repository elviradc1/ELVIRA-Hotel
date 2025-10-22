import { useState } from "react";
import { RestaurantsTable, AddRestaurantModal } from "./components";
import { Button } from "../../../../components/ui";

interface RestaurantsProps {
  searchValue: string;
}

export function Restaurants({ searchValue }: RestaurantsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Restaurant Management
          </h2>
          <p className="text-gray-500">
            Manage restaurant information, operating hours, and settings.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
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
          Add Restaurant
        </Button>
      </div>

      <RestaurantsTable searchValue={searchValue} />

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
