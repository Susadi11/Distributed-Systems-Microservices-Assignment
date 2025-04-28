"use client"
import { useState, useEffect } from "react"
import { DriverDashboard } from "../components/driver-dashboard.jsx"
import { OrderDetails } from "../components/order-details.jsx"
import { mockOrders } from "../data/mock-orders.js"

export function DashboardView() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  
  const selectedOrder = orders.find((order) => order.id === selectedOrderId)
  
  // Get initial location when component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);
  
  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <DriverDashboard 
          orders={orders} 
          selectedOrderId={selectedOrderId} 
          onSelectOrder={setSelectedOrderId} 
          driverLocation={driverLocation}
        />
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 md:relative md:inset-auto md:bg-transparent md:z-auto">
            <div className="h-full w-full md:max-w-md bg-white shadow-lg md:border-l">
              <OrderDetails 
                order={selectedOrder} 
                onUpdateStatus={updateOrderStatus} 
                onClose={() => setSelectedOrderId(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
