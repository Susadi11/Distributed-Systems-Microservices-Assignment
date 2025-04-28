"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, ChevronDown, ClipboardList, Home, LogOut, Menu, MessageSquare, Settings, User, MapPin } from "lucide-react"
import { OrderCard } from "../components/order-card.jsx"
import { Button } from "../components/ui/button.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import { DriverMap } from "../components/driverMap.jsx"
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
  const [driver, setDriver] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    if (token) {
      axios
        .get("http://localhost:5555/auth/me", { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        .then((res) => {
          setDriver(res.data.user);
          console.log("Me response:", res.data.user);
        })
        .catch((err) => {
          console.error("Failed to fetch driver profile:", err);
        });
    }
  }, []);

  // Track driver's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setDriverLocation({ longitude, latitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setDriverLocation({ longitude, latitude });
        
        // In a real app, you would send this to your backend
        if (driver && driver.id) {
          axios.post("http://localhost:5555/driver/update-location", {
            driverId: driver.id,
            location: { longitude, latitude }
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("driverToken")}` }
          }).catch(err => {
            console.error("Failed to update driver location:", err);
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [driver]);

  const activeOrders = orders.filter((order) => order.status === "Assigned" || order.status === "Picked Up")
  const completedOrders = orders.filter((order) => order.status === "Delivered")

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-gray-500" />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Menu</h2>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <nav className="space-y-1 px-2">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={driver?.profileImage} />
                        <AvatarFallback>{driver?.name?.charAt(0) || "D"}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{driver?.name || "Driver"}</p>
                        <div className="flex items-center">
                          <Badge variant="outline" className="rounded-full bg-green-100 text-green-800 text-xs">
                            Online • Available
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content - Simplified Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pt-14 md:pt-0">
        {/* Map Section - Enlarged */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            {/* Enhanced Driver Details Section */}
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-lg font-semibold flex items-center mb-3 md:mb-0">
                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                  Live Location
                </h2>
                <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
                  <div className="flex items-center mb-2 md:mb-0 md:mr-4">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={driver?.profileImage} />
                      <AvatarFallback className="text-lg">{driver?.name?.charAt(0) || "D"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-base">{driver?.name || "Driver Name"}</p>
                      <p className="text-sm text-gray-500">{driver?.email || "driver@example.com"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <Badge variant="outline" className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm mb-2 md:mb-0 md:mr-2">
                      Online • Available for deliveries
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Status <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Online • Available</DropdownMenuItem>
                        <DropdownMenuItem>Online • Busy</DropdownMenuItem>
                        <DropdownMenuItem>Offline</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <DriverMap driverLocation={driverLocation} />
            </div>
          </div>
        </div>

        {/* Orders Section - Enlarged */}
        <div className="md:w-96 bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Orders</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Filter <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Orders</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Orders</DropdownMenuItem>
                <DropdownMenuItem>Active Orders</DropdownMenuItem>
                <DropdownMenuItem>Completed Orders</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 overflow-auto">
            <Tabs defaultValue="active" className="w-full">
              <div className="px-4 pt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="active" className="p-4 space-y-4">
                {activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isSelected={order.id === selectedOrderId}
                      onSelect={() => onSelectOrder(order.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No active orders</h3>
                    <p className="mt-1 text-sm text-gray-500">New orders will appear here</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed" className="p-4 space-y-4">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isSelected={order.id === selectedOrderId}
                      onSelect={() => onSelectOrder(order.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No completed orders today</h3>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
