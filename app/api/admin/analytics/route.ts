import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "today"

  // Mock analytics data - in real app, this would query the database
  const analyticsData = {
    todayOrders: 24,
    todayRevenue: 2450000,
    todayReservations: 12,
    avgOrderValue: 102083,
    orderTypes: {
      dine_in: { count: 11, percentage: 45 },
      takeaway: { count: 8, percentage: 33 },
      delivery: { count: 5, percentage: 22 },
    },
    popularItems: [
      { name: "Cappuccino", orders: 15, revenue: 420000 },
      { name: "Latte", orders: 12, revenue: 360000 },
      { name: "Croissant", orders: 8, revenue: 120000 },
    ],
    peakHours: [
      { time: "8:00-10:00", orders: 8 },
      { time: "12:00-14:00", orders: 10 },
      { time: "15:00-17:00", orders: 6 },
    ],
    revenueByHour: [
      { hour: 8, revenue: 180000 },
      { hour: 9, revenue: 220000 },
      { hour: 10, revenue: 150000 },
      { hour: 11, revenue: 190000 },
      { hour: 12, revenue: 280000 },
      { hour: 13, revenue: 320000 },
      { hour: 14, revenue: 240000 },
      { hour: 15, revenue: 160000 },
      { hour: 16, revenue: 200000 },
      { hour: 17, revenue: 180000 },
    ],
  }

  return NextResponse.json({
    success: true,
    data: analyticsData,
    period,
  })
}
