import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check,
    Clock,
    ChevronLeft,
    Phone,
    MessageSquare,
    User,
    ShoppingBag,
    Store,
    MapPin,
    Navigation,
    AlertCircle
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox with your token from .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// The 5 specific phases of delivery
const phases = [
    { id: 1, label: 'Order Confirmed', icon: AlertCircle, description: 'Restaurant confirming your order', color: '#FF3B30' },
    { id: 2, label: 'Finding Driver', icon: User, description: 'Looking for delivery partner', color: '#FF3B30' },
    { id: 3, label: 'Preparing', icon: Store, description: 'Restaurant preparing your order', color: '#FF3B30' },
    { id: 4, label: 'On The Way', icon: ShoppingBag, description: 'Driver picking up your order', color: '#FF3B30' },
    { id: 5, label: 'Delivered', icon: Navigation, description: 'Driver delivering to you', color: '#FF3B30' }
];

const Pending = () => {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [orderStatus, setOrderStatus] = useState('pending');
    const [driverInfo, setDriverInfo] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState('25-35 min');
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    // Map references
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef({
        user: null,
        restaurant: null,
        driver: null
    });
    const routeLine = useRef(null);

    // Positions
    const [restaurantPosition, setRestaurantPosition] = useState([79.9701, 6.9142]); // Barista Malabe [lng, lat]
    const [userPosition, setUserPosition] = useState([79.9730, 6.9147]); // Default to SLIIT [lng, lat]
    const [driverPosition, setDriverPosition] = useState([79.9680, 6.9120]); // Initial random driver position [lng, lat]
    const [routePath, setRoutePath] = useState([]);
    const CurrentIcon = phases[currentPhase - 1].icon;

    // Order details
    const orderDetails = {
        orderId: 'UB38921EF',
        restaurant: 'Barista Malabe',
        items: [
            { name: 'Barista Express', quantity: 1, price: 1250 },
            { name: 'Cappuccino', quantity: 2, price: 450 },
            { name: 'Chocolate Cake', quantity: 1, price: 650 }
        ],
        subtotal: 2800,
        deliveryFee: 200,
        discount: 150,
        total: 2850
    };

    // Initialize Mapbox map
    useEffect(() => {
        if (!process.env.REACT_APP_MAPBOX_TOKEN) {
            console.error("Missing Mapbox token - add REACT_APP_MAPBOX_TOKEN to .env");
            setMapError(true);
            return;
        }

        if (map.current) return; // Initialize map only once

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: userPosition,
                zoom: 15
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            map.current.on('load', () => {
                setMapLoaded(true);
                updateMarkers();
                if (routePath.length > 0) {
                    updateRoute();
                }
            });

            map.current.on('error', (e) => {
                console.error("Mapbox error:", e);
                setMapError(true);
            });

        } catch (error) {
            console.error("Error initializing Mapbox:", error);
            setMapError(true);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = [position.coords.longitude, position.coords.latitude];
                    setUserPosition(newPos);
                    if (map.current) {
                        map.current.flyTo({
                            center: newPos,
                            zoom: 15,
                            essential: true
                        });
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback to SLIIT coordinates if location access is denied
                    setUserPosition([79.9730, 6.9147]);
                }
            );
        }
    }, []);

    // Generate a path for the driver
    useEffect(() => {
        if (driverInfo && userPosition && restaurantPosition) {
            const generatePath = () => {
                const path = [restaurantPosition];
                const steps = 10;

                for (let i = 1; i < steps; i++) {
                    const factor = i / steps;
                    const lng = restaurantPosition[0] + (userPosition[0] - restaurantPosition[0]) * factor;
                    const lat = restaurantPosition[1] + (userPosition[1] - restaurantPosition[1]) * factor;

                    // Add some randomness to make it look more like a road
                    const latOffset = (Math.random() - 0.5) * 0.0015;
                    const lngOffset = (Math.random() - 0.5) * 0.0015;

                    path.push([lng + lngOffset, lat + latOffset]);
                }

                path.push(userPosition);
                return path;
            };

            setRoutePath(generatePath());
        }
    }, [driverInfo, userPosition, restaurantPosition]);

    // Update route when path changes
    useEffect(() => {
        if (mapLoaded && routePath.length > 0) {
            updateRoute();
        }
    }, [routePath, mapLoaded]);

    // Update markers when positions change
    useEffect(() => {
        if (mapLoaded) {
            updateMarkers();
            updateMapView();
        }
    }, [userPosition, restaurantPosition, driverPosition, driverInfo, mapLoaded]);

    // Update map view based on current phase
    const updateMapView = () => {
        if (!map.current) return;

        let centerPos;
        if (currentPhase >= 4) {
            centerPos = driverPosition;
        } else if (currentPhase >= 2) {
            centerPos = restaurantPosition;
        } else {
            centerPos = userPosition;
        }

        map.current.flyTo({
            center: centerPos,
            zoom: 15,
            essential: true
        });
    };

    // Update all markers on the map
    const updateMarkers = () => {
        if (!map.current) return;

        // Remove existing markers
        Object.values(markers.current).forEach(marker => {
            if (marker) marker.remove();
        });

        // User marker
        markers.current.user = new mapboxgl.Marker({
            element: createMarkerElement('user', '#34C759')
        })
            .setLngLat(userPosition)
            .setPopup(new mapboxgl.Popup().setHTML(`
                <div class="font-medium">Delivery Location</div>
                <div class="text-sm">Your current location</div>
            `))
            .addTo(map.current);

        // Restaurant marker
        markers.current.restaurant = new mapboxgl.Marker({
            element: createMarkerElement('restaurant', '#FF9500')
        })
            .setLngLat(restaurantPosition)
            .setPopup(new mapboxgl.Popup().setHTML(`
                <div class="font-medium">${orderDetails.restaurant}</div>
                <div class="text-sm">Preparing your order</div>
            `))
            .addTo(map.current);

        // Driver marker (if assigned)
        if (driverInfo) {
            markers.current.driver = new mapboxgl.Marker({
                element: createDriverMarkerElement()
            })
                .setLngLat(driverPosition)
                .setPopup(new mapboxgl.Popup().setHTML(`
                    <div class="font-medium">Your Driver</div>
                    <div class="text-sm">${driverInfo.name}</div>
                    <div class="text-sm">${driverInfo.vehicle} (${driverInfo.licensePlate})</div>
                `))
                .addTo(map.current);
        }
    };

    // Update the route line on the map
    const updateRoute = () => {
        if (!map.current) return;

        // Remove existing route line if it exists
        if (routeLine.current) {
            if (map.current.getLayer('route')) {
                map.current.removeLayer('route');
            }
            if (map.current.getSource('route')) {
                map.current.removeSource('route');
            }
        }

        // Add the new route line
        map.current.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routePath
                }
            }
        });

        map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#FF3B30',
                'line-width': 4,
                'line-opacity': 0.7,
                'line-dasharray': [2, 2]
            }
        });

        // Fit the map to the bounds of the route
        const bounds = new mapboxgl.LngLatBounds();
        routePath.forEach(point => bounds.extend(point));
        map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
        });
    };

    // Create marker element
    const createMarkerElement = (iconName, color) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
            <div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            ">
                ${iconName === 'user' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' :
            iconName === 'restaurant' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'}
            </div>
        `;
        return el;
    };

    // Create driver marker element
    const createDriverMarkerElement = () => {
        const el = document.createElement('div');
        el.className = 'driver-marker';
        el.innerHTML = `
            <div style="
                position: relative;
                width: 48px;
                height: 48px;
            ">
                <div style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background-color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    border: 2px solid #FF3B30;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4.5 16.5c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3z"/>
                        <path d="M19.5 16.5c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3z"/>
                        <path d="M14 15V9c0-1 1-2 2-2h1.5"/>
                        <path d="M17.5 9.5L19 7l2 1-1.5 3.5"/>
                        <path d="M4.5 15v-4.5"/>
                        <path d="M9 15H4.5"/>
                        <path d="M4.5 10.5H9"/>
                        <circle cx="8" cy="6" r="2.5" fill="#FF3B30" stroke="#FF3B30"/>
                    </svg>
                </div>
            </div>
        `;
        return el;
    };

    // Simulate order progress
    useEffect(() => {
        const timeouts = [];

        // Phase 1: Restaurant Confirmation (0-7s)
        timeouts.push(setTimeout(() => {
            setOrderStatus('accepted');
        }, 5000));

        timeouts.push(setTimeout(() => {
            setOrderStatus('payment_charged');
            setCurrentPhase(2); // Move to Phase 2: Finding Driver
        }, 7000));

        // Phase 2: Finding Driver (7-15s)
        timeouts.push(setTimeout(() => {
            setOrderStatus('finding_driver');
        }, 10000));

        // Phase 3: Order Preparation (15-35s)
        timeouts.push(setTimeout(() => {
            setDriverInfo({
                name: 'Kasun Perera',
                rating: 4.8,
                vehicle: 'Honda Click',
                licensePlate: 'WP-BC-3421',
                phone: '+94 71 234 5678'
            });
            setOrderStatus('driver_assigned');
            setCurrentPhase(3); // Move to Phase 3: Order Preparation
        }, 15000));

        timeouts.push(setTimeout(() => {
            setOrderStatus('preparing');
        }, 25000));

        // Phase 4: Order Pickup (35-45s)
        timeouts.push(setTimeout(() => {
            setOrderStatus('ready_for_pickup');
            setCurrentPhase(4); // Move to Phase 4: Order Pickup
        }, 35000));

        // Phase 5: Delivery (45s+)
        timeouts.push(setTimeout(() => {
            setOrderStatus('picked_up');
            setCurrentPhase(5); // Move to Phase 5: Delivery

            // Simulate driver movement
            const moveDriver = setInterval(() => {
                setDriverPosition(prevPos => {
                    const lng = prevPos[0] + (userPosition[0] - prevPos[0]) * 0.1;
                    const lat = prevPos[1] + (userPosition[1] - prevPos[1]) * 0.1;

                    if (Math.abs(lat - userPosition[1]) < 0.0005 && Math.abs(lng - userPosition[0]) < 0.0005) {
                        clearInterval(moveDriver);
                        setOrderStatus('arrived');
                    }

                    return [lng, lat];
                });
            }, 2000);

            timeouts.push(moveDriver);
        }, 45000));

        return () => {
            timeouts.forEach(timer => {
                if (typeof timer === 'number') {
                    clearTimeout(timer);
                } else {
                    clearInterval(timer);
                }
            });
        };
    }, [userPosition]);

    // Status messages based on order status
    const getStatusMessage = () => {
        switch(orderStatus) {
            case 'pending': return 'Waiting for restaurant to accept your order...';
            case 'accepted': return 'Restaurant accepted your order!';
            case 'payment_charged': return 'Payment successful! Finding a driver for you.';
            case 'finding_driver': return 'Looking for a delivery partner...';
            case 'driver_assigned': return `${driverInfo.name} will pick up your order`;
            case 'preparing': return 'Restaurant is preparing your order';
            case 'ready_for_pickup': return 'Your order is ready for pickup';
            case 'picked_up': return `${driverInfo.name} is on the way to you`;
            case 'arrived': return 'Your order has arrived!';
            default: return 'Processing your order...';
        }
    };

    // Get ETA message
    const getETAMessage = () => {
        if (orderStatus === 'arrived') return 'Delivered';
        if (currentPhase >= 3) return `Arriving in ${estimatedTime}`;
        return `Estimated arrival: ${estimatedTime}`;
    };

    return (
        <div className="min-h-screen bg-white mt-20">
            <div className="container mx-auto px-4 py-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="w-20"></div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Progress and Map */}
                    <div className="lg:w-2/3">
                        {/* Order ID */}
                        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Order #{orderDetails.orderId}</p>
                                    <h2 className="font-bold text-gray-900">{orderDetails.restaurant}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{getETAMessage()}</p>
                                    <p className="font-medium text-red-600">LKR {orderDetails.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Progress Bar with 5 Distinct Phases */}
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                            <h3 className="font-semibold text-gray-900 mb-6">Order Progress</h3>

                            {/* Phase icons ABOVE the progress bar */}
                            <div className="flex justify-between mb-2">
                                {phases.map((phase) => (
                                    <div key={phase.id} className="flex flex-col items-center">
                                        <div
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center 
                                                transition-all duration-300 ease-in-out shadow-md
                                                ${currentPhase > phase.id ? 'bg-green-500 text-white' :
                                                currentPhase === phase.id ? 'bg-red-600 text-white ring-4 ring-red-100' :
                                                    'bg-white text-gray-500 border-2 border-gray-200'}
                                            `}
                                        >
                                            {currentPhase > phase.id ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <phase.icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span className={`
                                            mt-2 text-xs font-medium text-center
                                            ${currentPhase >= phase.id ? 'text-gray-900 font-semibold' : 'text-gray-500'}
                                        `}>
                                            {phase.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar with segments - SEPARATED FROM ICONS */}
                            <div className="relative mb-6">
                                <div className="flex h-2">
                                    {phases.map((phase, index) => (
                                        <div key={phase.id} className="flex-1 flex">
                                            <div
                                                className={`h-full flex-1 rounded-full ${index < phases.length - 1 ? 'mr-1' : ''} 
                                                ${currentPhase > phase.id ? 'bg-red-600' :
                                                    currentPhase === phase.id ? 'bg-red-600' :
                                                        'bg-gray-200'}`}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current phase details */}
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-full ${currentPhase > phases.length ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <CurrentIcon className={`w-6 h-6 ${currentPhase > phases.length ? 'text-green-600' : 'text-red-600'}`}/>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-medium text-gray-900">{phases[currentPhase - 1].label}</h4>
                                        <p className="text-sm text-gray-600">{phases[currentPhase - 1].description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                            <div className="flex items-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                    orderStatus === 'pending' ? 'bg-blue-100 text-blue-600' :
                                        orderStatus === 'accepted' ? 'bg-green-100 text-green-600' :
                                            'bg-red-100 text-red-600'
                                }`}>
                                    {orderStatus === 'pending' ? <Clock className="w-6 h-6" /> :
                                        orderStatus === 'accepted' ? <Check className="w-6 h-6" /> :
                                            <Navigation className="w-6 h-6" />}
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">{getStatusMessage()}</h3>
                                    <p className="text-sm text-gray-600">
                                        {currentPhase >= 3 ? 'Your order is on the way' : 'We\'ll update you on your order status'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map - Using Mapbox */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-3">Track your order</h3>
                            <div className="h-96 rounded-xl overflow-hidden border border-gray-200 relative">
                                {/* Error state for map */}
                                {mapError && (
                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center flex-col p-4">
                                        <p className="text-red-600 font-medium mb-2">Unable to load map</p>
                                        <p className="text-sm text-center text-gray-600">Please check your Mapbox token configuration</p>
                                    </div>
                                )}

                                {/* Loading state */}
                                {!mapLoaded && !mapError && (
                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                        <p>Loading map...</p>
                                    </div>
                                )}

                                <div ref={mapContainer} className="h-full w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order and Driver Details */}
                    <div className="lg:w-1/3">
                        {/* Driver information - only show if driver is assigned */}
                        {driverInfo && (
                            <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Your delivery partner</h3>
                                <div className="flex items-center">
                                    <div className="bg-gray-100 rounded-full p-4">
                                        <User className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center">
                                            <h4 className="font-medium text-gray-900">{driverInfo.name}</h4>
                                            <div className="ml-2 flex items-center">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm text-gray-700 ml-1">{driverInfo.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{driverInfo.vehicle} • {driverInfo.licensePlate}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                            <MessageSquare className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                            <Phone className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                            <div className="space-y-3">
                                {orderDetails.items.map((item, index) => (
                                    <div key={index} className="flex justify-between">
                                        <div className="flex">
                                            <span className="font-medium text-gray-900">{item.quantity}x</span>
                                            <span className="ml-2 text-gray-900">{item.name}</span>
                                        </div>
                                        <span className="text-gray-900">LKR {item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>LKR {orderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>LKR {orderDetails.deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Discount</span>
                                    <span className="text-green-600">-LKR {orderDetails.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">LKR {orderDetails.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Star icon for ratings
const Star = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default Pending;