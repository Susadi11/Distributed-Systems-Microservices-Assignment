"use client"

import { useState } from "react"
import { DriverDashboard } from "../components/driver-dashboard.jsx"
import { OrderDetails } from "../components/order-details.jsx"
import { mockOrders } from "../data/mock-orders.js"

export function DashboardView() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const selectedOrder = orders.find((order) => order.id === selectedOrderId)

  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <DriverDashboard orders={orders} selectedOrderId={selectedOrderId} onSelectOrder={setSelectedOrderId} />
      {selectedOrder && <OrderDetails order={selectedOrder} onUpdateStatus={updateOrderStatus} />}
    </div>
  )
}
