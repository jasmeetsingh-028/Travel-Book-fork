import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMap = ({ locations = [], location, title = "Travel Locations", className = "" }) => {
  const [coordinates, setCoordinates] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Process locations coming from different props
  const locationsToProcess = React.useMemo(() => {
    // If a single location string is passed
    if (location && typeof location === 'string') {
      return [location];
    }
    // If an array of location strings is passed via locations prop
    else if (Array.isArray(locations) && locations.length > 0) {
      return locations;
    }
    // No valid location data
    return [];
  }, [location, locations]);

  useEffect(() => {
    if (locationsToProcess.length === 0) {
      setIsLoading(false);
      return;
    }

    // Function to get coordinates from location names
    const fetchCoordinates = async () => {
      try {
        const coordPromises = locationsToProcess.map(async (location) => {
          try {
            const encodedLocation = encodeURIComponent(location);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`
            );
            const data = await response.json();
            
            if (data && data[0]) {
              return {
                name: location,
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching coordinates for ${location}:`, err);
            return null;
          }
        });

        const results = await Promise.all(coordPromises);
        const validCoordinates = results.filter(coord => coord !== null);
        setCoordinates(validCoordinates);
      } catch (err) {
        console.error("Error fetching coordinates:", err);
        setError("Failed to load map data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [locationsToProcess]);

  // Calculate center coordinates based on the average of all points
  const center = React.useMemo(() => {
    if (coordinates.length === 0) return [20, 0]; // Default to a global view
    
    const sumLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
    const sumLon = coordinates.reduce((sum, coord) => sum + coord.lon, 0);
    
    return [sumLat / coordinates.length, sumLon / coordinates.length];
  }, [coordinates]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (coordinates.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-300">No location data available</p>
      </div>
    );
  }

  return (
    <div className={className || "mt-6"}>
      {title && <h3 className="text-lg font-medium mb-2 dark:text-white">{title}</h3>}
      <div className={(className ? "" : "h-64") + " rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"}>
        <MapContainer 
          center={center} 
          zoom={coordinates.length === 1 ? 10 : 2} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coordinates.map((coord, index) => (
            <Marker key={index} position={[coord.lat, coord.lon]}>
              <Popup>{coord.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;