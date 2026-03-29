export async function getLocationName(lat: number, lng: number) {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token) return 'Unknown location';

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`
  );

  if (!res.ok) return 'Unknown location';

  const data = await res.json();
  return data.features?.[0]?.place_name || 'Unknown location';
}
