import { LocationClient, SearchPlaceIndexForPositionCommand } from '@aws-sdk/client-location';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
const INDEX_NAME = process.env.LOCATION_INDEX_NAME || 'IndoHoodPlaceIndex';

let locationClient = null;

function getLocationClient() {
  if (!locationClient) {
    locationClient = new LocationClient({ region: REGION });
  }
  return locationClient;
}

/**
 * Reverse-geocodes GPS (lat, lng) into Indian municipal localities using Amazon Location Service (Esri).
 * Falls back to OpenStreetMap if AWS is unreachable.
 * 
 * @param {Object} coords - { latitude, longitude }
 * @returns {Promise<Object>} Formatted location data
 */
export async function reverseGeocodeCoordinates({ latitude, longitude }) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Valid latitude and longitude are required');
  }

  // 1. Primary: Amazon Location Service (Place Index)
  try {
    const client = getLocationClient();
    // In GeoJSON / Amazon Location Service, Position is [Longitude, Latitude]
    const command = new SearchPlaceIndexForPositionCommand({
      IndexName: INDEX_NAME,
      Position: [lon, lat],
      MaxResults: 1,
    });

    const response = await client.send(command);
    const place = response.Results?.[0]?.Place;

    if (place) {
      const subMuni = place.SubMunicipality || '';
      const muni = place.Municipality || '';
      const subReg = place.SubRegion || '';
      const reg = place.Region || '';
      const postal = place.PostalCode || '';
      const label = place.Label || '';

      // Determine the best clean neighborhood display name for Leaderboards
      let areaDisplayName = '';
      if (subMuni && muni && subMuni.toLowerCase() !== muni.toLowerCase()) {
        areaDisplayName = `${subMuni}, ${muni}`;
      } else if (subMuni) {
        areaDisplayName = subMuni;
      } else if (muni) {
        areaDisplayName = muni;
      } else if (subReg) {
        areaDisplayName = subReg;
      } else {
        areaDisplayName = reg || 'Area';
      }

      return {
        success: true,
        source: 'aws_location_service',
        indexName: INDEX_NAME,
        data: {
          areaDisplayName,
          subMunicipality: subMuni,
          municipality: muni,
          subRegion: subReg,
          region: reg,
          postalCode: postal,
          fullAddress: label || `${areaDisplayName}, ${reg}`,
          coordinates: { lat, lng: lon },
        },
      };
    }
  } catch (awsErr) {
    console.warn('[Location Service] Amazon Location Service search failed, attempting fallback:', awsErr.message);
  }

  // 2. Fallback: OpenStreetMap Nominatim for offline / non-AWS local testing
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'IndoHood-App/1.0 (contact@indohood.org)',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const sub = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || '';
      const city = addr.city || addr.town || addr.city_district || addr.county || '';
      const state = addr.state || '';

      let areaDisplayName = '';
      if (sub && city && sub.toLowerCase() !== city.toLowerCase()) {
        areaDisplayName = `${sub}, ${city}`;
      } else if (sub) {
        areaDisplayName = sub;
      } else if (city) {
        areaDisplayName = city;
      } else {
        areaDisplayName = state || 'Area';
      }

      return {
        success: true,
        source: 'osm_fallback',
        data: {
          areaDisplayName,
          subMunicipality: sub,
          municipality: city,
          subRegion: addr.county || '',
          region: state,
          postalCode: addr.postcode || '',
          fullAddress: osmData.display_name || `${areaDisplayName}, ${state}`,
          coordinates: { lat, lng: lon },
        },
      };
    }
  } catch (fallbackErr) {
    console.warn('[Location Service] Fallback reverse geocoding failed:', fallbackErr.message);
  }

  // Baseline fallback if both fail
  return {
    success: true,
    source: 'coordinate_baseline',
    data: {
      areaDisplayName: 'Local Sector',
      subMunicipality: 'Local Sector',
      municipality: 'Metro Area',
      subRegion: '',
      region: 'India',
      postalCode: '',
      fullAddress: `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      coordinates: { lat, lng: lon },
    },
  };
}
