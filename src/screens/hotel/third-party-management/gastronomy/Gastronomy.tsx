import { useState } from "react";
import { Button, Table } from "../../../../components/ui";
import { useThirdPartyPlaces } from "../../../../hooks/third-party-management";
import { FetchGooglePlacesModal } from "../components";

interface GastronomyProps {
  searchValue: string;
}

export function Gastronomy({ searchValue }: GastronomyProps) {
  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const { data: places, isLoading } = useThirdPartyPlaces("gastronomy");

  // Filter places based on search
  const filteredPlaces = places?.filter((place) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      place.name.toLowerCase().includes(searchLower) ||
      place.formatted_address?.toLowerCase().includes(searchLower) ||
      place.vicinity?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Gastronomy Partners
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Restaurants, cafes, and food establishments from Google Places
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsFetchModalOpen(true)}>
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Fetch from Google
        </Button>
      </div>

      {/* Search Info */}
      {searchValue && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for:{" "}
          <span className="font-medium">"{searchValue}"</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!filteredPlaces || filteredPlaces.length === 0) && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchValue ? "No results found" : "No places yet"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchValue
              ? "Try a different search term"
              : "Click 'Fetch from Google' to import restaurants and cafes"}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && filteredPlaces && filteredPlaces.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Address</Table.Head>
              <Table.Head>Rating</Table.Head>
              <Table.Head>Price Level</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPlaces.map((place) => (
              <Table.Row key={place.id}>
                <Table.Cell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {place.name}
                    </div>
                    {place.types && place.types.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {place.types.slice(0, 2).join(", ")}
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {place.formatted_address || place.vicinity || "-"}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {place.rating ? (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {place.rating}
                      </span>
                      {place.user_ratings_total && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({place.user_ratings_total})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {place.price_level !== null &&
                  place.price_level !== undefined ? (
                    <span className="text-sm">
                      {"$".repeat(place.price_level || 1)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      place.business_status === "OPERATIONAL"
                        ? "bg-green-100 text-green-800"
                        : place.business_status === "CLOSED_TEMPORARILY"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {place.business_status || "Unknown"}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (place.google_maps_url) {
                        window.open(place.google_maps_url, "_blank");
                      }
                    }}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Fetch Modal */}
      <FetchGooglePlacesModal
        isOpen={isFetchModalOpen}
        onClose={() => setIsFetchModalOpen(false)}
        placeType="gastronomy"
      />
    </div>
  );
}
