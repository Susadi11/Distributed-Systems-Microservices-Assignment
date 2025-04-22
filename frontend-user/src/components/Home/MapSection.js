import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";

// Initialize Mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export function MapSection() {
    const [userLocation, setUserLocation] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    useEffect(() => {
        // Initialize map only when container is available
        if (mapContainer.current && !map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [0, 0], // Default center
                zoom: 1, // Default zoom
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

            // Cleanup on unmount
            return () => {
                if (map.current) {
                    map.current.remove();
                    map.current = null;
                }
            };
        }
    }, []);

    useEffect(() => {
        // Update map when user location changes
        if (map.current && userLocation) {
            map.current.flyTo({
                center: [userLocation.longitude, userLocation.latitude],
                essential: true,
            });

            // Remove existing marker if it exists
            if (marker.current) {
                marker.current.remove();
            }

            // Create custom marker element
            const el = document.createElement("div");
            el.className = "custom-marker";
            el.innerHTML = `
        <div class="relative">
          <div class="absolute animate-ping h-8 w-8 rounded-full bg-red-500 opacity-75"></div>
          <div class="relative text-red-600">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
      `;

            // Add new marker
            marker.current = new mapboxgl.Marker({
                element: el,
            })
                .setLngLat([userLocation.longitude, userLocation.latitude])
                .addTo(map.current);
        }
    }, [userLocation]);

    useEffect(() => {
        // Get user location
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000,
                }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <section className="w-full h-[70vh] relative">
            <div
                ref={mapContainer}
                className="w-full h-full absolute top-0 left-0"
            />

            {/* Location status indicator */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md z-10">
                {userLocation ? (
                    <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-red-600" />
                        <span className="text-sm font-medium">
              {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
            </span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-sm font-medium">Getting your location...</span>
                    </div>
                )}
            </div>
        </section>
    );
}