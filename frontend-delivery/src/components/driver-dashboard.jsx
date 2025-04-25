"use client"

import { useState } from "react"
import { Bell, ChevronDown, ClipboardList, Home, LogOut, Menu, MessageSquare, Settings, User } from "lucide-react"
import { OrderCard } from "../components/order-card.jsx"
import { Button } from "../components/ui/button.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.jsx"

export function DriverDashboard({ orders, selectedOrderId, onSelectOrder }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const activeOrders = orders.filter((order) => order.status === "Assigned" || order.status === "Picked Up")

  const completedOrders = orders.filter((order) => order.status === "Delivered")

  return (
    <div className="flex h-full w-full flex-col border-r bg-background md:w-[350px] lg:w-[400px]">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                <Button variant="ghost" className="justify-start gap-2">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Order History
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">Driver Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Driver" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between border-b px-4 py-2">
        <div>
          <h2 className="text-sm font-medium">John Driver</h2>
          <p className="text-xs text-muted-foreground">Online • Available for deliveries</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              Available <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Available</DropdownMenuItem>
            <DropdownMenuItem>On Break</DropdownMenuItem>
            <DropdownMenuItem>Offline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Orders
              {activeOrders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedOrders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {completedOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeOrders.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No active orders</p>
                <p className="text-xs text-muted-foreground">New orders will appear here</p>
              </div>
            ) : (
              activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={order.id === selectedOrderId}
                  onSelect={() => onSelectOrder(order.id)}
                />
              ))
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedOrders.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No completed orders today</p>
              </div>
            ) : (
              completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={order.id === selectedOrderId}
                  onSelect={() => onSelectOrder(order.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
