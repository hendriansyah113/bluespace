import { type NextRequest, NextResponse } from "next/server"

// Mock data - in real app, this would query the database
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    type: "dine_in",
    status: "preparing",
    total: 85000,
    items: [
      { name: "Cappuccino", quantity: 2, price: 28000 },
      { name: "Croissant", quantity: 1, price: 15000 },
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
      { name: "Latte", quantity: 1, price: 30000 },
      { name: "Blueberry Muffin", quantity: 1, price: 18000 },
    ],
    createdAt: "2025-01-20T11:00:00Z",
    estimatedReady: "2025-01-20T11:10:00Z",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  let filteredOrders = mockOrders
  if (status && status !== "all") {
    filteredOrders = mockOrders.filter((order) => order.status === status)
  }

  return NextResponse.json({
    success: true,
    orders: filteredOrders,
    total: filteredOrders.length,
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    // In real app, update order status in database
    console.log(`Updating order ${orderId} to status: ${status}`)

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update order status" }, { status: 500 })
  }
}
