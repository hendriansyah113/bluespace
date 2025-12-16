import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customerId")

  if (!customerId) {
    return NextResponse.json({ success: false, message: "Customer ID is required" }, { status: 400 })
  }

  // Mock customer orders - in real app, this would query the database
  const orders = [
    {
      id: "ORD-001",
      customerId,
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
      customerId,
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
  ]

  return NextResponse.json({
    success: true,
    orders,
    total: orders.length,
  })
}
