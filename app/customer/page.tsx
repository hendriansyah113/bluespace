"use client"

import { useState } from "react"
import { Coffee, ShoppingBag, Calendar, Clock, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Mock customer data - in real app this would come from API/auth
const mockCustomer = {
  id: "CUST-001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+62 812 3456 7890",
  totalOrders: 15,
  totalSpent: 1250000,
  memberSince: "2024-06-15",
}

const mockOrders = [
  {
    id: "ORD-001",
    type: "dine_in",
    status: "completed",
    total: 85000,
    items: [
      { name: "Cappuccino", quantity: 2, price: 28000 },
      { name: "Croissant", quantity: 1, price: 15000 },
    ],
    createdAt: "2025-01-20T10:30:00Z",
    completedAt: "2025-01-20T11:00:00Z",
  },
  {
    id: "ORD-002",
    type: "takeaway",
    status: "ready",
    total: 45000,
    items: [
      { name: "Latte", quantity: 1, price: 30000 },
      { name: "Blueberry Muffin", quantity: 1, price: 18000 },
    ],
    createdAt: "2025-01-20T11:00:00Z",
    estimatedReady: "2025-01-20T11:15:00Z",
  },
  {
    id: "ORD-003",
    type: "delivery",
    status: "preparing",
    total: 120000,
    items: [
      { name: "Club Sandwich", quantity: 1, price: 45000 },
      { name: "Cold Brew", quantity: 2, price: 32000 },
    ],
    createdAt: "2025-01-20T11:15:00Z",
    estimatedReady: "2025-01-20T11:45:00Z",
  },
]

const mockReservations = [
  {
    id: "RES-001",
    tableNumber: "T03",
    partySize: 4,
    date: "2025-01-21",
    time: "19:00",
    status: "confirmed",
    specialRequests: "Birthday celebration",
  },
  {
    id: "RES-002",
    tableNumber: "T06",
    partySize: 2,
    date: "2025-01-22",
    time: "14:30",
    status: "confirmed",
    specialRequests: "",
  },
]

const mockFavorites = [
  { id: 1, name: "Cappuccino", price: 28000, orderCount: 8 },
  { id: 4, name: "Latte", price: 30000, orderCount: 5 },
  { id: 9, name: "Croissant", price: 15000, orderCount: 6 },
]

export default function CustomerDashboard() {
  const [selectedTab, setSelectedTab] = useState("orders")
  const [orderLookup, setOrderLookup] = useState("")

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "ready":
        return <CheckCircle className="w-4 h-4" />
      case "preparing":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
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
                <p className="text-sm text-muted-foreground">My Account</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/menu" className="text-foreground hover:text-primary transition-colors">
                Order Now
              </Link>
              <Link href="/reservations" className="text-foreground hover:text-primary transition-colors">
                Reserve Table
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Customer Profile Header */}
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {mockCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Welcome back, {mockCustomer.name}!</h2>
                <p className="text-muted-foreground">Member since {new Date(mockCustomer.memberSince).getFullYear()}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockCustomer.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatPrice(mockCustomer.totalSpent)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockReservations.length}</p>
                      <p className="text-sm text-muted-foreground">Upcoming Reservations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Order History</h3>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>

              {/* Order Lookup */}
              <Card>
                <CardHeader>
                  <CardTitle>Track Your Order</CardTitle>
                  <CardDescription>Enter your order ID to check the status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter Order ID (e.g., ORD-001)"
                        value={orderLookup}
                        onChange={(e) => setOrderLookup(e.target.value)}
                      />
                    </div>
                    <Button>Track Order</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orders List */}
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{order.id}</h4>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {order.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Ordered on {formatDateTime(order.createdAt)}</p>
                          {order.estimatedReady && order.status !== "completed" && (
                            <p className="text-sm text-accent">
                              Estimated ready: {formatDateTime(order.estimatedReady)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <h5 className="font-medium">Items:</h5>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.status === "ready" && (
                        <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                          <p className="text-sm font-medium text-accent">Your order is ready for pickup!</p>
                        </div>
                      )}

                      {order.status === "preparing" && (
                        <div className="mt-4 p-3 bg-chart-2/10 rounded-lg">
                          <p className="text-sm font-medium text-chart-2">Your order is being prepared...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">My Reservations</h3>
                <Button asChild>
                  <Link href="/reservations">Make Reservation</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {mockReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{reservation.id}</h4>
                            <Badge className={getStatusColor(reservation.status)}>
                              <Calendar className="w-4 h-4 mr-1" />
                              {reservation.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(`${reservation.date}T${reservation.time}`).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>Table {reservation.tableNumber}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{reservation.partySize} people</p>
                        </div>
                      </div>

                      {reservation.specialRequests && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <h5 className="font-medium mb-2">Special Requests:</h5>
                            <p className="text-sm text-muted-foreground">{reservation.specialRequests}</p>
                          </div>
                        </>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Modify
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">My Favorites</h3>
                <Button asChild>
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockFavorites.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{item.name}</h4>
                        <Badge variant="secondary">{item.orderCount} orders</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                        <Button size="sm">
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Order Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <h3 className="text-2xl font-bold">Profile Settings</h3>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={mockCustomer.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={mockCustomer.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={mockCustomer.phone} />
                    </div>
                    <Button>Update Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Get in touch with us</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">+62 21 1234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">info@bluespacecoffee.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Jl. Coffee Street No. 123
                          <br />
                          Jakarta, Indonesia
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
