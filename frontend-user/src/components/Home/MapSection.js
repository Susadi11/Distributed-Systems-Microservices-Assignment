import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export function MapSection() {
    const [userLocation, setUserLocation] = useState(null);
    const [mapImageUrl, setMapImageUrl] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    const zoom = 14;
                    // Use window dimensions for full-width map
                    const width = window.innerWidth;
                    const height = 500; // Fixed height or you could make this responsive too
                    setMapImageUrl(
                        `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&z=${zoom}&size=${width},${height}&l=map`
                    );
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <section className="w-full">
            <div className="relative w-full h-[500px]">
                {mapImageUrl ? (
                    <>
                        <img
                            src={mapImageUrl}
                            alt="Map of your location"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <FaMapMarkerAlt className="h-10 w-10 text-red-600 animate-ping absolute" />
                            <FaMapMarkerAlt className="h-10 w-10 text-red-600 relative" />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <p className="text-gray-600 font-medium text-center">
                            Loading your location...
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}