import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    const { orderId, paymentMethod, amount } = paymentData

    // Simulate payment processing
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId,
      paymentMethod,
      amount,
      status: paymentMethod === "cash" ? "pending" : "processing",
      createdAt: new Date().toISOString(),
    }

    // For QRIS payments, simulate async processing
    if (paymentMethod === "qris") {
      // In real app, this would integrate with actual QRIS payment gateway
      setTimeout(() => {
        console.log(`QRIS payment ${payment.id} completed`)
      }, 5000)
    }

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment initiated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Payment processing failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get("paymentId")

  if (!paymentId) {
    return NextResponse.json({ success: false, message: "Payment ID is required" }, { status: 400 })
  }

  // Mock payment status check
  const payment = {
    id: paymentId,
    status: "completed",
    amount: 110000,
    paymentMethod: "qris",
    completedAt: new Date().toISOString(),
  }

  return NextResponse.json({ success: true, payment })
}
