import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;


export default function LocationPicker({ onLocationSelect }) {
  const mapContainerRef = useRef(null)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const markersRef = useRef([]) // Keep track of all markers to ensure proper cleanup

  // Default center coordinates (can be adjusted as needed)
  const defaultCenter = { lat: 6.927079, lng: 79.861244 } // Sri Lanka coordinates

  // Mapbox access token - using your provided token
  // const mapboxToken = "pk.eyJ1Ijoic3VzYWRpIiwiYSI6ImNtOWw3YzkzczAxd3cyanF1bm9rZWducW0ifQ.VqfXWKCzLNczBE-sFmrSWA"

  // Function to clear all markers from the map
  const clearAllMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker) marker.remove()
      })
      markersRef.current = []
    }
  }

  useEffect(() => {
    // Load the Mapbox GL JS library dynamically
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !window.mapboxgl) {
        // Add Mapbox CSS
        const linkEl = document.createElement("link")
        linkEl.rel = "stylesheet"
        linkEl.href = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css"
        document.head.appendChild(linkEl)

        // Load Mapbox JS
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"
        document.head.appendChild(script)

        return new Promise((resolve) => {
          script.onload = () => resolve(window.mapboxgl)
        })
      }
      return window.mapboxgl
    }

    const initMap = async () => {
      try {
        const mapboxgl = await loadMapbox()
        mapboxgl.accessToken = mapboxToken

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              createMap(mapboxgl, userLocation)
            },
            (error) => {
              console.log("Geolocation error:", error)
              createMap(mapboxgl, defaultCenter)
            },
          )
        } else {
          createMap(mapboxgl, defaultCenter)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setIsLoading(false)
      }
    }

    const createMap = (mapboxgl, center) => {
      if (mapContainerRef.current && !map) {
        // Initialize the map
        const mapInstance = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [center.lng, center.lat],
          zoom: 13,
        })

        // Add navigation controls
        mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right")

        // Add click event to the map
        mapInstance.on("click", (e) => {
          const lat = e.lngLat.lat
          const lng = e.lngLat.lng
          const newLocation = { lat, lng }

          // Clear all existing markers
          clearAllMarkers()

          // Add new marker
          const newMarker = new mapboxgl.Marker({
            color: "#FF0000", // Red color for better visibility
            draggable: false,
          })
            .setLngLat([lng, lat])
            .addTo(mapInstance)

          // Store the marker reference both in state and in our ref array
          setMarker(newMarker)
          markersRef.current.push(newMarker)

          // Update selected location
          setSelectedLocation(newLocation)

          // Call the callback function with the selected location
          if (onLocationSelect) {
            onLocationSelect(newLocation)
          }
        })

        mapInstance.on("load", () => {
          setIsLoading(false)
        })

        setMap(mapInstance)
      }
    }

    initMap()

    // Cleanup function
    return () => {
      clearAllMarkers()
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Handle window resize to make the map responsive
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        map.resize()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [map])

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="h-[300px] w-full rounded-md"
        aria-label="Map for selecting your location"
      ></div>
      {!selectedLocation && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-75 p-3 rounded-md shadow-sm text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">Click anywhere on the map to set your location</p>
          </div>
        </div>
      )}
    </div>
  )
}
