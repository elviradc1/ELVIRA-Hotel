import { RestaurantsTable } from "./components";

interface RestaurantsProps {
  searchValue: string;
}

export function Restaurants({ searchValue }: RestaurantsProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Restaurant Management
      </h2>
      <p className="text-gray-500">
        Manage restaurant information, operating hours, and settings.
      </p>

      <RestaurantsTable searchValue={searchValue} />
    </div>
  );
}
