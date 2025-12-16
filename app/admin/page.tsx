"use client"

import { useState } from "react"
import { Coffee, ShoppingBag, Calendar, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// Mock data - in real app this would come from API
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    type: "dine_in",
    status: "preparing",
    total: 85000,
    items: [
      { name: "Cappuccino", quantity: 2 },
      { name: "Croissant", quantity: 1 },
    ],
    createdAt: "2025-01-20T10:30:00Z",
    estimatedReady: "2025-01-20T10:45:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    type: "takeaway",
    status: "ready",
    total: 45000,
    items: [
      { name: "Latte", quantity: 1 },
      { name: "Blueberry Muffin", quantity: 1 },
    ],
    createdAt: "2025-01-20T11:00:00Z",
    estimatedReady: "2025-01-20T11:10:00Z",
  },
  {
    id: "ORD-003",
    customerName: "Bob Wilson",
    type: "delivery",
    status: "confirmed",
    total: 120000,
    items: [
      { name: "Club Sandwich", quantity: 1 },
      { name: "Cold Brew", quantity: 2 },
    ],
    createdAt: "2025-01-20T11:15:00Z",
    estimatedReady: "2025-01-20T11:35:00Z",
  },
]

const mockReservations = [
  {
    id: "RES-001",
    customerName: "Alice Johnson",
    tableNumber: "T03",
    partySize: 4,
    date: "2025-01-20",
    time: "12:00",
    status: "confirmed",
    specialRequests: "Window seat preferred",
  },
  {
    id: "RES-002",
    customerName: "Mike Brown",
    tableNumber: "T06",
    partySize: 2,
    date: "2025-01-20",
    time: "14:30",
    status: "confirmed",
    specialRequests: "",
  },
  {
    id: "RES-003",
    customerName: "Sarah Davis",
    tableNumber: "T09",
    partySize: 8,
    date: "2025-01-21",
    time: "19:00",
    status: "confirmed",
    specialRequests: "Birthday celebration",
  },
]

const mockStats = {
  todayOrders: 24,
  todayRevenue: 2450000,
  todayReservations: 12,
  avgOrderValue: 102083,
  popularItems: [
    { name: "Cappuccino", orders: 15 },
    { name: "Latte", orders: 12 },
    { name: "Croissant", orders: 8 },
  ],
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "ready":
        return "bg-accent text-accent-foreground"
      case "preparing":
        return "bg-chart-2 text-white"
      case "completed":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In real app, this would update via API
    console.log(`Updating order ${orderId} to ${newStatus}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Blue Space Coffee</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/menu" className="text-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/reservations" className="text-foreground hover:text-primary transition-colors">
                Reservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.todayOrders}</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(mockStats.todayRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.todayReservations}</div>
                  <p className="text-xs text-muted-foreground">Today's bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(mockStats.avgOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                  <CardDescription>Most ordered items today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStats.popularItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <p className="font-medium">{item.name}</p>
                        </div>
                        <Badge variant="secondary">{item.orders} orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reservation Management</h2>
              <Select defaultValue="today">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reservation ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Party Size</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Special Requests</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reservation.tableNumber}</Badge>
                      </TableCell>
                      <TableCell>{reservation.partySize} people</TableCell>
                      <TableCell>
                        {new Date(`${reservation.date}T${reservation.time}`).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-48 truncate">{reservation.specialRequests || "None"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Types Distribution</CardTitle>
                  <CardDescription>Breakdown of order types today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Dine In</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">45%</span>
                        <p className="text-sm text-muted-foreground">11 orders</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span>Takeaway</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">33%</span>
                        <p className="text-sm text-muted-foreground">8 orders</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                        <span>Delivery</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">22%</span>
                        <p className="text-sm text-muted-foreground">5 orders</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Busiest times today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>8:00 - 10:00 AM</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-primary"></div>
                        </div>
                        <span className="text-sm">8 orders</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>12:00 - 2:00 PM</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-full h-full bg-primary"></div>
                        </div>
                        <span className="text-sm">10 orders</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3:00 - 5:00 PM</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/5 h-full bg-primary"></div>
                        </div>
                        <span className="text-sm">6 orders</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>Financial overview for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{formatPrice(mockStats.todayRevenue)}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{formatPrice(mockStats.avgOrderValue)}</p>
                    <p className="text-sm text-muted-foreground">Average Order</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-2">{mockStats.todayOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
