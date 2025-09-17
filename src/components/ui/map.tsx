/**
 * MAP.TSX - INTERACTIVE MAP COMPONENT WITH MAPBOX
 * ==============================================
 * 
 * Kipengele cha ramani ya mwingiliano kwa kutumia Mapbox - Interactive map component using Mapbox
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays interactive map using Mapbox GL JS (Kuonyesha ramani ya mwingiliano kwa kutumia Mapbox)
 * - Shows property location with marker (Kuonyesha mahali pa nyumba na alama)
 * - Supports zoom and pan interactions (Kusaidia kukuza na kusonga)
 * - Geocoding support for address to coordinates (Msaada wa geocoding kwa anwani hadi kuratibu)
 * 
 * FEATURES / VIPENGELE:
 * - Mapbox GL JS for high-quality maps (Mapbox GL JS kwa ramani za ubora wa juu)
 * - Custom markers for properties (Alama maalum kwa nyumba)
 * - Responsive design (Muundo unaojibu)
 * - Loading states (Hali za kupakia)
 * - Error handling for failed geocoding (Kushughulikia makosa ya geocoding)
 */

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - you'll need to get this from https://mapbox.com
// For development, you can use Mapbox's public token or create a free account
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaW52ZXN0b3IwMTIiLCJhIjoiY21kanI1eG16MG9vNTJpcXRnbXZpeXQ2aCJ9.YscR4sCydGxr8XSn_EMZdg';

/**
 * COORDINATE INTERFACE
 * ===================
 * 
 * Defines the structure for geographic coordinates
 */
interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * MAP COMPONENT PROPS
 * ==================
 * 
 * Defines the props interface for the Map component
 */
interface MapProps {
  /** Property location string (e.g., "Mikocheni, Dar es Salaam") */
  location: string;
  /** Property title for marker popup */
  title: string;
  /** Optional custom coordinates (if known) */
  coordinates?: Coordinates;
  /** Map height class (default: h-64) */
  height?: string;
  /** Whether to show loading state */
  loading?: boolean;
}

/**
 * GEOCODING FUNCTION
 * =================
 * 
 * Converts address string to coordinates using Mapbox Geocoding API
 * 
 * @param address - The address to geocode
 * @returns Promise with coordinates or null if failed
 */
const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    // Enhanced search query for better accuracy - prioritize specific areas
    const addressParts = address.split(',').map(part => part.trim());
    
    // Try searching for the most specific part first (usually the first part)
    let searchQuery = address;
    if (addressParts.length > 1) {
      // For "Iyunga, Mbeya" - search for "Iyunga, Mbeya, Tanzania"
      searchQuery = address;
    }
    
    const hasCountry = address.toLowerCase().includes('tanzania') || address.toLowerCase().includes('tz');
    if (!hasCountry) {
      searchQuery = `${searchQuery}, Tanzania`;
    }
    
    const encodedAddress = encodeURIComponent(searchQuery);
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=tz&limit=5&types=place,locality,neighborhood,address,poi`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      // Find the most specific result - prioritize exact matches for the first part of address
      let bestFeature = data.features[0];
      
      if (addressParts.length > 1) {
        const firstPart = addressParts[0].toLowerCase();
        
        // Look for features that match the specific area name
        for (const feature of data.features) {
          const featureName = feature.place_name?.toLowerCase() || '';
          const featureText = feature.text?.toLowerCase() || '';
          
          // Prefer exact matches for the specific area
          if (featureText === firstPart || featureName.includes(firstPart)) {
            bestFeature = feature;
            console.log(`Found specific area match: ${feature.place_name}`);
            break;
          }
        }
      }
      
      // If no specific match found, prefer more specific place types
      for (const feature of data.features) {
        if (feature.place_type?.includes('neighborhood') || 
            feature.place_type?.includes('locality') ||
            feature.place_type?.includes('address')) {
          bestFeature = feature;
          break;
        }
      }
      
      const [lng, lat] = bestFeature.center;
      console.log(`Geocoded "${address}" to coordinates: ${lat}, ${lng} (${bestFeature.place_name})`);
      return { lat, lng };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * DEFAULT COORDINATES FOR TANZANIA
 * ===============================
 * 
 * Fallback coordinates for major Tanzanian cities
 * Used when geocoding fails or for quick display
 */
const DEFAULT_COORDINATES: Record<string, Coordinates> = {
  // Major cities
  'dar es salaam': { lat: -6.7924, lng: 39.2083 },
  'dodoma': { lat: -6.1630, lng: 35.7516 },
  'arusha': { lat: -3.3869, lng: 36.6830 },
  'mwanza': { lat: -2.5164, lng: 32.9175 },
  'zanzibar': { lat: -6.1659, lng: 39.2026 },
  'mbeya': { lat: -8.9094, lng: 33.4607 },
  'morogoro': { lat: -6.8235, lng: 37.6536 },
  'tanga': { lat: -5.0692, lng: 39.0962 },
  'iringa': { lat: -7.7669, lng: 35.6975 },
  'songea': { lat: -10.6840, lng: 35.6503 },
  'musoma': { lat: -1.5000, lng: 33.8000 },
  'tabora': { lat: -5.0167, lng: 32.8000 },
  'kigoma': { lat: -4.8774, lng: 29.6267 },
  'bukoba': { lat: -1.3314, lng: 31.8120 },
  'shinyanga': { lat: -3.6639, lng: 33.4218 },
  'singida': { lat: -4.8164, lng: 34.7536 },
  'lindi': { lat: -10.0000, lng: 39.7167 },
  'mtwara': { lat: -10.2692, lng: 40.1806 },
  
  // Dar es Salaam districts and areas
  'mikocheni': { lat: -6.7731, lng: 39.2294 },
  'kinondoni': { lat: -6.8296, lng: 39.2083 },
  'temeke': { lat: -6.8500, lng: 39.2833 },
  'ilala': { lat: -6.8167, lng: 39.2833 },
  'masaki': { lat: -6.7731, lng: 39.2731 },
  'oyster bay': { lat: -6.7500, lng: 39.2833 },
  'msimbazi': { lat: -6.8167, lng: 39.2667 },
  'kariakoo': { lat: -6.8167, lng: 39.2667 },
  'upanga': { lat: -6.8000, lng: 39.2833 },
  'magomeni': { lat: -6.8000, lng: 39.2500 },
  'sinza': { lat: -6.7500, lng: 39.2167 },
  'mbezi': { lat: -6.7000, lng: 39.2167 },
  'tegeta': { lat: -6.6833, lng: 39.2000 },
  'goba': { lat: -6.8833, lng: 39.3000 },
  'kigamboni': { lat: -6.8500, lng: 39.3167 },
  
  // Mbeya region specific areas
  'iyunga': { lat: -8.7667, lng: 33.4833 },
  'mbalizi': { lat: -8.9000, lng: 33.4000 },
  'tunduma': { lat: -9.3000, lng: 32.7667 },
  'kyela': { lat: -9.5333, lng: 33.8333 },
  'chunya': { lat: -8.5333, lng: 33.3000 },
  'vwawa': { lat: -8.6000, lng: 33.3333 },
  'rujewa': { lat: -8.8500, lng: 33.4500 },
  'itezi': { lat: -8.8000, lng: 33.5000 },
  'sisimba': { lat: -8.9500, lng: 33.3500 },
  
  // Arusha region areas
  'usa river': { lat: -3.3500, lng: 36.8500 },
  'tengeru': { lat: -3.3667, lng: 36.8167 },
  'njiro': { lat: -3.3833, lng: 36.6833 },
  'sakina': { lat: -3.3667, lng: 36.6833 },
  'ngaramtoni': { lat: -3.2833, lng: 36.7500 },
  'monduli': { lat: -3.3500, lng: 36.4667 },
  'karatu': { lat: -3.3333, lng: 35.7500 },
  
  // Mwanza region areas
  'nyamagana': { lat: -2.5167, lng: 32.9167 },
  'ilemela': { lat: -2.4833, lng: 32.9333 },
  'buzuruga': { lat: -2.5000, lng: 32.8833 },
  'kirumba': { lat: -2.5333, lng: 32.9000 },
  'igoma': { lat: -2.4667, lng: 32.9167 },
  
  // Iringa region areas
  'gangilonga': { lat: -7.7833, lng: 35.7000 },
  'kihesa': { lat: -7.7500, lng: 35.7167 },
  'makorongoni': { lat: -7.7667, lng: 35.6833 },
  
  // Morogoro region areas
  'mazimbu': { lat: -6.8000, lng: 37.6667 },
  'kingolwira': { lat: -6.8333, lng: 37.6500 },
  'boma': { lat: -6.8167, lng: 37.6667 },
  
  // Dodoma region areas
  'makutupora': { lat: -6.1500, lng: 35.7833 },
  'hombolo': { lat: -6.1000, lng: 35.8000 },
  'chamwino': { lat: -6.2000, lng: 35.7000 },
  
  // Tanga region areas
  'bombo': { lat: -5.0500, lng: 39.1000 },
  'chumbageni': { lat: -5.0833, lng: 39.0833 },
  'makorora': { lat: -5.0667, lng: 39.0667 },
  
  // Zanzibar areas
  'stone town': { lat: -6.1622, lng: 39.1921 },
  'ng\'ambo': { lat: -6.1500, lng: 39.2167 },
  'michenzani': { lat: -6.1333, lng: 39.2333 },
  'fuoni': { lat: -6.1167, lng: 39.2500 },
  'jang\'ombe': { lat: -6.1833, lng: 39.2167 }
};

/**
 * GET DEFAULT COORDINATES FUNCTION
 * ===============================
 * 
 * Attempts to find default coordinates for known locations
 * 
 * @param location - Location string to search
 * @returns Coordinates if found, null otherwise
 */
const getDefaultCoordinates = (location: string): Coordinates | null => {
  const normalizedLocation = location.toLowerCase();
  
  // Split location by comma and check each part for specific areas first
  const locationParts = normalizedLocation.split(',').map(part => part.trim());
  
  // First, check for specific areas/neighborhoods (highest priority)
  for (const [key, coords] of Object.entries(DEFAULT_COORDINATES)) {
    for (const part of locationParts) {
      // Exact match for specific areas (like "iyunga", "mikocheni", etc.)
      if (part === key) {
        // Found exact match for specific area
        return coords;
      }
    }
  }
  
  // Second, check for partial matches within each part
  for (const part of locationParts) {
    for (const [key, coords] of Object.entries(DEFAULT_COORDINATES)) {
      if (part.includes(key) && key.length > 3) { // Avoid matching very short words
        // Found partial match for area
        return coords;
      }
    }
  }
  
  // Third, check for city-level matches (lowest priority)
  for (const [key, coords] of Object.entries(DEFAULT_COORDINATES)) {
    if (normalizedLocation.includes(key) && ['dar es salaam', 'dodoma', 'arusha', 'mwanza', 'mbeya', 'zanzibar'].includes(key)) {
      // Found city-level match
      return coords;
    }
  }
  
  return null;
};

/**
 * MAP COMPONENT
 * ============
 * 
 * Main interactive map component that displays property location
 * with marker and popup information using Mapbox GL JS
 */
const Map: React.FC<MapProps> = ({ 
  location, 
  title, 
  coordinates: providedCoordinates,
  height = 'h-64',
  loading = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [coordinates, setCoordinates] = useState<Coordinates | null>(providedCoordinates || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * COORDINATE RESOLUTION EFFECT
   * ===========================
   * 
   * Resolves coordinates for the given location using multiple strategies:
   * 1. Use provided coordinates if available
   * 2. Try default coordinates for known locations
   * 3. Use geocoding service as fallback
   */
  useEffect(() => {
    const resolveCoordinates = async () => {
      // If coordinates are already provided, use them
      if (providedCoordinates) {
        setCoordinates(providedCoordinates);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Resolving coordinates for location
        
        // First, try to get default coordinates for known locations
        const defaultCoords = getDefaultCoordinates(location);
        if (defaultCoords) {
          // Using default coordinates
          setCoordinates(defaultCoords);
          setIsLoading(false);
          return;
        }

        // No default coordinates found, trying geocoding
        
        // If no default coordinates, try geocoding
        const geocodedCoords = await geocodeAddress(location);
        if (geocodedCoords) {
          // Successfully geocoded
          setCoordinates(geocodedCoords);
        } else {
          // Geocoding failed, using Dar es Salaam fallback
          // Fallback to Dar es Salaam center if all else fails
          setCoordinates(DEFAULT_COORDINATES['dar es salaam']);
          setError('Mahali halisi halijulikana, tunaonyesha eneo la karibu. Jaribu kutumia jina la eneo au kata.');
        }
      } catch (err) {
        // Error resolving coordinates
        setCoordinates(DEFAULT_COORDINATES['dar es salaam']);
        setError('Imeshindikana kupata mahali halisi. Hakikisha umeme na mtandao upo.');
      } finally {
        setIsLoading(false);
      }
    };

    resolveCoordinates();
  }, [location, providedCoordinates]);

  /**
   * MAP INITIALIZATION EFFECT
   * ========================
   * 
   * Initializes the Mapbox map when coordinates are available
   */
  useEffect(() => {
    if (!coordinates || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 15,
      attributionControl: true
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create custom marker
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = '#ea6d32';
    markerElement.style.border = '3px solid white';
    markerElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    markerElement.style.cursor = 'pointer';

    // Add marker to map
    marker.current = new mapboxgl.Marker(markerElement)
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold; color: #1f2937;">${title}</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px; display: flex; align-items: center;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${location}
              </p>
            </div>
          `)
      )
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [coordinates, title, location]);

  /**
   * RETRY GEOCODING FUNCTION
   * =======================
   * 
   * Allows user to retry geocoding if it failed initially
   */
  const retryGeocoding = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const geocodedCoords = await geocodeAddress(location);
      if (geocodedCoords) {
        setCoordinates(geocodedCoords);
        setError(null);
      } else {
        setError('Mahali halijulikana, tunaonyesha eneo la karibu');
      }
    } catch (err) {
      setError('Imeshindikana kupata mahali halisi');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LOADING STATE RENDER
   * ===================
   * 
   * Shows loading spinner while coordinates are being resolved
   */
  if (loading || isLoading) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <div className="text-sm">Inapakia ramani...</div>
        </div>
      </div>
    );
  }

  /**
   * ERROR STATE RENDER
   * ==================
   * 
   * Shows error message with retry option if coordinates couldn't be resolved
   */
  if (!coordinates) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500 p-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <div className="text-sm mb-2">Imeshindikana kupakia ramani</div>
          <Button size="sm" variant="outline" onClick={retryGeocoding}>
            Jaribu Tena
          </Button>
        </div>
      </div>
    );
  }

  /**
   * MAIN MAP RENDER
   * ==============
   * 
   * Renders the interactive Mapbox map with marker and popup
   */
  return (
    <div className="space-y-2">
      <div className={`${height} rounded-lg overflow-hidden border border-gray-200`}>
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        />
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="text-xs text-orange-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
      
      {/* Coordinates display for debugging (can be removed in production) */}
      <div className="text-xs text-gray-500">
        📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
      </div>
    </div>
  );
};

export default Map;