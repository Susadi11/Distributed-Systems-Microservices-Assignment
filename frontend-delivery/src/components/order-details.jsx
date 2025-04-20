"use client"

import { ExternalLink, MapPin, Navigation, Phone, ShoppingBag, User } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
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
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">{order.orderDate}</p>
          </div>
          <Badge className={cn("text-sm", statusColors[order.status])}>{order.status}</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{order.restaurant}</h3>
                <p className="text-sm text-muted-foreground">{order.pickupAddress}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Call Restaurant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.pickupAddress)}`,
                      "_blank",
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{order.customerName}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Call Customer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.deliveryAddress)}`,
                      "_blank",
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Driver Tip</span>
                <span>${order.driverTip.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(order.pickupAddress)}&destination=${encodeURIComponent(order.deliveryAddress)}`,
                "_blank",
              )
            }
          >
            <ExternalLink className="h-4 w-4" />
            View Full Route
          </Button>

          {nextAction && <Button onClick={nextAction.action}>{nextAction.label}</Button>}
        </div>
      </div>
    </div>
  )
}
