// Third-party places management (hotel-specific approved places)
export {
  useThirdPartyPlaces as useApprovedThirdPartyPlaces,
  useCurrentHotelThirdPartyPlaces,
  useThirdPartyPlacesByType,
  useCreateThirdPartyPlace,
  useUpdateThirdPartyPlace,
  useDeleteThirdPartyPlace as useDeleteApprovedThirdPartyPlace,
  useToggleThirdPartyPlaceRecommended,
} from "./third-party-places/useThirdPartyPlaces";

// Google Places API integration
export { useFetchAndStoreGooglePlaces } from "./google-places";

// Third-party places data (cached Google Places data)
export {
  useThirdPartyPlaces,
  useThirdPartyPlaceByGoogleId,
  useSearchThirdPartyPlaces,
  useNearbyThirdPartyPlaces,
  useDeleteThirdPartyPlace,
  useRefreshThirdPartyPlace,
} from "./thirdparty-places";
