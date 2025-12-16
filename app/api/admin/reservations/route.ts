import { type NextRequest, NextResponse } from "next/server"

// Mock data - in real app, this would query the database
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
    customerEmail: "alice@example.com",
    customerPhone: "+62 812 1111 1111",
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
    customerEmail: "mike@example.com",
    customerPhone: "+62 812 2222 2222",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  let filteredReservations = mockReservations
  if (date && date !== "all") {
    filteredReservations = mockReservations.filter((reservation) => reservation.date === date)
  }

  return NextResponse.json({
    success: true,
    reservations: filteredReservations,
    total: filteredReservations.length,
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const { reservationId, status } = await request.json()

    // In real app, update reservation status in database
    console.log(`Updating reservation ${reservationId} to status: ${status}`)

    return NextResponse.json({
      success: true,
      message: "Reservation status updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update reservation status" }, { status: 500 })
  }
}
