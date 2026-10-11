import { api } from '../services/api';

/**
 * Requests GPS location from browser and reverse geocodes via IndoHood API (Amazon Location Service)
 * with graceful fallback.
 * 
 * @returns {Promise<{ areaDisplayName: string, fullAddress: string, coordinates: { lat: number, lng: number } }>}
 */
export async function detectCurrentLocation() {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const result = await api.reverseGeocode({ latitude, longitude });
          if (result && result.areaDisplayName) {
            resolve({
              areaDisplayName: result.areaDisplayName,
              fullAddress: result.fullAddress || result.areaDisplayName,
              coordinates: { lat: latitude, lng: longitude },
              source: 'aws_location_service',
            });
            return;
          }
        } catch (apiErr) {
          console.warn('[Location] API call failed, falling back to OSM:', apiErr);
        }

        // Direct browser fallback if API fails
        try {
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          if (osmRes.ok) {
            const data = await osmRes.json();
            const addr = data.address || {};
            const sub = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || '';
            const city = addr.city || addr.town || addr.state || 'Local Sector';
            const areaDisplayName = sub ? `${sub}, ${city}` : city;
            resolve({
              areaDisplayName,
              fullAddress: data.display_name || areaDisplayName,
              coordinates: { lat: latitude, lng: longitude },
              source: 'osm_fallback',
            });
            return;
          }
        } catch (e) {
          console.warn('[Location] Direct OSM fallback failed:', e);
        }

        // Baseline fallback with coords
        resolve({
          areaDisplayName: 'Local Sector',
          fullAddress: `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          coordinates: { lat: latitude, lng: longitude },
          source: 'baseline',
        });
      },
      (err) => {
        let msg = 'Could not access location';
        if (err.code === 1) msg = 'Location permission denied. Please enable location permissions in your browser.';
        else if (err.code === 2) msg = 'Location unavailable. Please check your device GPS.';
        else if (err.code === 3) msg = 'Location request timed out.';
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
