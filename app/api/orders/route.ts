import { type NextRequest, NextResponse } from "next/server"

// Mock database operations - in real app, this would use actual database
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Simulate order creation
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In real app, save to database here
    console.log("Order created:", order)

    return NextResponse.json({
      success: true,
      order,
      message: "Order created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
  }

  // Mock order retrieval
  const order = {
    id: orderId,
    type: "dine_in",
    status: "pending",
    total: 110000,
    items: [
      { name: "Blue Space Signature Blend", quantity: 2, price: 25000 },
      { name: "Croissant", quantity: 1, price: 15000 },
    ],
    customerInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+62 812 3456 7890",
    },
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({ success: true, order })
}
