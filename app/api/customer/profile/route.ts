import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customerId")

  if (!customerId) {
    return NextResponse.json({ success: false, message: "Customer ID is required" }, { status: 400 })
  }

  // Mock customer profile - in real app, this would query the database
  const customer = {
    id: customerId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    totalOrders: 15,
    totalSpent: 1250000,
    memberSince: "2024-06-15",
    favoriteItems: [
      { id: 1, name: "Cappuccino", price: 28000, orderCount: 8 },
      { id: 4, name: "Latte", price: 30000, orderCount: 5 },
      { id: 9, name: "Croissant", price: 15000, orderCount: 6 },
    ],
  }

  return NextResponse.json({
    success: true,
    customer,
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const { customerId, name, email, phone } = await request.json()

    // In real app, update customer profile in database
    console.log(`Updating customer ${customerId} profile:`, { name, email, phone })

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 })
  }
}
