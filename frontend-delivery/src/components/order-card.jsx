"use client"

import { Clock, MapPin } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { cn } from "../lib/utils.js"

export function OrderCard({ order, isSelected, onSelect }) {
  const statusColors = {
    Assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Picked Up": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    Delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card
      className={cn("cursor-pointer transition-colors hover:bg-muted/50", isSelected && "border-primary bg-muted/50")}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">Order #{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">{order.restaurant}</p>
          </div>
          <Badge className={cn("ml-auto", statusColors[order.status])}>{order.status}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Pickup</p>
              <p className="text-xs text-muted-foreground">{order.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Delivery</p>
              <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{order.estimatedDeliveryTime}</span>
          </div>
          <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
