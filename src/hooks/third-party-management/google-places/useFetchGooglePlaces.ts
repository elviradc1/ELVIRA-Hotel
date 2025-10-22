import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import {
  fetchNearbyPlaces,
  fetchPlaceDetails,
  type GooglePlaceResult,
  type NearbySearchParams,
} from "../../../services/googlePlaces";
import type { Database } from "../../../types/database";

type ThirdPartyPlaceInsert =
  Database["public"]["Tables"]["thirdparty_places"]["Insert"];

interface FetchAndStorePlacesParams {
  searchParams: NearbySearchParams;
  category: string; // gastronomy, tours, wellness
}

/**
 * Map Google place types to our category
 */
function mapTypesToCategory(types: string[] = []): string {
  if (
    types.some((t) =>
      ["restaurant", "cafe", "bar", "bakery", "meal_takeaway"].includes(t)
    )
  ) {
    return "gastronomy";
  }
  if (
    types.some((t) =>
      ["travel_agency", "tourist_attraction", "point_of_interest"].includes(t)
    )
  ) {
    return "tours";
  }
  if (
    types.some((t) => ["gym", "spa", "beauty_salon", "hair_care"].includes(t))
  ) {
    return "wellness";
  }
  return "other";
}

/**
 * Transform Google Place to Supabase format
 */
function transformGooglePlaceToSupabase(
  place: GooglePlaceResult,
  category: string,
  apiResponse: any
): ThirdPartyPlaceInsert {
  return {
    google_place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    vicinity: place.vicinity,
    latitude: place.geometry?.location.lat,
    longitude: place.geometry?.location.lng,
    formatted_phone_number: place.formatted_phone_number,
    international_phone_number: undefined, // Will be fetched in details
    website: place.website,
    google_maps_url: place.url,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    price_level: place.price_level,
    types: place.types,
    category: category || mapTypesToCategory(place.types),
    business_status: place.business_status,
    opening_hours: place.opening_hours as any,
    photo_reference: place.photos?.[0]?.photo_reference,
    photos: place.photos as any,
    reviews: undefined, // Will be fetched in details if needed
    last_fetched_at: new Date().toISOString(),
    api_response: apiResponse,
  };
}

/**
 * Fetch places from Google Places API and store in thirdparty_places table
 */
export function useFetchAndStoreGooglePlaces() {
  return useMutation({
    mutationFn: async ({
      searchParams,
      category,
    }: FetchAndStorePlacesParams) => {
      // 1. Fetch from Google Places API
      const googlePlaces = await fetchNearbyPlaces(searchParams);

      if (googlePlaces.length === 0) {
        return { inserted: 0, updated: 0, skipped: 0, total: 0 };
      }

      let inserted = 0;
      let updated = 0;
      let skipped = 0;

      // 2. Process each place
      for (const place of googlePlaces) {
        // Check if place already exists
        const { data: existing } = await supabase
          .from("thirdparty_places")
          .select("id, last_fetched_at")
          .eq("google_place_id", place.place_id)
          .maybeSingle();

        const placeData = transformGooglePlaceToSupabase(
          place,
          category,
          { basic: place } // Store basic response
        );

        if (existing) {
          // Update if data is older than 7 days
          const lastFetched = new Date(existing.last_fetched_at!);
          const daysSinceUpdate =
            (Date.now() - lastFetched.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceUpdate > 7) {
            const { error } = await supabase
              .from("thirdparty_places")
              .update(placeData)
              .eq("id", existing.id);

            if (error) {
              console.error(`Error updating place ${place.name}:`, error);
            } else {
              updated++;
            }
          } else {
            skipped++;
          }
        } else {
          // Insert new place
          const { error } = await supabase
            .from("thirdparty_places")
            .insert(placeData);

          if (error) {
            console.error(`Error inserting place ${place.name}:`, error);
          } else {
            inserted++;
          }
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return {
        inserted,
        updated,
        skipped,
        total: googlePlaces.length,
      };
    },
  });
}
