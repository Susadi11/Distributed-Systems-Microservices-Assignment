"use client"
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your actual Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export function DriverMap({ driverLocation }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(driverLocation?.longitude || -73.9857);
  const [lat, setLat] = useState(driverLocation?.latitude || 40.7484);
  const [zoom, setZoom] = useState(14);

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocate, 'top-right');

    // Create initial marker
    marker.current = new mapboxgl.Marker({
      color: '#FF0000'
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Auto-locate the driver when map loads
    map.current.on('load', () => {
      geolocate.trigger();
      
      // Add resize handler for the map
      const resizeHandler = () => {
        if (map.current) {
          map.current.resize();
        }
      };
      
      // Listen for resize events
      window.addEventListener('resize', resizeHandler);
      
      // Create a ResizeObserver to detect container size changes
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          if (map.current) {
            map.current.resize();
          }
        });
        
        if (mapContainer.current) {
          ro.observe(mapContainer.current);
        }
      }
      
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    });
  }, [lng, lat, zoom]);

  // Update marker position when driver location changes
  useEffect(() => {
    if (!map.current || !marker.current || !driverLocation) return;
    
    const { longitude, latitude } = driverLocation;
    if (longitude && latitude) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true
      });
      setLng(longitude);
      setLat(latitude);
    }
  }, [driverLocation]);

  // Get current location using browser geolocation
  useEffect(() => {
    if (!map.current || !marker.current) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        marker.current.setLngLat([longitude, latitude]);
        map.current.flyTo({
          center: [longitude, latitude],
          essential: true
        });
        setLng(longitude);
        setLat(latitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="map-container rounded-lg shadow-md" 
      style={{ 
        height: "100%", 
        minHeight: "500px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
    />
  );
}
