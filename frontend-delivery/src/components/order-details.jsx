"use client"
import { ExternalLink, MapPin, Navigation, Phone, ShoppingBag, User, Clock } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { cn } from "../lib/utils.js"

export function OrderDetails({ order, onUpdateStatus }) {
  const statusColors = {
    Assigned: "bg-blue-100 text-blue-700 font-semibold",
    "Picked Up": "bg-yellow-100 text-yellow-700 font-semibold",
    Delivered: "bg-green-100 text-green-700 font-semibold",
    Cancelled: "bg-red-100 text-red-700 font-semibold",
  }

  const getNextAction = () => {
    switch (order.status) {
      case "Assigned":
        return {
          label: "Mark as Picked Up",
          action: () => onUpdateStatus(order.id, "Picked Up"),
        }
      case "Picked Up":
        return {
          label: "Mark as Delivered",
          action: () => onUpdateStatus(order.id, "Delivered"),
        }
      default:
        return null
    }
  }

  const nextAction = getNextAction()

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-200 shadow-md">
        <CardHeader className="bg-gray-50 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Order #{order.orderNumber}</CardTitle>
              <p className="text-gray-500 text-sm">{order.orderDate}</p>
            </div>
            <Badge className={cn("px-3 py-1 rounded-full", statusColors[order.status])}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <ShoppingBag size={18} />
                <h3 className="text-lg">Pickup Details</h3>
              </div>
              <Card className="bg-blue-50 border-none">
                <CardContent className="p-4">
                  <div className="font-semibold text-lg mb-1">{order.restaurant}</div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span>{order.pickupAddress}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 bg-white"
                    onClick={() => window.open(`https://maps.google.com/?q=${order.pickupAddress}`, '_blank')}
                  >
                    <Navigation size={14} className="mr-1" /> Directions
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <User size={18} />
                <h3 className="text-lg">Delivery Details</h3>
              </div>
              <Card className="bg-green-50 border-none">
                <CardContent className="p-4">
                  <div className="font-semibold text-lg mb-1">{order.customerName}</div>
                  <div className="flex items-start gap-2 text-gray-700 mb-2">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 bg-white"
                      onClick={() => window.open(`tel:${order.customerPhone}`)}
                    >
                      <Phone size={14} className="mr-1" /> Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 bg-white"
                      onClick={() => window.open(`https://maps.google.com/?q=${order.deliveryAddress}`, '_blank')}
                    >
                      <Navigation size={14} className="mr-1" /> Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-purple-600 font-medium mb-3">
              <ShoppingBag size={18} />
              <h3 className="text-lg">Order Items</h3>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                      <div className="font-semibold">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${order.deliveryFee?.toFixed(2) || '0.00'}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Time */}
          <div className="mt-4 flex items-center gap-2 text-gray-700">
            <Clock size={16} />
            <span>Estimated delivery: {order.estimatedDeliveryTime}</span>
          </div>
        </CardContent>

        {nextAction && (
          <CardFooter className="bg-gray-50 flex justify-end pt-4">
            <Button 
              onClick={nextAction.action}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {nextAction.label}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
