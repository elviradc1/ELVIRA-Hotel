interface WellnessProps {
  searchValue: string;
}

export function Wellness({ searchValue }: WellnessProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Wellness & Spa Partners
      </h2>
      <p className="text-gray-500">
        Manage partnerships with wellness centers, spas, and health services.
      </p>
      {searchValue && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: "{searchValue}"
        </p>
      )}
    </div>
  );
}
