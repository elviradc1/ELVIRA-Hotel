interface GastronomyProps {
  searchValue: string;
}

export function Gastronomy({ searchValue }: GastronomyProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Gastronomy Partners
      </h2>
      <p className="text-gray-500">
        Manage partnerships with local restaurants and food delivery services.
      </p>
      {searchValue && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: "{searchValue}"
        </p>
      )}
    </div>
  );
}
