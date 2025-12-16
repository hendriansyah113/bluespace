"use client"

import { useState } from "react"
import { Coffee, Search, Clock, CheckCircle, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock order tracking data
const mockOrderTracking = {
  "ORD-001": {
    id: "ORD-001",
    customerName: "John Doe",
    type: "dine_in",
    status: "completed",
    total: 85000,
    items: [
      { name: "Cappuccino", quantity: 2, price: 28000 },
      { name: "Croissant", quantity: 1, price: 15000 },
    ],
    timeline: [
      { status: "confirmed", time: "2025-01-20T10:30:00Z", message: "Order confirmed" },
      { status: "preparing", time: "2025-01-20T10:35:00Z", message: "Kitchen started preparing your order" },
      { status: "ready", time: "2025-01-20T10:50:00Z", message: "Order ready for pickup" },
      { status: "completed", time: "2025-01-20T11:00:00Z", message: "Order completed" },
    ],
    estimatedReady: "2025-01-20T10:50:00Z",
  },
  "ORD-002": {
    id: "ORD-002",
    customerName: "Jane Smith",
    type: "delivery",
    status: "preparing",
    total: 120000,
    items: [
      { name: "Club Sandwich", quantity: 1, price: 45000 },
      { name: "Cold Brew", quantity: 2, price: 32000 },
    ],
    timeline: [
      { status: "confirmed", time: "2025-01-20T11:15:00Z", message: "Order confirmed" },
      { status: "preparing", time: "2025-01-20T11:20:00Z", message: "Kitchen started preparing your order" },
    ],
    estimatedReady: "2025-01-20T11:45:00Z",
    deliveryAddress: "Jl. Sudirman No. 45, Jakarta",
  },
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("")
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-accent" />
      case "preparing":
        return <Package className="w-5 h-5 text-chart-2" />
      case "ready":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-chart-2" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "ready":
        return "bg-accent text-accent-foreground"
      case "preparing":
      case "out_for_delivery":
        return "bg-chart-2 text-white"
      case "completed":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const order = mockOrderTracking[orderId.toUpperCase() as keyof typeof mockOrderTracking]
      if (order) {
        setOrderData(order)
        setError("")
      } else {
        setError("Order not found. Please check your order ID and try again.")
        setOrderData(null)
      }
      setIsLoading(false)
    }, 1000)
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
                <p className="text-sm text-muted-foreground">Order Tracking</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/menu" className="text-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/customer" className="text-foreground hover:text-primary transition-colors">
                My Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Track Your Order</h2>
            <p className="text-muted-foreground">Enter your order ID to see the current status and estimated time</p>
          </div>

          {/* Order ID Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Order
              </CardTitle>
              <CardDescription>Enter the order ID from your receipt or confirmation email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter Order ID (e.g., ORD-001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                </div>
                <Button onClick={handleTrackOrder} disabled={isLoading}>
                  {isLoading ? "Searching..." : "Track Order"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </CardContent>
          </Card>

          {/* Order Details */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{orderData.id}</CardTitle>
                      <CardDescription>Order for {orderData.customerName}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(orderData.status)} className="capitalize">
                      {orderData.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Order Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Order Type:</span>
                          <span className="capitalize">{orderData.type.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Amount:</span>
                          <span className="font-medium">{formatPrice(orderData.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Estimated Ready:</span>
                          <span>{formatDateTime(orderData.estimatedReady)}</span>
                        </div>
                        {orderData.deliveryAddress && (
                          <div className="flex justify-between text-sm">
                            <span>Delivery Address:</span>
                            <span className="text-right max-w-48">{orderData.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Items Ordered</h4>
                      <div className="space-y-2">
                        {orderData.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Progress</CardTitle>
                  <CardDescription>Track your order status in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium capitalize">{step.status.replace("_", " ")}</p>
                            <span className="text-sm text-muted-foreground">{formatDateTime(step.time)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.message}</p>
                        </div>
                      </div>
                    ))}

                    {/* Next Steps */}
                    {orderData.status === "preparing" && (
                      <div className="flex items-start gap-4 opacity-50">
                        <div className="flex-shrink-0 mt-1">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Ready for {orderData.type === "delivery" ? "delivery" : "pickup"}
                          </p>
                          <p className="text-sm text-muted-foreground">We'll notify you when your order is ready</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/menu">Order Again</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/customer">My Account</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Sample Order IDs for Demo */}
          {!orderData && (
            <Card>
              <CardHeader>
                <CardTitle>Try These Sample Orders</CardTitle>
                <CardDescription>For demonstration purposes, try tracking these order IDs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOrderId("ORD-001")
                      setTimeout(() => handleTrackOrder(), 100)
                    }}
                    className="justify-start bg-transparent"
                  >
                    ORD-001 - Completed dine-in order
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOrderId("ORD-002")
                      setTimeout(() => handleTrackOrder(), 100)
                    }}
                    className="justify-start bg-transparent"
                  >
                    ORD-002 - Delivery order in progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
