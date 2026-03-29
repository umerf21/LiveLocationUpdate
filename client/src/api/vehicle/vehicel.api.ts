import axios from 'axios';

/** Mapbox Geocoding API v5 — reverse geocode (coordinates → place). */
export const MAPBOX_GEOCODING_ENDPOINT =
  'https://api.mapbox.com/geocoding/v5/mapbox.places' as const;

interface MapboxGeocodeResponse {
  features?: { place_name?: string }[];
}

export async function getLocationName(lat: number, lng: number): Promise<string> {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token) return 'Unknown location';

  const path = `${lng},${lat}.json`;
  const url = `${MAPBOX_GEOCODING_ENDPOINT}/${path}`;

  try {
    const { data } = await axios.get<MapboxGeocodeResponse>(url, {
      params: { access_token: token },
    });
    return data.features?.[0]?.place_name ?? 'Unknown location';
  } catch {
    return 'Unknown location';
  }
}
