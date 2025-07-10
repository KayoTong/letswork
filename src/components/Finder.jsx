import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7812, // Central Park, NY
  lng: -73.9665,
};

const TOILET_ICON = {
  url: '/ab5f9815d6fae731d31c800213f1d12a.webp',
  scaledSize: { width: 32, height: 32 },
};

export default function Finder() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBC4cfV8vdM3kOdqon_XJnWLCG1WXbBkQg',
    libraries: ['places'],
  });

  const [userLocation, setUserLocation] = useState(null);
  const [restrooms, setRestrooms] = useState([]);
  const [loadingRestrooms, setLoadingRestrooms] = useState(false);
  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const [directions, setDirections] = useState(null);
  const [directionsSteps, setDirectionsSteps] = useState([]);
  const [requestRoute, setRequestRoute] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const mapRef = useRef(null);

  // Fetch restrooms from Refuge Restrooms API
  const fetchRestrooms = (lat, lng, radiusMiles = 1) => {
    setLoadingRestrooms(true);
    fetch(`https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=50&offset=0&lat=${lat}&lng=${lng}&radius=${radiusMiles}`)
      .then(res => res.json())
      .then(data => {
        setRestrooms(data);
        setLoadingRestrooms(false);
      })
      .catch(() => setLoadingRestrooms(false));
  };

  // Fetch restrooms on map load or when user location changes
  useEffect(() => {
    const center = userLocation || defaultCenter;
    fetchRestrooms(center.lat, center.lng);
  }, [userLocation]);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Handle map click to set user location
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    clearRoute();
    setUserLocation({ lat, lng });
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
    fetchRestrooms(lat, lng);
  };

  // Handle Use My Location: always set to device location and clear search input and route
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearRoute();
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSearchInput(''); // Clear search input
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            mapRef.current.setZoom(15);
          }
          fetchRestrooms(latitude, longitude);
        },
        (error) => {
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Robust address search: always update user pin and map, even after using 'Use My Location', and clear route
  const handleSearch = () => {
    if (!searchInput.trim() || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        clearRoute();
        const location = results[0].geometry.location;
        const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
        const lng = typeof location.lng === 'function' ? location.lng() : location.lng;
        setUserLocation({ lat, lng });
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
        fetchRestrooms(lat, lng);
      } else {
        alert('Location not found. Please try a different address.');
      }
    });
  };

  // Handle Get Directions
  const handleGetDirections = (restroom) => {
    if (!userLocation) {
      alert('Please set your location first.');
      return;
    }
    setRequestRoute({
      origin: userLocation,
      destination: {
        lat: parseFloat(restroom.latitude),
        lng: parseFloat(restroom.longitude),
      },
      travelMode: 'WALKING',
    });
    setSelectedRestroom(restroom);
  };

  // Handle DirectionsService callback
  const directionsCallback = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      // Extract steps for sidebar
      const steps = result.routes[0].legs[0].steps.map((step) => ({
        instructions: step.instructions,
        distance: step.distance.text,
      }));
      setDirectionsSteps(steps);
    } else {
      setDirections(null);
      setDirectionsSteps([]);
      alert('Unable to calculate route.');
    }
  };

  // Clear route and directions
  const clearRoute = () => {
    setDirections(null);
    setDirectionsSteps([]);
    setRequestRoute(null);
    setSelectedRestroom(null);
  };

  return (
    <div className="finder-layout flex flex-col items-center w-full min-h-[80vh] bg-gray-100 py-8">
      <div className="main-flex-container flex flex-row w-full max-w-7xl bg-white rounded-2xl shadow-xl border overflow-hidden">
        {/* Sidebar */}
        <div className="sidebar flex flex-col gap-4 min-w-[260px] max-w-[340px] bg-[#f4f6fa] p-6">
          <h2 className="text-xl font-bold mb-2">Restroom Finder</h2>
          <img src="https://www.freeiconspng.com/thumbs/restroom-icon/man-and-women-restroom-icon-12.png" alt="Restroom Icon" className="w-12 mx-auto mb-4" />
          <input
            type="text"
            placeholder="Enter an address or location"
            className="mb-2 p-2 rounded border"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button onClick={handleSearch} className="bg-[#72b8f0] text-white font-bold py-2 px-4 rounded mb-2">Search</button>
          <button onClick={handleUseMyLocation} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-4">Use My Location</button>
          <div className="mb-2">
            <label htmlFor="distance-filter" className="block mb-1">Distance:</label>
            <select id="distance-filter" className="w-full p-2 rounded border">
              <option value="1609">1 mile</option>
              <option value="3218">2 miles</option>
              <option value="8047">5 miles</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="accessible-filter" className="block mb-1">Wheelchair Accessible:</label>
            <select id="accessible-filter" className="w-full p-2 rounded border">
              <option value="any">Any</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div id="restroom-list" className="flex-1 overflow-y-auto mt-2">
            {loadingRestrooms ? (
              <p className="text-gray-500">Loading restrooms...</p>
            ) : restrooms.length === 0 ? (
              <p className="text-gray-500">No restrooms found nearby.</p>
            ) : (
              <ul>
                {restrooms.slice(0, 5).map((restroom, idx) => (
                  <li key={idx} className="mb-4">
                    <h4 className="font-semibold">{restroom.name || 'Public Restroom'}</h4>
                    <p className="text-sm">{restroom.street || 'Address not available'}</p>
                    {restroom.accessible && <span className="text-green-600 text-xs">♿ Accessible</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Map */}
        <div className="map-area flex-1 min-w-[400px] h-[600px] relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation || defaultCenter}
              zoom={14}
              onLoad={onMapLoad}
              onClick={handleMapClick}
            >
              {/* User location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: { width: 40, height: 40 },
                  }}
                />
              )}
              {/* Restroom markers */}
              {restrooms.map((restroom, idx) => (
                <Marker
                  key={idx}
                  position={{ lat: parseFloat(restroom.latitude), lng: parseFloat(restroom.longitude) }}
                  icon={TOILET_ICON}
                  title={restroom.name || 'Public Restroom'}
                  onClick={() => setSelectedRestroom(restroom)}
                />
              ))}
              {/* InfoWindow for selected restroom */}
              {selectedRestroom && (
                <InfoWindow
                  position={{
                    lat: parseFloat(selectedRestroom.latitude),
                    lng: parseFloat(selectedRestroom.longitude),
                  }}
                  onCloseClick={() => setSelectedRestroom(null)}
                >
                  <div className="min-w-[180px]">
                    <h3 className="font-bold mb-1 text-base">{selectedRestroom.name || 'Public Restroom'}</h3>
                    <p className="text-xs mb-1">{selectedRestroom.street || 'Address not available'}</p>
                    {selectedRestroom.accessible && (
                      <div className="text-green-600 text-xs mb-2">♿ Accessible</div>
                    )}
                    <button
                      className="bg-[#267373] text-white px-3 py-1 rounded text-sm font-semibold hover:bg-[#145454] transition"
                      onClick={() => handleGetDirections(selectedRestroom)}
                    >
                      Get Directions
                    </button>
                  </div>
                </InfoWindow>
              )}
              {/* Directions rendering */}
              {requestRoute && (
                <DirectionsService
                  options={requestRoute}
                  callback={directionsCallback}
                  onLoad={() => setRequestRoute(null)}
                />
              )}
              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    suppressMarkers: true,
                    polylineOptions: { strokeColor: '#267373', strokeWeight: 5 },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-full">Loading map...</div>
          )}
        </div>
        {/* Directions Panel */}
        <div className="directions-panel min-w-[260px] max-w-[340px] bg-[#eaf6fb] p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Directions</h3>
            {directions && (
              <button
                onClick={clearRoute}
                className="ml-2 px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm font-semibold hover:bg-gray-400 transition"
              >
                Clear Route
              </button>
            )}
          </div>
          <ul id="directions-list" className="text-gray-700">
            {directionsSteps.length === 0 ? (
              <li>Directions will appear here.</li>
            ) : (
              directionsSteps.map((step, idx) => (
                <li key={idx} className="mb-2">
                  <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
                  <div className="text-xs text-gray-500">{step.distance}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 