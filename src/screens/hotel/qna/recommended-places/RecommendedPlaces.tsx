import { RecommendedPlacesTable } from "./components";

interface RecommendedPlacesProps {
  searchValue: string;
}

export function RecommendedPlaces({ searchValue }: RecommendedPlacesProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recommended Places
      </h2>
      <p className="text-gray-500">
        Manage recommended places and attractions for hotel guests.
      </p>

      <RecommendedPlacesTable searchValue={searchValue} />
    </div>
  );
}
