interface ToursProps {
  searchValue: string;
}

export function Tours({ searchValue }: ToursProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Tours & Excursions
      </h2>
      <p className="text-gray-500">
        Manage partnerships with tour operators and excursion providers.
      </p>
      {searchValue && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: "{searchValue}"
        </p>
      )}
    </div>
  );
}
