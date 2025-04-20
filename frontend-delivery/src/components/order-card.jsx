import { Card, CardContent } from "../components/ui/card"
import { cn } from "../lib/utils"

export function OrderCard({ order, isSelected, onSelect }) {
  const statusColors = {
    Assigned: "bg-blue-100 text-blue-800",
    "Picked Up": "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        isSelected ? "border-2 border-black bg-muted" : "border border-gray-200"
      )}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">{order.restaurant}</p>
          </div>
          <span className={cn("rounded-full inline-flex items-center justify-center px-3 py-1 text-sm font-medium", statusColors[order.status])}>
            {order.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">Pickup</p>
            <p className="text-xs text-gray-500">{order.pickupAddress}</p>
          </div>
          <div className="text-sm">
            <p className="font-medium">Delivery</p>
            <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{order.estimatedDeliveryTime}</span>
          <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
